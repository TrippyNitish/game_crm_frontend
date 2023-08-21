import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {

   const navigate = useNavigate()
    const [sendOtpFormVisibility, setSendOtpFormVisibility] = useState(true)
    const [verifyFormVisibility, setVerifyFormVisibility] = useState(false)
    const [resetPasswordFromVisibility, setResetPasswordFromVisibility] = useState(false)
    const [userName,setUserName] = useState("")
    const [email,setEmail]=useState("")
    const [otp,setOtp] = useState("")
    const [newPassword, setNewPassword]= useState("")
    const [confirmNewPasssword,setConfirmNewPassword]=useState("")

    const handleSendOtp = async (e) => {
        e.preventDefault()
        const response = await axios.post("http://localhost:5000/company/sendOtp", {userName,email})
        console.log(response.status)
        if (response.status == 200) {
            setSendOtpFormVisibility(false)
            setVerifyFormVisibility(true)
            setResetPasswordFromVisibility(false)
        } else if(response.status==201){
            alert(response.data.error)
        }
        
    }

    const handleVerifyOtp = async () => {
        const response = await axios.post("http://localhost:5000/company/veryfyOtp", {email,otp})

        if (response.status == 200) {
            alert(response.data.message)
            setSendOtpFormVisibility(false)
            setVerifyFormVisibility(false)
            setResetPasswordFromVisibility(true)
            
        } else if(response.status==201){
            alert(response.data.error)
        } 
    }

    const handleResetPassword = async () => {
        const response = await axios.post("http://localhost:5000/company/resetPassword", {userName,newPassword,email})
        
        if (response.status == 200) {
            alert("Password Successfully updated")
             navigate("/")           
        }
       
        console.log(response.status)
      
    }

    const handleChangeFormDetails = () => {

    }
    const resetFormDetails = ()=>{
        setSendOtpFormVisibility(true)
        setVerifyFormVisibility(false)
        setResetPasswordFromVisibility(false)
    }
    return (
        <div>
            <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

                {sendOtpFormVisibility && <div display={{ display: "none" }}>
                    <form onSubmit={(e) => handleSendOtp(e)}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label>
                                UserName : {` `}
                                <input type='text' onChange={(e) => setUserName( e.target.value.trim())} />
                            </label>
                            <label>
                                Email : {` `}
                                <input type='text' onChange={(e) => setEmail( e.target.value.trim() )} />
                            </label>
                            <br />
                            <button>Send Otp</button>
                        </div>
                    </form>
                </div>}
                <br />

                {verifyFormVisibility && <div>
                    <label>
                        Enter Otp : {` `}
                        <input type='text' onChange={(e)=>setOtp(e.target.value)}/>
                    </label>
                    <button onClick={() => handleVerifyOtp()}> Verify</button>
                </div>}

                <br />
                {resetPasswordFromVisibility && <div>
                    <div>
                        <label>
                            Enter New Password :{` `}
                            <input type="text" onChange={(e)=>setNewPassword(e.target.value)}/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Confirm New Paswword :{` `}
                            <input type="text" onChange={(e)=>setConfirmNewPassword(e.target.value)} />

                        </label>
                    </div>
                    <br />
                    <div>
                        <button onClick={() => handleResetPassword()}>Reset Password</button>
                    </div>
                </div>}
                <div>
                <button onClick={()=>resetFormDetails()}>Reset Form Details</button>
            </div>
            </div>
            
        </div>
    )
}

export default ResetPassword