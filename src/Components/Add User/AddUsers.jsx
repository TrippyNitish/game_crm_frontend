import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import './AddUser.css'
import Sidebar from '../../Components/Sidebar/SideBar';
import NavBar from '../NavBar/Navbar';
import { addClientApi } from '../../services/api';

const AddClient = () => {

    const navigate = useNavigate()

    const user = useSelector((state) => state.user)

    const emptyDetails = {
        userName: "",
        password: "",
        clientNickName: "",
        credits: 0
    }
    const [details, setDetails] = useState(emptyDetails)

    const handleSubmit = async (e) => {
        e.preventDefault()
    }

    const handleChangeFormDetails = (formdata) => {
        setDetails({ ...details, ...formdata })
    }

    function containsAtLeastTwoIntegers(password) {
        let integerCount = 0;

        for (let i = 0; i < password.length; i++) {
            if (!isNaN(parseInt(password[i]))) {
                integerCount++;
                if (integerCount >= 2) {
                    return true;
                }
            }
        }
        return false;
    }

    const addClient = async () => {
        if (details.clientUserName.length < 4) {
            alert("Username should be atleast four characters")
            return
        }
        if (details.password.length < 6) {
            alert("Password can't be less than 6 characters")
            return
        }
        if (!containsAtLeastTwoIntegers(details.password)) {
            alert("Password contains at least two numbers")
            return
        }
        if (details.password !== details.confirmPassword) {
            alert("Password is not matching")
            return
        }
        const response = await addClientApi({ ...details, userName: user.userName })
        if (response)
            getClientList();
        setDetails(emptyDetails)
    }


    const clientDesignation = {
        company: "Master",
        master: "Distributer",
        distributer: "SubDistributer",
        subDistributer: "Store",
        store: "User"
    }


    useEffect(() => {
        if (!user.userName)
            navigate("/")
    }, [])

    return (
        <div className="addUserView">
            <NavBar />
            <div style={{ display: "flex", height: "100%" }}>
                <div className='isSideBarShow' style={{ height: "100%", backgroundColor: 'gray', width: "250px" }}>
                    <Sidebar />
                </div>
                <div className='addUserForm'>
                    <form className="form" onSubmit={(e) => handleSubmit(e)}>
                        <div>
                            <div>
                                {`UserName * : `}

                            </div>
                            <input className='addClientFiled' type='text' value={details.clientUserName} onChange={(e) => handleChangeFormDetails({ clientUserName: e.target.value.trim() })} />
                        </div>
                        <div>
                            <div>
                                {`NickName : `}

                            </div>
                            <input className='addClientFiled' type='text' value={details.clientNickName} onChange={(e) => handleChangeFormDetails({ clientNickName: e.target.value.trim() })} />
                        </div>
                        <div>
                            <div>
                                {`Password * : `}

                            </div>
                            <input className='addClientFiled' type='text' value={details.password} onChange={(e) => handleChangeFormDetails({ password: e.target.value.trim() })} />
                        </div>
                        <div>
                            <div>
                                {`Confirm Password * : `}

                            </div>
                            <input className='addClientFiled' type='text' value={details.confirmPassword} onChange={(e) => handleChangeFormDetails({ confirmPassword: e.target.value.trim() })} />
                        </div>
                        <div>Initial Credit : 0</div>
                        <button type='submit' onClick={() => addClient()}>Add {clientDesignation[user.designation]}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default AddClient