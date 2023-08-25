import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setClientsList, setCredits, setUsers } from '../../redux/reducers';
import Cookies from 'js-cookie';
import './companyDashboard.css'
import { addClientApi, deleteClientApi, getClientListApi, activeStatusApi, getRealTimeCreditsApi, transactionsApi, updateCreditApi, updatePasswordApi } from '../../services/api';
import { getTransactionsOnBasisOfPeriodApi } from '../../services/companyApi';


const CompanyDashboard = () => {

  const navigate = useNavigate()

  useSelector((state) => console.log("stt", state))

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)
  const clientList = useSelector((state) => state.clientList)

  const emptyDetails = {
    userName: "",
    password: "",
    clientNickName: "",
    credits: 0
  }

  const [isUpdateCredit, setIsUpdateCredit] = React.useState(false);
  const [isAddClient, setIsAddClient] = useState(false)

  const [openDelete, setOpenDelete] = useState(false)
  const [openHistory, setOpenHistory] = React.useState(false);
  const [isUpdatePassword, setIsUpdatePassword] = useState(false)
  var [startDate,setStartDate]=useState("")
  var [endDate,setEndDate]=useState(Date.now)  
  const [details, setDetails] = useState(emptyDetails)
  const [history, setHistory] = useState([])
  var [userNameVar, setuserNameVar] = useState("")
  const [addOrRedeemeCredits, setAddOrRedeemeCredits] = useState(1)
  const [initialcredits, setInitialCredits] = useState(0)
  var [filteredClient, setFilteredClient] = useState([])
  const [selectedHirarchy,setSelectedHirarchy]=useState("all")

  const currentDate = new Date().toISOString().split('T')[0];

  const handleAddClient = () => {
    setIsAddClient(true)
    setDetails(emptyDetails)
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

  const getRealTimeCredits = async () => {
    const response = await getRealTimeCreditsApi({ userName: user.userName })
    dispatch(setCredits(response.data.credits))
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
    setIsAddClient(false)
  }

  const updateCredit = async () => {
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
    const response = await updateCreditApi({ ...details, credits: addOrRedeemeCredits * (details.credits) })

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
    setIsUpdateCredit(false)
    setDetails(emptyDetails)
  }

  const updatePassword = async () => {

    if (details.password !== details.confirmNewpassword) {
      alert("Password is not matching")
      return
    }
    const response = await updatePasswordApi({ ...details, clientUserName: details.userName, userName: user.userName })
    setIsUpdatePassword(false)
  }

  const handleDelete = async () => {
    setOpenDelete(false)
    const response = await deleteClientApi({ clientUserName: userNameVar, userName: user.userName, designation: user.designation })
    if (response)
      getClientList();
  }

  const handleDeleteModal = (userNameVar) => {
    setuserNameVar(userNameVar)
    setOpenDelete(true)
  }

  const getClientList = async () => {
    console.log("getClientListFun")
    const response = await getClientListApi({ userName: user.userName })
    dispatch(setClientsList(response.data.clientList))
  }

  const handleTransactions = async (userName) => {
    const response = await transactionsApi({ clientUserName: userName, userName: user.userName })
    setHistory(response.data)
    setOpenHistory(true)
  }

  const handleUpdatePassword = (items) => {
    setIsUpdatePassword(true)
    setDetails(items)
  }

  const addCredits = (items, addOrRedeeme) => {
    setIsUpdateCredit(true)
    setAddOrRedeemeCredits(addOrRedeeme)
    setDetails(items)
    setInitialCredits(items.credits)
    setDetails({ ...items, clientUserName: items.userName, userName: user.userName, initialcredits, credits: 0 })
  }

  const handleActiveInactive = async (items) => {
    console.log("activity", items.activeStatus)
    const response = await activeStatusApi({ clientUserName: items.userName, userName: user.userName, activeStatus: items.activeStatus })
    if (response)
      getClientList()
  }


  const filterClients = (searchText) => {
    setFilteredClient(
      clientList.filter(items => items.userName.includes(searchText))
    )
  }


  const handleCompanyClick = async (row) => {
    const response = await getClientListApi({ userName: row.userName })
    setFilteredClient(response.data.clientList)
  }

  const searchTransactionInPeriod=async ()=>{
    const response = await getTransactionsOnBasisOfPeriodApi({startDate,endDate,hirarchyName:selectedHirarchy,userName:user.userName})
    setHistory(response.data.transactionsFiltered)
    setOpenHistory(true)
  }

  useEffect(() => {
    setFilteredClient(clientList)
  }, [clientList])

  useEffect(() => {
    if (!user.userName)
      navigate("/")
    getClientList()
  }, [])

  return (
    <div className="dashboardBody">
      <div className="navBar">
        <div className="navBarComponents">
          <div>{`Credits : ${user.credits != null ? user.credits : "Infinite"}`}  </div>
        </div>
        <div> Company </div>
        <div className="navBarComponents">
          <button className="navBarButtons" onClick={() => handleAddClient()}>Add Client</button>
          <button className="navBarButtons deleteButton" onClick={(e) => handleLogOut(e)}>LogOut</button>
          <div className="welcome">{`Welcome : ${user.userName}`}  </div>
        </div>
        <input className='search' type='text' onChange={(e) => filterClients(e.target.value)} />
      </div>

      {isAddClient &&
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="closeButton" onClick={() => setIsAddClient(false)}>&times;</div>
            <form className="form" onSubmit={(e) => handleSubmit(e)}>

              <label>
                {`UserName * :`}
                <input type='text' value={details.clientUserName} onChange={(e) => handleChangeFormDetails({ clientUserName: e.target.value.trim() })} />

              </label>
              <br />
              <label>
                {`NickName :`}

                <input type='text' value={details.clientNickName} onChange={(e) => handleChangeFormDetails({ clientNickName: e.target.value.trim() })} />

              </label>
              <br />
              <label>
                {`Password * :`}

                <input type='text' value={details.password} onChange={(e) => handleChangeFormDetails({ password: e.target.value.trim() })} />

              </label>
              <br />
              <label>
                {`Confirm Password * :`}

                <input type='text' value={details.confirmPassword} onChange={(e) => handleChangeFormDetails({ confirmPassword: e.target.value.trim() })} />

              </label>
              <div>Initial Credit : 0</div>
              <br />
              <button type='submit' onClick={() => addClient()}> AddClient</button>
            </form>
          </div>
        </div>}

      {isUpdateCredit &&
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="closeButton" onClick={() => setIsUpdateCredit(false)}>&times;</div>
            <form className="form" onSubmit={(e) => handleSubmit(e)}>
              <div style={{ color: "black" }}>{`UserName : ${details.userName}`}</div>

              <br />
              <div style={{ color: "black" }}>
                NickName : {`${details.nickName} `}
              </div>
              <br />
              <div style={{ color: "black" }}>
                Initial Credits : {`${details.initialcredits} `}
              </div>
              <label>
                {`${(addOrRedeemeCredits > 0) ? "Add Credit : " : "Redeeme Credits : "}`}
                <input type='text' value={details.credits} onChange={(e) => handleChangeFormDetails({ credits: e.target.value.trim() })} />

              </label>
              <br />
              <button type='submit' onClick={() => updateCredit()}> {`${(addOrRedeemeCredits > 0) ? "Add Credit" : "Redeeme Credits"}`} </button>
            </form>
          </div>
        </div>}

      {isUpdatePassword &&
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="closeButton" onClick={() => setIsUpdatePassword(false)}>&times;</div>
            <form className="form" onSubmit={(e) => handleSubmit(e)}>
              <div style={{ color: "black" }}>{`UserName : ${details.userName}`}</div>
              <div style={{ color: "black" }}>
                NickName : {`${details.nickName} `}
              </div>
              <br />
              <label>
                {`Enter New Password`}
                <input type='text' value={details.password} onChange={(e) => handleChangeFormDetails({ password: e.target.value.trim() })} />

              </label>
              <br />
              <label>
                {`Confirm New Password`}
                <input type='text' value={details.confirmNewpassword} onChange={(e) => handleChangeFormDetails({ confirmNewpassword: e.target.value.trim() })} />
              </label>
              <button type='submit' onClick={() => updatePassword()}>Update Password</button>
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
              <td className="tableCellData">Credior</td>
                <td className="tableCellData">Debitor</td>
                <td className="tableCellData">Credits</td>
                <td className="tableCellData">Time</td>
              </tr>
              {history.map((row) => (
                <tr className="tableCell" key={row.name}>
                   <td className="tableCellData">{row.creditor}</td>
                   <td className="tableCellData">{row.debitor}</td>
                  <td className="tableCellData">{row.credit}</td>
                  <td className="tableCellData">{`${row.createdAtDate},${row.createdAtTime}`}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>}


      <div className="userTable">
        <div className='options'>
          <div>
            <label for="start">Start date:</label>
            <input type="date" value={startDate} min="2018-01-01" max={currentDate} onChange={(e)=>setStartDate(e.target.value)}/>
          </div>
          <div>
            <label for="start">End date:</label>
            <input type="date" value={endDate} min="2019-01-01" max={currentDate} onChange={(e)=>setEndDate(e.target.value)}/>
          </div>
          <div>
            <select value={selectedHirarchy} onChange={(e)=>setSelectedHirarchy(e.target.value)}>
              <option value="all">All</option>
              <option value="master">Master</option>
              <option value="distributer">Distributer</option>
              <option value="subDistributer">Sub Distributer</option>
              <option value="store">Store</option>
              <option value="users">Users</option>
            </select>
          </div>
          <button onClick={()=>searchTransactionInPeriod()}>Search</button>
        </div>

        <div>
          <table className="table" >
            <tr className="tableCell">
              <th className="tableCellHeader">User Name</th>
              <th className="tableCellHeader">NickName</th>
              <th className="tableCellHeader">Credits</th>
              <th className="tableCellHeader">Buttons</th>
            </tr>

            {filteredClient.map((row, index) => (
              <tr className="tableCell" key={row.name}>
                <td className="tableCellDataUserName" onClick={() => handleCompanyClick(row)}>{row.userName}</td>
                <td className="tableCellData">{row.nickName ? row.nickName : "N/A"}</td>
                <td className="tableCellData">{row.credits}</td>

                <td className="tableCellDataButtonContainer">
                  <div className="tableCellDataButtons" >
                    <button className="tableCellDataButtonContainerButton deleteButton" onClick={() => handleDeleteModal(row.userName)}>Delete</button>
                    <button className="tableCellDataButtonContainerButton" onClick={() => handleTransactions(row.userName)}>Transactions</button>
                    {row.designation == "master" && <button className="tableCellDataButtonContainerButton" onClick={() => addCredits(row, 1)}>Add Credits</button>}
                    <button className="tableCellDataButtonContainerButton" style={{ backgroundColor: row.activeStatus ? "green" : "red" }} onClick={() => handleActiveInactive(row)}>{`${row.activeStatus ? "Enabled" : "Disabled"}`} </button>
                  </div>
                  <div className="tableCellDataButtons" >
                    {row.designation == "master" && < button className="tableCellDataButtonContainerButton bigButtons" onClick={() => addCredits(row, -1)}>Redeem Credits</button>}
                    <button className="tableCellDataButtonContainerButton bigButtons" onClick={() => handleUpdatePassword(row)}>Update Password</button>
                  </div>
                </td>
              </tr>
            ))}
          </table>

        </div>

      </div>
    </div>
  )
}

export default CompanyDashboard