import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import './Transaction.css'
import { getTransactionsOnBasisOfPeriodApi } from '../../services/api';
import NavBar from '../NavBar/Navbar';
import Sidebar from '../Sidebar/SideBar';
import Pagination from '@mui/material/Pagination';


const TransactionDetails = () => {

    const navigate = useNavigate()

    const user = useSelector((state) => state.user)

    var [startDate, setStartDate] = useState("")
    var [endDate, setEndDate] = useState(Date.now)
    const [history, setHistory] = useState([])
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0)
    const [selectedHirarchy, setSelectedHirarchy] = useState("all")

    const currentDate = new Date().toISOString().split('T')[0];

    const searchTransactionInPeriod = async (pageNumber = 1) => {
        console.log((user.designation == 'company' ? selectedHirarchy : user.designation))
        if (user.designation == "company") {
            const response = await getTransactionsOnBasisOfPeriodApi({ startDate, endDate, hirarchyName: selectedHirarchy, designation: "company", userName: user.userName, pageNumber })
            console.log("trf",response.data)
            setHistory(response.data.transactionsFiltered)
            setTotalPage(response.data.totalPageCount)

        } else {
            const response = await getTransactionsOnBasisOfPeriodApi({ startDate, endDate, designation: user.designation, userName: user.userName, pageNumber })
            console.log("trf",response.data)
            setHistory(response.data.transactionsFiltered)
            setTotalPage(response.data.totalPageCount)
        }
    }

    const handlePageChange = (event, pageNumber) => {
        setPage(pageNumber);
        searchTransactionInPeriod(pageNumber)
        console.log("page", pageNumber)
    };

    useEffect(() => {
        console.log("tttt", user)
        if (!user.userName)
            navigate("/")
        setStartDate("2018-01-01")
        setEndDate(currentDate)
        searchTransactionInPeriod()
    }, [])

    return (
        <div className='transactonPage'>
            <NavBar />
            <div className='transactionWindow'>
                <div className='isSideBarShow' style={{ height: "100%", backgroundColor: 'gray' }}>
                    <Sidebar />
                </div>
                <div className='transactionView'>
                    <div className='transactionFilterView'>
                        <div className='dateSelection'>
                            <div>
                                <label for="start">Start date: {' '}</label>
                                <input type="date" value={startDate} min="2018-01-01" max={currentDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div >
                                <label for="start">End date:{' '}</label>
                                <input type="date" value={endDate} min="2019-01-01" max={currentDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                        </div>

                        <div className='filterSelection'>
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

                    </div>

                    <div className='transactionTable'>
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
                    <div className='paginationContainer'>
                        <div>
                            <Pagination count={Math.ceil(totalPage / 20)} color="primary" page={page} onChange={handlePageChange} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionDetails