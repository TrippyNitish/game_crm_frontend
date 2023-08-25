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

    const user = useSelector((state) => state.user)
    const clientList = useSelector((state) => state.clientList)

    var [startDate, setStartDate] = useState("")
    var [endDate, setEndDate] = useState(Date.now)
    const [history, setHistory] = useState([])

    const [selectedHirarchy, setSelectedHirarchy] = useState("all")

    const currentDate = new Date().toISOString().split('T')[0];

 
    const searchTransactionInPeriod = async () => {
        const response = await getTransactionsOnBasisOfPeriodApi({ startDate, endDate, hirarchyName: selectedHirarchy, userName: user.userName })
        setHistory(response.data.transactionsFiltered)
    }

    useEffect(() => {
        setFilteredClient(clientList)
    }, [clientList])

    useEffect(() => {
        if (!user.userName)
            navigate("/")
        setStartDate("2018-01-01")
        setEndDate(currentDate)
    }, [])

    return (

        <div className='secondCompnayUserViewColumn'>
            <div className='secondCompnayUserViewColumnComponents'>
                <div>
                    <label for="start">Start date: {' '}</label>
                    <input type="date" value={startDate} min="2018-01-01" max={currentDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                    <label for="start">End date:{' '}</label>
                    <input type="date" value={endDate} min="2019-01-01" max={currentDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>

            </div>
            <div className='secondCompnayUserViewColumnComponents'>
                <div>
                    <label>Select Type : {' '}</label>
                    <select value={selectedHirarchy} onChange={(e) => setSelectedHirarchy(e.target.value)}>
                        <option value="all">All</option>
                        <option value="master">Master</option>
                        <option value="distributer">Distributer</option>
                        <option value="subDistributer">Sub Distributer</option>
                        <option value="store">Store</option>
                        <option value="users">Users</option>
                    </select>
                </div>
                <button onClick={() => searchTransactionInPeriod()}>Search</button>
            </div>

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
    )
}

export default CompanyDashboard