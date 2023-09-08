import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setClientsList, setCredits } from "../../redux/reducers";
import "./dashboard.css";
import {
  deleteClientApi,
  getClientListApi,
  activeStatusApi,
  transactionsApi,
  updateCreditApi,
  updatePasswordApi,
  getRealTimeCreditsApi,
  addClientApi,
} from "../../services/api";
import Sidebar from "../../Components/Sidebar/SideBar";
import NavBar from "../../Components/NavBar/Navbar";
import Pagination from "@mui/material/Pagination";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const clientList = useSelector((state) => state.clientList);

  const emptyDetails = {
    userName: "",
    password: "",
    clientNickName: "",
    credits: 0,
    lastLogin: "",
    timeZone: "EST",
    activeStatus: "",
    designation: "",
  };

  const [isUpdateCredit, setIsUpdateCredit] = React.useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openHistory, setOpenHistory] = React.useState(false);
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const [isAddClientModalOpen, setIsClientPopModalOpen] = useState(false);
  const [details, setDetails] = useState(emptyDetails);
  const [history, setHistory] = useState([]);
  var [userNameVar, setuserNameVar] = useState("");
  const [addOrRedeemeCredits, setAddOrRedeemeCredits] = useState(1);
  const [initialcredits, setInitialCredits] = useState(0);
  var [filteredClient, setFilteredClient] = useState([]);
  var [selelctedAccount, setSelectedAccount] = useState(emptyDetails);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [userNameForClientList, setUserNameForClientList] = useState("");
  const [userNameStack, setUserNameStack] = useState([]);
  const [isAll, setIsAll] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [isPlayer, setIsPlayer] = useState(false);
  const [isAllClients, setIsAllClients] = useState(true);
  const [isStorePlayers, setIsStorePlayers] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const updateCredits = async () => {
    const res = await getRealTimeCreditsApi({ userName: user.userName });
    dispatch(setCredits(res.data.credits));
    return;
  };

  const handleChangeFormDetails = (formdata) => {
    setDetails({ ...details, ...formdata });
  };

  const updateCredit = async () => {
    if (addOrRedeemeCredits > 0) {
      var finalCredit = user.credits - details.credits;
      if (user.designation != "company") {
        if (finalCredit < 0) {
          alert("you have not enough balance to credit");
          return;
        }
      }
    } else {
      if (initialcredits - details.credits < 0) {
        alert("Your client have not enough balance to redeeme");
        return;
      }
    }

    const response = await updateCreditApi({
      ...details,
      credits: addOrRedeemeCredits * details.credits,
    });

    if (addOrRedeemeCredits > 0) {
      if (response) {
        dispatch(setCredits(finalCredit));
        getClientList();
      }
    } else {
      if (response) {
        getClientList();
      }
    }
    setIsUpdateCredit(false);
    setDetails(emptyDetails);
    updateCredits();
    return;
  };

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

  const handleAddClientModal = () => {
    setIsClientPopModalOpen(true);
  };

  const addClient = async () => {
    if (details.clientUserName.length < 4) {
      alert("Username should be atleast four characters");
      return;
    }
    if (details.password.length < 6) {
      alert("Password can't be less than 6 characters");
      return;
    }
    if (!containsAtLeastTwoIntegers(details.password)) {
      alert("Password contains at least two numbers");
      return;
    }
    if (details.password !== details.confirmPassword) {
      alert("Password is not matching");
      return;
    }

    var response = {};
    if (user.designation == "subDistributer") {
      response = await addClientApi({
        ...details,
        userName: user.userName,
        isPlayer,
      });
    } else {
      response = await addClientApi({
        ...details,
        userName: user.userName,
      });
    }

    if (response) getClientList();
    setIsClientPopModalOpen(false);
    setDetails(emptyDetails);
    return;
  };

  const updatePassword = async () => {
    if (details.password !== details.confirmNewpassword) {
      alert("Password is not matching");
      return;
    }
    const response = await updatePasswordApi({
      ...details,
      clientUserName: details.userName,
      userName: user.userName,
    });
    setIsUpdatePassword(false);
  };

  const handleDelete = async () => {
    if (!selelctedAccount.userName) {
      alert("Please select an Account");
      return;
    }
    setOpenDelete(false);
    const response = await deleteClientApi({
      clientUserName: userNameVar,
      userName: user.userName,
      designation: user.designation,
    });
    if (response) getClientList();
  };

  const handleDeleteModal = (userNameVar) => {
    if (!selelctedAccount.userName) {
      alert("Please select an Account");
      return;
    }
    setuserNameVar(userNameVar);
    setOpenDelete(true);
  };

  const getClientList = async () => {
    console.log("rytr")
    if (!userNameForClientList) return;

    var response;
    if(user.designation == 'subDistributer'){
      response = await getClientListApi({
        userName: userNameForClientList,
        pageNumber: page,
        isAll,
        isActive,
        isAllClients,
        isStorePlayers
      });
    }else{
      response = await getClientListApi({
        userName: userNameForClientList,
        pageNumber: page,
        isAll,
        isActive,
      });
    }
  
    console.log("totalPageCompanyclick", response.data);

    dispatch(setClientsList(response.data.userClientList));
    setTotalPage(response.data.totalPageCount);
    return;
  };

  const handlePageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const handleTransactions = async (userName) => {
    if (!selelctedAccount.userName) {
      alert("Please select an Account");
      return;
    }
    const response = await transactionsApi({
      clientUserName: userName,
      userName: user.userName,
    });
    setHistory(response.data);
    setOpenHistory(true);
  };

  const handleUpdatePassword = (items) => {
    if (!selelctedAccount.userName) {
      alert("Please select an Account");
      return;
    }
    setIsUpdatePassword(true);
    setDetails(items);
  };

  const addCredits = async (items, addOrRedeeme) => {
    await getClientList();
    await updateCredits();
    if (!selelctedAccount.userName) {
      alert("Please select an Account");
      return;
    }
    setIsUpdateCredit(true);
    setAddOrRedeemeCredits(addOrRedeeme);
    setDetails(items);
    setInitialCredits(items.credits);
    setDetails({
      ...items,
      clientUserName: items.userName,
      userName: items.userName,
      initialcredits,
      credits: 0,
    });
  };

  const handleActiveInactive = async (items) => {
    const response = await activeStatusApi({
      clientUserName: items.userName,
      userName: user.userName,
      activeStatus: items.activeStatus,
    });
    if (response) getClientList();
  };

  const filterClients = (searchText) => {
    setFilteredClient(
      clientList.filter((items) => items.userName.includes(searchText))
    );
  };

  const handleBackButton = () => {
    if (user.designation != "company") {
      return;
    }
    if (userNameStack.length === 1) {
      return;
    }
    const newStack = [...userNameStack];
    const userNameForBackButton = newStack.pop();
    setUserNameStack(newStack);
    setUserNameForClientList(userNameForBackButton);
  };

  const handleCompanyClick = async (row) => {
    if (user.designation == "company") {
      setUserNameStack([...userNameStack, userNameForClientList]);
      setUserNameForClientList(row.userName);
    }
  };

  const handleReport = () => {
    setIsReportOpen(true);
  };

  const handleActiveInactiveFilter = (activitIsAll, activityIsActive) => {
    setIsAll(activitIsAll);
    setIsActive(activityIsActive);
  };

  const handleStoresPlayers=(isAllClients,isStorePlayers)=>{
        setIsAllClients(isAllClients)
        setIsStorePlayers(isStorePlayers)
  }

  useEffect(()=>{
    getClientList();
  },[isAllClients,isStorePlayers])

  useEffect(() => {
    getClientList();
  }, [isAll, isActive]);

  useEffect(() => {
    setFilteredClient(clientList);
    const selectedUser = clientList.find(
      (items) => items.userName == selelctedAccount.userName
    );
    if (!selectedUser) {
      setSelectedAccount(emptyDetails);
      return;
    }
    setSelectedAccount({ ...selelctedAccount, ...selectedUser });
  }, [clientList]);

  useEffect(() => {
    getClientList();
  }, [userNameForClientList, page]);

  useEffect(() => {
    if (!user.userName) navigate("/");
    userNameStack.push(user.userName);
    setUserNameForClientList(user.userName);
    getClientList();
  }, []);

  return (
    <div className="companyDashboardBody">
      <NavBar />
      <div className="dashBoardbody">
        <div className="isSideBarShow">
          <Sidebar />
        </div>

        <div className="companyUserView">
          {/* //////////////////////////////////////////////////////////////////////////// */}
          <div className="adminStructure">
            <div className="firstCompnayUserViewColumn">
              <input className="filterClientSearch" type="text" placeholder="Search Account" onChange={(e) => filterClients(e.target.value)} />
              <div>
                <div style={{ color: "brown" }}>Filter Clients</div>
                <div className="filterActiveStatus">
                  <label
                    style={{ display: "flex", gap: "4px",alignItems: "center",   }}     >
                    <input  type="radio"  onClick={() => handleActiveInactiveFilter(true, true)}  name="activity" />  All </label>
                  <label   style={{ display: "flex", gap: "4px", alignItems: "center", }}   >
                    <input  type="radio"  onClick={() => handleActiveInactiveFilter(false, false)} name="activity" /> InActive </label>
                  <label style={{display: "flex", gap: "4px",alignItems: "center", }} >
                    <input type="radio" onClick={() => handleActiveInactiveFilter(false, true)} name="activity" /> Active  </label>
                </div>
                {user.designation == 'subDistributer' && <div className="filterActiveStatus">
                  <label
                    style={{ display: "flex", gap: "4px",alignItems: "center",   }}     >
                    <input  type="radio"  onClick={() => handleStoresPlayers(true, true)}  name="isStoreOrPlayer" />  AllClients </label>
                  <label   style={{ display: "flex", gap: "4px", alignItems: "center", }}   >
                    <input  type="radio"  onClick={() => handleStoresPlayers(false, true)} name="isStoreOrPlayer" /> Stores </label>
                  <label style={{display: "flex", gap: "4px",alignItems: "center", }} >
                    <input type="radio" onClick={() => handleStoresPlayers(false, false)} name="isStoreOrPlayer" /> Players  </label>
                </div>}
              </div>

              <button className="addClientButton" onClick={() => handleAddClientModal()}> Add Client </button>
            </div>
            <div className="selectedAccount">
              <div className="acccountName">
                <div className="acccountNameUpper"> Account </div>
                <div>{" "} {selelctedAccount.userName ? selelctedAccount.userName : "N/A"}{" "} </div>
              </div>
              <div className="balance">
                <div className="acccountNameUpper">Credits</div>
                <div> {selelctedAccount.credits} </div>
              </div>
              <div className="lastLogin">
                <div className="acccountNameUpper"> Last Login </div>
                <div> {selelctedAccount.lastLogin}</div>
              </div>
              <div className="timeZone">
                <div className="acccountNameUpper">Time Zone </div>
                <div>{selelctedAccount.timeZone} </div>
              </div>
              <div className="activeStatus">
                <div className="acccountNameUpper"> Active Status </div>
                <div
                  style={{ display: "flex", gap: "5px", alignItems: "center" }}
                >
                  <div>
                    {selelctedAccount.activeStatus ? "Active" : "InActive"}
                  </div>
                  <div
                    style={{
                      width: "15px",
                      borderRadius: "7px",
                      height: "15px",
                      backgroundColor: selelctedAccount.activeStatus ? "green" : "red",  }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="modifyAccountInfoButtons">
              <button
                className="companyTableCellDataButtonContainerButton deleteButton upper"
                onClick={() => handleDeleteModal(selelctedAccount.userName)}
              >
                Delete
              </button>
              {!(
                user.designation == "company" &&
                selelctedAccount.designation != "master"
              ) && (
                <button
                  className="companyTableCellDataButtonContainerButton lower"
                  onClick={() => addCredits(selelctedAccount, 1)}
                >
                  Recharge
                </button>
              )}
              {!(
                user.designation == "company" &&
                selelctedAccount.designation != "master"
              ) && (
                <button
                  className="companyTableCellDataButtonContainerButton lower"
                  onClick={() => addCredits(selelctedAccount, -1)}
                >
                  Redeem
                </button>
              )}
              <button
                className="companyTableCellDataButtonContainerButton lower "
                onClick={() => handleUpdatePassword(selelctedAccount)}
              >
                Update Password
              </button>
              <button
                className="companyTableCellDataButtonContainerButton upper"
                onClick={() => handleTransactions(selelctedAccount.userName)}
              >
                Transactions
              </button>
              <button
                className="companyTableCellDataButtonContainerButton upper"
                onClick={() => handleReport(selelctedAccount.userName)}
              >
                Report
              </button>
            </div>
          </div>
          {/* //////////////////////////////////////////////////////////////////////////// */}
          <div className="thirdCompnayUserViewColumn">
            <table className="companyTable">
              <tr className="companyTableCell">
                <th className="companyTableCellHeader">Management</th>
                <th className="companyTableCellHeader">User Name</th>
                <th className="companyTableCellHeader">NickName</th>
                <th className="companyTableCellHeader">Designation</th>
                <th className="companyTableCellHeader">Credits</th>
                <th className="companyTableCellHeader">TimeZone</th>
                <th className="companyTableCellHeader">Status</th>
                <th className="companyTableCellHeader">Login Times</th>
                <th className="companyTableCellHeader">Last Login</th>
              </tr>

              {filteredClient.map((row, index) => (
                <tr className="companyTableCell" key={row.name}>
                  <td className="companyTableCellDataButtonContainer">
                    <button
                      className="companyTableCellDataButtonContainerButton"
                      onClick={() =>
                        setSelectedAccount(row)
                      }
                    >
                      Update
                    </button>
                  </td>
                  <td
                    className="companyTableCellDataUserName"
                    onClick={() => handleCompanyClick(row)}
                  >
                    {row.userName}
                  </td>
                  <td className="companyTableCellData">
                    {row.nickName ? row.nickName : "N/A"}
                  </td>
                  <td className="companyTableCellData">
                    {row.designation ? row.designation : "N/A"}
                  </td>
                  <td className="companyTableCellData">{row.credits}</td>
                  <td className="companyTableCellData">
                    {row.timeZone ? row.timeZone : "EST"}
                  </td>
                  <td className="companyTableCellData">
                    <button
                      className="companyTableCellDataButtonContainerButton upper"
                      style={{
                        backgroundColor: row.activeStatus ? "green" : "red",
                        marginLeft: "2px",
                        marginRight: "2px",
                      }}
                      onClick={() => handleActiveInactive(row)}
                    >
                      {row.activeStatus ? (
                        <span style={{ paddingLeft: "1px" }}>
                          &nbsp;Active&nbsp;&nbsp;
                        </span>
                      ) : (
                        <span>InActive</span>
                      )}{" "}
                    </button>{" "}
                  </td>
                  <td className="companyTableCellData">
                    {row.loginTimes >= 0 ? row.loginTimes : "N/A"}
                  </td>
                  <td className="companyTableCellData">
                    {row.lastLogin ? row.lastLogin : "N/A"}
                  </td>
                </tr>
              ))}
            </table>
          </div>
          <div className="paginationContainer">
            <div className="backButton" onClick={() => handleBackButton()}>
              <ArrowBackIcon />
            </div>
            <div className="paginationView">
              <Pagination
                count={Math.ceil(totalPage / 10)}
                color="primary"
                page={page}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>

      {isUpdateCredit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              className="closeButton"
              onClick={() => setIsUpdateCredit(false)}
            >
              &times;
            </div>
            <form className="form" onSubmit={(e) => handleSubmit(e)}>
              <div
                style={{ color: "black" }}
              >{`UserName : ${details.userName}`}</div>
              <br />
              <div style={{ color: "black" }}>
                {" "}
                NickName : {`${details.nickName} `}{" "}
              </div>
              <br />
              <div style={{ color: "black" }}>
                {" "}
                Initial Credits : {`${details.initialcredits}`}
              </div>
              <label>
                {`${
                  addOrRedeemeCredits > 0
                    ? "Add Credit : "
                    : "Redeeme Credits : "
                }`}
                <input
                  type="text"
                  value={details.credits}
                  onChange={(e) =>
                    handleChangeFormDetails({ credits: e.target.value.trim() })
                  }
                />
              </label>
              <br />
              <button type="submit" onClick={() => updateCredit()}>
                {" "}
                {`${
                  addOrRedeemeCredits > 0 ? "Add Credit" : "Redeeme Credits"
                }`}{" "}
              </button>
            </form>
          </div>
        </div>
      )}

      {isAddClientModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              className="closeButton"
              onClick={() => setIsClientPopModalOpen(false)}
            >
              &times;
            </div>
            <div className="addUserForm">
              <form className="form" onSubmit={(e) => handleSubmit(e)}>
                <div>
                  <div> {`UserName * : `} </div>
                  <input
                    className="addClientFiled"
                    type="text"
                    value={details.clientUserName}
                    onChange={(e) =>
                      handleChangeFormDetails({
                        clientUserName: e.target.value.trim(),
                      })
                    }
                  />
                </div>
                <div>
                  <div>{`NickName : `} </div>
                  <input
                    className="addClientFiled"
                    type="text"
                    value={details.clientNickName}
                    onChange={(e) =>
                      handleChangeFormDetails({
                        clientNickName: e.target.value.trim(),
                      })
                    }
                  />
                </div>
                <div>
                  <div>{`Password * : `}</div>
                  <input
                    className="addClientFiled"
                    type="text"
                    value={details.password}
                    onChange={(e) =>
                      handleChangeFormDetails({
                        password: e.target.value.trim(),
                      })
                    }
                  />
                </div>
                <div>
                  <div>{`Confirm Password * : `}</div>
                  <input
                    className="addClientFiled"
                    type="text"
                    value={details.confirmPassword}
                    onChange={(e) =>
                      handleChangeFormDetails({
                        confirmPassword: e.target.value.trim(),
                      })
                    }
                  />
                </div>
                {user.designation == "subDistributer" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      fontSize: "15px",
                      justifyContent: "center",
                    }}
                  >
                    <label>
                      <input
                        type="radio"
                        onClick={() => setIsPlayer(false)}
                        name="activity"
                      />{" "}
                      {" Store"}
                    </label>
                    <label>
                      <input
                        type="radio"
                        onClick={() => setIsPlayer(true)}
                        name="activity"
                      />{" "}
                      {" Player"}
                    </label>
                  </div>
                )}
                <div>Initial Credit : 0</div>
                <button type="submit" onClick={() => addClient()}>
                  Add client
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isUpdatePassword && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              className="closeButton"
              onClick={() => setIsUpdatePassword(false)}
            >
              &times;
            </div>
            <form className="form" onSubmit={(e) => handleSubmit(e)}>
              <div
                style={{ color: "black" }}
              >{`UserName : ${details.userName}`}</div>
              <div style={{ color: "black" }}>
                {" "}
                NickName : {`${details.nickName} `}
              </div>
              <br />
              <label>
                {`Enter New Password`}
                <input
                  type="text"
                  value={details.password}
                  onChange={(e) =>
                    handleChangeFormDetails({ password: e.target.value.trim() })
                  }
                />
              </label>
              <br />
              <label>
                {`Confirm New Password`}
                <input
                  type="text"
                  value={details.confirmNewpassword}
                  onChange={(e) =>
                    handleChangeFormDetails({
                      confirmNewpassword: e.target.value.trim(),
                    })
                  }
                />
              </label>
              <button type="submit" onClick={() => updatePassword()}>
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {openDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div>
              <h5 style={{ color: "black" }}> Are you sure want to delete</h5>
              <button onClick={() => handleDelete()}>Yes</button>
              <button onClick={() => setOpenDelete(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {isReportOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="closeButton" onClick={() => setIsReportOpen(false)}>
              &times;
            </div>
            <br />
            <div>
              <table className="dashboardHistoryTable">
                <tr className="dashboardHistoryTableCellHeader">
                  <td className="dashboardHistoryTableCellDataHeader">
                    Total Recharged
                  </td>
                  <td className="dashboardHistoryTableCellDataHeader">
                    Total Redeemed
                  </td>
                  <td className="dashboardHistoryTableCellDataHeader">
                    Holding Percentage
                  </td>
                </tr>

                <tr className="dashboardHistoryTableCell">
                  <td className="dashboardHistoryTableCellData">
                    {selelctedAccount.totalRecharged}
                  </td>
                  <td className="dashboardHistoryTableCellData">
                    {-1 * selelctedAccount.totalRedeemed}
                  </td>
                  <td className="companyTableCellData">
                    {selelctedAccount.totalRedeemed >
                    -1 * selelctedAccount.totalRecharged
                      ? ""
                      : "-"}
                    {(
                      ((selelctedAccount.totalRecharged +
                        selelctedAccount.totalRedeemed) /
                        selelctedAccount.totalRecharged) *
                      100
                    ).toFixed(2)}
                    %
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      )}

      {openHistory && (
        <div className="modal-overlay">
          <div className="modal-content-history">
            <div className="dashboardHistoryTableWindow">
              <div
                className="closeButton"
                onClick={() => setOpenHistory(false)}
              >
                &times;
              </div>
              <div>
                <table className="dashboardHistoryTable">
                  <tr className="dashboardHistoryTableCellHeader">
                    <td className="dashboardHistoryTableCellDataHeader">
                      Credior
                    </td>
                    <td className="dashboardHistoryTableCellDataHeader">
                      Debitor
                    </td>
                    <td className="dashboardHistoryTableCellDataHeader">
                      Credits
                    </td>
                    <td className="dashboardHistoryTableCellDataHeader">
                      Time
                    </td>
                  </tr>
                  {history
                    .map((row) => (
                      <tr className="dashboardHistoryTableCell" key={row.name}>
                        <td className="dashboardHistoryTableCellData">
                          {row.creditor}
                        </td>
                        <td className="dashboardHistoryTableCellData">
                          {row.debitor}
                        </td>
                        <td className="dashboardHistoryTableCellData">
                          {row.credit}
                        </td>
                        <td className="dashboardHistoryTableCellData">{`${row.createdAtDate},${row.createdAtTime}`}</td>
                      </tr>
                    ))
                    .reverse()}
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
