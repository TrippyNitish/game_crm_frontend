import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { baseUrl } from '../../services/api';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import './Login.css'
import PersonIcon from '@mui/icons-material/Person';
import { setUsers } from '../../redux/reducers';
import KeyIcon from '@mui/icons-material/Key';

const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [details, setDetails] = useState({})
    var [captcha, setCaptcha] = useState("")
     
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (validateCaptcha(captcha) == true) {
        }
        else {
            alert('Captcha Does not Match');
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
            navigate(`/dashboard/user`)
        }
        else return
    }


    useEffect(() => {
        checkTokenExist()
        loadCaptchaEnginge(6,'#85adad','white','numbers');
    }, [])

    return (
        <>
            <div className='loginPage'>
                <form className='loginForm' onSubmit={(e) => handleSubmit(e)}>
                    <PersonIcon style={{ fontSize: "150px", color: "white" }} />

                    <div className='userLoginFields'>
                        <PersonIcon />
                        <input required autoComplete='off' className="loginInput" type='text' placeholder='User Name' onChange={(e) => handleChangeFormDetails({ userName: e.target.value.trim() })} />
                    </div>
                    <div className='userLoginFields'>
                        <KeyIcon />
                        <input required  autoComplete='off' type='password' className="loginInput" placeholder='Password' onChange={(e) => handleChangeFormDetails({ password: e.target.value.trim() })} />
                    </div>
                    <div className='captcha' >
                        <input required  autoComplete='off'  className='captchaInput' type="text" placeholder="Enter Captcha" name="username" onChange={(e) => setCaptcha(e.target.value)} autocomplete="off" style={{ width: "40%" }} />
                        <LoadCanvasTemplate />
                    </div>
                    <br />
                    <button className='loginButton' type='submit'>Login</button>
                </form>
            </div>
        </>
    )
}
export default Login