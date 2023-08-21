import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {  useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setUsers } from '../redux/reducers';
import Cookies from 'js-cookie';
import { baseUrl } from '../services/api';

const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [details,setDetails]= useState({})

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = `${baseUrl}/login`
        const response = await axios.post(url, details)        

        if (response.status == 201) {
            alert(`You are not registered, Please contact your owner`)
        }

        else if (response.status == 200){            
            const token = response.data.token            
            Cookies.set('userToken', token, { expires: 7 });
            
            dispatch(setUsers(response.data))
            navigate(`/dashboard/user`)
        }

    }
    const handleChangeFormDetails = (formdata) => {
        setDetails({ ...details, ...formdata })
    }

    useEffect(()=>{
        dispatch(setUsers({}))
        Cookies.remove('userToken');
    },[])

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
                    <br/>              
                    <button type='submit'>Login</button>
                   
                </form>
            </div>
        </>
    )
}
export default Login