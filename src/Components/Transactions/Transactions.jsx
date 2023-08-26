import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import './Transaction.css'
import { getTransactionsOnBasisOfPeriodApi } from '../../services/api';
import NavBar from '../NavBar/Navbar';
import Sidebar from '../Sidebar/SideBar';


const TransactionDetails = () => {

    const navigate = useNavigate()

    const user = useSelector((state) => state.user)

    var [startDate, setStartDate] = useState("")
    var [endDate, setEndDate] = useState(Date.now)
    const [history, setHistory] = useState([])

    const [selectedHirarchy, setSelectedHirarchy] = useState("all")

    const currentDate = new Date().toISOString().split('T')[0];

    const searchTransactionInPeriod = async () => {
        console.log((user.designation == 'company' ? selectedHirarchy : user.designation))
        if (user.designation == "company") {
            const response = await getTransactionsOnBasisOfPeriodApi({ startDate, endDate, hirarchyName: selectedHirarchy, designation: "company", userName: user.userName })
            setHistory(response.data.transactionsFiltered)

        } else {
            const response = await getTransactionsOnBasisOfPeriodApi({ startDate, endDate, designation: user.designation, userName: user.userName })
            setHistory(response.data.transactionsFiltered)
        }
    }

    useEffect(() => {
        console.log("tttt", user)
        if (!user.userName)
            navigate("/")
        setStartDate("2018-01-01")
        setEndDate(currentDate)
        searchTransactionInPeriod()
    }, [])

    return (
        <div className='transactonView'>
            <NavBar />
            <div style={{ display: "flex", height: "100%", width: "100%" }}>
                <div className='isSideBarShow' style={{ height: "100%", backgroundColor: 'gray' }}>
                    <Sidebar />
                </div>
                <div>
                    <div className=''>
                        <div>
                            <label for="start">Start date: {' '}</label>
                            <input type="date" value={startDate} min="2018-01-01" max={currentDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <label for="start">End date:{' '}</label>
                            <input type="date" value={endDate} min="2019-01-01" max={currentDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        {user.designation == "company" && <div className=''> <label>Select Type : {' '}</label>
                            <select value={selectedHirarchy} onChange={(e) => setSelectedHirarchy(e.target.value)}>
                                <option value="all">All</option>
                                <option value="master">Master</option>
                                <option value="distributer">Distributer</option>
                                <option value="subDistributer">Sub Distributer</option>
                                <option value="store">Store</option>
                                <option value="users">Users</option>
                            </select>
                        </div>}
                        <button onClick={() => searchTransactionInPeriod()}>Search</button>
                    </div>

                    <div>
                        <table className="transactionHistoryTable">
                            <tr className="transactionTableCell">
                                <td className="transactionTableCellDataHeader">Credior</td>
                                <td className="transactionTableCellDataHeader">Debitor</td>
                                <td className="transactionTableCellDataHeader">Credits</td>
                                <td className="transactionTableCellDataHeader">Time</td>
                            </tr>
                            {history.map((row) => (
                                <tr className="transactionTableCell" key={row.name}>
                                    <td className="transactionTableCellData">{row.creditor}</td>
                                    <td className="transactionTableCellData">{row.debitor}</td>
                                    <td className="transactionTableCellData">{row.credit}</td>
                                    <td className="transactionTableCellData">{`${row.createdAtDate},${row.createdAtTime}`}</td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default TransactionDetails