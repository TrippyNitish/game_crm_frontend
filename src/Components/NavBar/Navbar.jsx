import React, { useEffect, useState,  } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import './Navbar.css'
import Sidebar from '../Sidebar/SideBar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { setLogout } from '../../redux/reducers';


const NavBar = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)

    const [isSideBarShow,setIsSideBarShow]=useState(true)

    const handleBarButtonClick=()=>{
        setIsSideBarShow(!isSideBarShow)
    }

    const handleLogOut = (e) => {
        dispatch(setLogout())
        Cookies.remove('userToken');
        navigate("/")
    }

    useEffect(() => {
        if (!user.userName)
            navigate("/")
    }, [])

    return (
        <div className="navBar">
            <div className='isSideBarButtonShow' onClick={()=>handleBarButtonClick()}>{(isSideBarShow? <span>&equiv;</span>:<span>&times;</span>)}</div>
            {!isSideBarShow && <div className='navSideBarShown'>
                <Sidebar/>
            </div>}
            <div className="navBarComponents">
               {user.designation!="company"  && <div>{`Credits : ${user.credits != null ? user.credits : "Infinit"}`}  </div>}
            </div>
            <div> Game </div>
            <div className="navBarComponents">
                <AccountCircleIcon/>
                <div className="welcome">{` ${user.userName}(${user.designation})`}  </div>
                <button className="navBarButtons deleteButton" onClick={(e) => handleLogOut(e)}>LogOut</button>
            </div>
        </div>

    )
}

export default NavBar