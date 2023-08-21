import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setClientsList, setCredits, setUsers } from '../../redux/reducers';
import Cookies from 'js-cookie';
import './dashboard.css'
import { addClientApi, deleteClientApi, getClientListApi, getRealTimeCreditsApi, transactionsApi, updateClientApi } from '../../services/api';


const Dashboard = () => {

  const navigate = useNavigate()

  useSelector((state) => console.log("stt", state))

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)
  const clientList = useSelector((state) => state.clientList)

  const nextRouteParams = {
    company: "Master",
    master: "Distributer",
    distributer: "SubDistributer",
    subDistributer: "Store",
    store: "User",
    user: "user"
  }
  const nextRouteParamsList = {
    company: "masterList",
    master: "distributerList",
    distributer: "subDistributerList",
    subDistributer: "storeList",
    store: "userList",
    user: "User"
  }

  const emptyDetails = {
    userName: "",
    password: "",
    credits: 0
  }

  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = useState(false)
  const [openHistory, setOpenHistory] = React.useState(false);
  const [isAddCreditorOpdatePassword, setIsAddCreditorUpdatePassword] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [details, setDetails] = useState(emptyDetails)
  const [history, setHistory] = useState([])
  var [userNameVar, setuserNameVar] = useState("")
  const [addOrRedeemeCredits, setAddOrRedeemeCredits] = useState(1)
  const [initialcredits, setInitialCredits] = useState(0)

  const handleAddMaster = () => {
    setIsAddCreditorUpdatePassword(false)
    setIsEdit(false)
    setDetails(emptyDetails)
    setOpenUpdate(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  const handleChangeFormDetails = (formdata) => {
    setDetails({ ...details, ...formdata })
  }

  const handleLogOut = (e) => {
    Cookies.remove('userToken');
    navigate("/")
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

  const getRealTimeCredits = async ()=>{
    const response = await getRealTimeCreditsApi({userName:user.userName})

    dispatch(setCredits(response.data.credits))
  }

  setInterval(getRealTimeCredits,5000)

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
    const response = await addClientApi({ ...details, userName: user.userName })
    if (response)
      getClientList();
    setDetails(emptyDetails)
    setOpenUpdate(false);
  }

  const updateClient = async () => {    
    if (addOrRedeemeCredits > 0) {
      var finalCredit = user.credits - details.credits;
      if ((user.designation != 'company')) {
        if (finalCredit < 0) {
          alert("you have not enough balance to credit")
          return
        }
      }
    } else {

      if ((initialcredits - details.credits) < 0) {
        alert("Your client have not enough balance to redeeme")
        return
      }
    }

    const response = await updateClientApi({ ...details, credits: addOrRedeemeCredits * (details.credits)})

    if (addOrRedeemeCredits > 0) {
      if (response) {
        dispatch(setCredits(finalCredit))
        getClientList();
      }
    } else {
      if (response) {
        getClientList();
      }
    }

    setOpenUpdate(false)
    setDetails(emptyDetails)
  }

  const handleDelete = async () => {
    setOpenDelete(false)
    const response = await deleteClientApi({ clientUserName: userNameVar, userName: user.userName,designation:user.designation })
    if (response)
      getClientList();
  }

  const handleDeleteModal = (userNameVar) => {
    setuserNameVar(userNameVar)
    setOpenDelete(true)
  }

  const getClientList = async () => {
    const response = await getClientListApi({userName:user.userName})
    dispatch(setClientsList(response.data.clientList))

  }

  const handleTransactions = async (userName) => {
    const response = await transactionsApi({ userName: userName, parentId: user.userName })
    setHistory(response.data)
    setOpenHistory(true)
    return <History props={history} />
  }

  const handleUpdatePassword = (items) => {
    setIsAddCreditorUpdatePassword(false);
    setIsEdit(true)
    setDetails({ ...items, credits: 0 })
    setOpenUpdate(true)
  }

  const addCredits = (items, addOrRedeeme) => {
    setAddOrRedeemeCredits(addOrRedeeme)
    setIsAddCreditorUpdatePassword(true)
    setIsEdit(true)
    setDetails(items)
    setInitialCredits(items.credits)
    setDetails({ ...items,clientUserName:items.userName,userName:user.userName, initialcredits, credits: 0 })
    setOpenUpdate(true)
  }

  useEffect(() => {
    if (!user.userName)
      navigate("/")
    getClientList()
  }, [])

  return (
    <div className="dashboardBody">
      <div className="navBar">
        <div className="navBarComponents">          
           <div>{`Credits : ${user.credits!=null?user.credits:"Infinite"}`}  </div>
        </div>
        <div> Game </div>
        <div className="navBarComponents">
          <button className="navBarButtons" onClick={() => handleAddMaster()}>Add Client</button>
          <button className="navBarButtons deleteButton" onClick={(e) => handleLogOut(e)}>LogOut</button>
          <div className="welcome">{`Welcome : ${user.userName}`}  </div>
        </div>
      </div>

      {openUpdate &&
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="closeButton" onClick={() => setOpenUpdate(false)}>&times;</div>
            <form className="form" onSubmit={(e) => handleSubmit(e)}>
              {
                isEdit ?
                  <div style={{ color: "black" }}>{`UserName : ${details.userName}`}</div> :
                  <label style={{ color: "black" }}>
                    UserName : {` `}
                    <input type='text' value={details.clientUserName} onChange={(e) => handleChangeFormDetails({ clientUserName: e.target.value.trim() })} />
                  </label>
              }
              <br />
              {!isAddCreditorOpdatePassword && <label style={{ color: "black" }}>
                Password : {` `}
                <input type='text' value={details.password} onChange={(e) => handleChangeFormDetails({ password: e.target.value.trim() })} />
              </label>}
              <br />
              {isEdit ? isAddCreditorOpdatePassword && <label style={{ color: "black" }}>
                InitiAL Credits: {initialcredits}<br />
                {`${addOrRedeemeCredits > 0 ? "Add Credit" : "Redeeme Credits"} `}
                <input type='text' value={details.credits} onChange={(e) => handleChangeFormDetails({ credits: e.target.value.trim() })} />
              </label> : <div>Initial Credits : 0 </div>}
              <br />
              {!isEdit ? <button type='submit' onClick={() => addClient()}>Add Client</button> :
                <button type='submit' onClick={() => updateClient()}>{`${isAddCreditorOpdatePassword ? (addOrRedeemeCredits > 0 ? "Add Credit" : "Redeeme Credits") : "Update Password"}`}</button>}
            </form>
          </div>
        </div>}

      {openDelete &&
        <div className="modal-overlay">
          <div className="modal-content">
            <div>
              <h5 style={{ color: "black" }}> Are you sure want to delete</h5>
              <button onClick={() => handleDelete()}>Yes</button>
              <button onClick={() => setOpenDelete(false)}>No</button>
            </div>
          </div>
        </div>}

      {openHistory &&
        <div className="modal-overlay">
          <div className="modal-content-history">
            <div className="closeButton" onClick={() => setOpenHistory(false)}>&times;</div>
            <table className="historyTable">
              <tr className="tableCell">
                <td className="tableCellData">Credits</td>
                <td className="tableCellData">Time</td>
              </tr>
              {history.map((row) => (
                <tr className="tableCell" key={row.name}>
                  <td className="tableCellData">{row.credit}</td>
                  <td className="tableCellData">{row.createdAt}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>}

      <div className="userTable">
        <table className="table" >
          <tr className="tableCell">
            <th className="tableCellHeader">User Name</th>
            <th className="tableCellHeader">Credits</th>
            <th className="tableCellHeader">Buttons</th>
          </tr>

          {clientList.map((row) => (
            <tr className="tableCell" key={row.name}>
              <td className="tableCellData">{row.userName}</td>
              <td className="tableCellData">{row.credits}</td>
              <td className="tableCellDataButtonContainer">
                <div className="tableCellDataButtons" >
                  <button className="tableCellDataButtonContainerButton deleteButton" onClick={() => handleDeleteModal(row.userName)}>Delete</button>
                  <button className="tableCellDataButtonContainerButton" onClick={() => handleTransactions(row.userName)}>Transactions</button>
                  <button className="tableCellDataButtonContainerButton" onClick={() => addCredits(row, 1)}>Add Credits</button>
                </div>
                <div className="tableCellDataButtons" >
                  <button className="tableCellDataButtonContainerButton bigButtons" onClick={() => addCredits(row, -1)}>Redeem Credits</button>
                  <button className="tableCellDataButtonContainerButton bigButtons" onClick={() => handleUpdatePassword(row)}>Update Password</button>
                </div>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  )
}

export default Dashboard