import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setClientsList, setCredits } from '../../redux/reducers';
import './dashboard.css'
import { deleteClientApi, getClientListApi, activeStatusApi, transactionsApi, updateCreditApi, updatePasswordApi } from '../../services/api';
import Sidebar from '../../Components/Sidebar/SideBar';
import NavBar from '../../Components/NavBar/Navbar';
import UpdateUser from '../../Components/Update User/UpdateUser';


const Dashboard = () => {

  const navigate = useNavigate()

  useSelector((state) => console.log("stt", state))

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)
  const clientList = useSelector((state) => state.clientList)

  const emptyDetails = {
    userName: "",
    password: "",
    clientNickName: "",
    credits: 0,
    lastLogin: "",
    timeZone: "abc",
    activeStatus: "abc",
    designation: "abc",
  }

  const [isUpdateCredit, setIsUpdateCredit] = React.useState(false);
  const [openDelete, setOpenDelete] = useState(false)
  const [openHistory, setOpenHistory] = React.useState(false);
  const [isUpdatePassword, setIsUpdatePassword] = useState(false)
  const [details, setDetails] = useState(emptyDetails)
  const [history, setHistory] = useState([])
  var [userNameVar, setuserNameVar] = useState("")
  const [addOrRedeemeCredits, setAddOrRedeemeCredits] = useState(1)
  const [initialcredits, setInitialCredits] = useState(0)
  var [filteredClient, setFilteredClient] = useState([])
  var [selelctedAccount, setSelectedAccount] = useState(emptyDetails)

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  const handleChangeFormDetails = (formdata) => {
    setDetails({ ...details, ...formdata })
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
    if (!selelctedAccount.userName) {
      alert("Please select an Account")
      return
    }
    setOpenDelete(false)
    const response = await deleteClientApi({ clientUserName: userNameVar, userName: user.userName, designation: user.designation })
    if (response)
      getClientList();
  }

  const handleDeleteModal = (userNameVar) => {
    if (!selelctedAccount.userName) {
      alert("Please select an Account")
      return
    }
    setuserNameVar(userNameVar)
    setOpenDelete(true)
  }

  const getClientList = async () => {
    const response = await getClientListApi({ userName: user.userName })
    dispatch(setClientsList(response.data.clientList))
  }

  const handleTransactions = async (userName) => {
    if (!selelctedAccount.userName) {
      alert("Please select an Account")
      return
    }
    const response = await transactionsApi({ clientUserName: userName, userName: user.userName })
    setHistory(response.data)
    setOpenHistory(true)
  }

  const handleUpdatePassword = (items) => {
    if (!selelctedAccount.userName) {
      alert("Please select an Account")
      return
    }
    setIsUpdatePassword(true)
    setDetails(items)
  }

  const addCredits = (items, addOrRedeeme) => {
    if (!selelctedAccount.userName) {
      alert("Please select an Account")
      return
    }
    setIsUpdateCredit(true)
    setAddOrRedeemeCredits(addOrRedeeme)
    setDetails(items)
    setInitialCredits(items.credits)
    setDetails({ ...items, clientUserName: items.userName, userName: user.userName, initialcredits, credits: 0 })
  }

  const handleActiveInactive = async (items) => {
    if (!selelctedAccount.userName) {
      alert("Please select an Account")
      return
    }
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
    if (user.designation == "company") {
      const response = await getClientListApi({ userName: row.userName })
      setFilteredClient(response.data.clientList)
    }
  }

  useEffect(() => {
    setFilteredClient(clientList)
    const selectedUser = clientList.find(items => items.userName == selelctedAccount.userName)
    if (!selectedUser) {
      setSelectedAccount(emptyDetails)
      return
    }
    setSelectedAccount({ ...selelctedAccount, ...selectedUser })
  }, [clientList])

  useEffect(() => {
    if (!user.userName)
      navigate("/")
    getClientList()
  }, [])

  return (
    <div className="companyDashboardBody">
      <NavBar />
      <div className='dashBoardbody'>
        <div className='isSideBarShow'>
          <Sidebar />
        </div>

        <div className="companyUserView">
          {/* //////////////////////////////////////////////////////////////////////////// */}
          <div className='adminStructure'>
            <div className='firstCompnayUserViewColumn'>
              <input type='text' style={{width:"250px",height:"30px"}} placeholder='Search Account' onChange={(e) => filterClients(e.target.value)} />
            </div>
            <div className='selectedAccount'>
              <div className='acccountName'>
                <div className='acccountNameUpper'>
                  Account
                </div>
                <div>
                  {selelctedAccount.userName ? selelctedAccount.userName : "N/A"}
                </div>

              </div>
              <div className='balance'>
                <div className='acccountNameUpper'>
                  Credits
                </div>
                <div>
                  {selelctedAccount.credits}
                </div>
              </div>
              <div className='lastLogin'>
                <div className='acccountNameUpper'>
                  Last Login
                </div>
                <div>
                  {selelctedAccount.lastLogin}
                </div>
              </div>
              <div className='timeZone'>
                <div className='acccountNameUpper'>
                  Time Zone
                </div>
                <div>
                  {selelctedAccount.timeZone}
                </div>
              </div>
              <div className='activeStatus'>
                <div className='acccountNameUpper'>
                  Active Status
                </div>
                <div>
                  <button className="companyTableCellDataButtonContainerButton upper" style={{ backgroundColor: selelctedAccount.activeStatus ? "green" : "red" }} onClick={() => handleActiveInactive(selelctedAccount)}>{`${selelctedAccount.activeStatus ? "Enabled" : "Disabled"}`} </button>
                </div>
              </div>
            </div>
            <div className='modifyAccountInfoButtons'>
              <button className="companyTableCellDataButtonContainerButton deleteButton upper" onClick={() => handleDeleteModal(selelctedAccount.userName)}>Delete</button>
              {!(user.designation == 'company' && selelctedAccount.designation != "master") && < button className="companyTableCellDataButtonContainerButton lower" onClick={() => addCredits(selelctedAccount, 1)}>Recharge</button>}
              {!(user.designation == 'company' && selelctedAccount.designation != "master") && < button className="companyTableCellDataButtonContainerButton lower" onClick={() => addCredits(selelctedAccount, -1)}>Redeem</button>}
              <button className="companyTableCellDataButtonContainerButton lower " onClick={() => handleUpdatePassword(selelctedAccount)}>Update Password</button>
              <button className="companyTableCellDataButtonContainerButton upper" onClick={() => handleTransactions(selelctedAccount.userName)}>Transactions</button>
            </div>
          </div>
          {/* //////////////////////////////////////////////////////////////////////////// */}
          <div className='thirdCompnayUserViewColumn'>
            <table className="companyTable" >
              <tr className="companyTableCell">
                <th className="companyTableCellHeader">Management</th>
                <th className="companyTableCellHeader">User Name</th>
                <th className="companyTableCellHeader">NickName</th>
                <th className="companyTableCellHeader">Credits</th>
                <th className="companyTableCellHeader">TimeZone</th>
                <th className="companyTableCellHeader">Status</th>
                <th className="companyTableCellHeader">Total Recharged</th>
                <th className="companyTableCellHeader">Total Redeemed</th>
                <th className="companyTableCellHeader">Holding Percentage</th>
                <th className="companyTableCellHeader">Last Login</th>

              </tr>

              {filteredClient.map((row, index) => (
                <tr className="companyTableCell" key={row.name}>
                  <td className="companyTableCellDataButtonContainer">
                    <button className="companyTableCellDataButtonContainerButton lower " onClick={() => setSelectedAccount({ ...selelctedAccount, ...row })}>Update</button>
                  </td>
                  <td className="companyTableCellDataUserName" onClick={() => handleCompanyClick(row)}>{row.userName}</td>
                  <td className="companyTableCellData">{row.nickName ? row.nickName : "N/A"}</td>
                  <td className="companyTableCellData">{row.credits}</td>
                  <td className="companyTableCellData">{row.timeZone ? row.timeZone : "EST"}</td>
                  <td className="companyTableCellData">{row.activeStatus ? "Active" : "In Active"}</td>
                  <td className="companyTableCellData">{row.totalRecharged}</td>
                  <td className="companyTableCellData">{(-1) * row.totalRedeemed}</td>
                  <td className="companyTableCellData">{row.totalRedeemed > (-1) * row.totalRecharged ? "" : "-"}{(((row.totalRecharged + row.totalRedeemed) / row.totalRecharged) * 100).toFixed(2)}%</td>
                  <td className="companyTableCellData">{row.lastLogin?row.lastLogin:"N/A"}</td>


                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>


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
            <div className='dashboardHistoryTableWindow'>
              <div className="closeButton" onClick={() => setOpenHistory(false)}>&times;</div>
              <div>
                <table className="dashboardHistoryTable">
                  <tr className="dashboardHistoryTableCellHeader">
                    <td className="dashboardHistoryTableCellDataHeader">Credior</td>
                    <td className="dashboardHistoryTableCellDataHeader">Debitor</td>
                    <td className="dashboardHistoryTableCellDataHeader">Credits</td>
                    <td className="dashboardHistoryTableCellDataHeader">Time</td>
                  </tr>
                  {history.map((row) => (
                    <tr className="dashboardHistoryTableCell" key={row.name}>
                      <td className="dashboardHistoryTableCellData">{row.creditor}</td>
                      <td className="dashboardHistoryTableCellData">{row.debitor}</td>
                      <td className="dashboardHistoryTableCellData">{row.credit}</td>
                      <td className="dashboardHistoryTableCellData">{`${row.createdAtDate},${row.createdAtTime}`}</td>
                    </tr>
                  )).reverse()}
                </table>
              </div>
            </div>
          </div>
        </div>}
    </div>
  )
}

export default Dashboard