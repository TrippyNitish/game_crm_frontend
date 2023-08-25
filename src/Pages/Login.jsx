import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setUsers } from '../redux/reducers';
import Cookies from 'js-cookie';
import { baseUrl } from '../services/api';
import captchaImg from './captcha.jpg';
import './Login.css'

const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [details, setDetails] = useState({})

    const [user, setUser] = useState({
        username: ""
    });

    const characters = 'abc123';

    function generateString(length) {
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const captcha = generateString(6) // Function called here and save in captcha variable

    let handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        user[name] = value;
        setUser(user);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (captcha != user.username) {
            alert("Invalid Captcha")
            return
        }

        const url = `${baseUrl}/login`

        const response = await axios.post(url, details)

        if (response.status == 201) {
            alert(`You are not registered, Please contact your owner`)
        }
        else if (response.status == 204) {
            alert("You are disabled please contact your owner")
        }
        else if (response.status == 200) {
            const token = response.data.token
            Cookies.set('userToken', token);
            dispatch(setUsers(response.data))
            if (response.data.designation == 'company')
                navigate(`/dashboard/company`)
            else
                navigate(`/dashboard/user`)
        }

    }
    const handleChangeFormDetails = (formdata) => {
        setDetails({ ...details, ...formdata })
    }

    const checkTokenExist = async () => {
        const cookie = Cookies.get('userToken');
        const url = `${baseUrl}/login`

        const response = await axios.post(url, { cookie })

        if (response.status == 200) {
            const token = response.data.token
            Cookies.set('userToken', token);
            dispatch(setUsers(response.data))

            if (response.data.designation == 'company')
                navigate(`/dashboard/company`)
            else
                navigate(`/dashboard/user`)
        }
        else return
    }

    useEffect(() => {
        checkTokenExist()
    }, [])

    return (
        <>
            <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label>
                        UserName : {` `}
                        <input type='text' onChange={(e) => handleChangeFormDetails({ userName: e.target.value.trim() })} />
                    </label>
                    <br />
                    <label>
                        Password : {` `}
                        <input type='text' onChange={(e) => handleChangeFormDetails({ password: e.target.value.trim() })} />
                    </label>
                    <br />
                    <div >
                        <div className="captcha-container">
                            <h4 id="captcha" className="captcha-text" disabled={true}>
                                {captcha}
                            </h4>
                            <img src={captchaImg} className="captcha-image" />
                        </div>

                        <div >
                            <input type="text" placeholder="Enter Captcha" name="username" onChange={handleChange} autocomplete="off" style={{ width: "40%" }}
                            />
                        </div>

                    </div>
                    <br />
                    <button type='submit'>Login</button>

                </form>
            </div>
        </>
    )
}
export default Login