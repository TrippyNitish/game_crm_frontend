import Login from './Pages/Login/Login';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './Pages/ResetPassword';
import Dashboard from './Pages/Dashboard/Dashboard';
import './App.css'
import TransactionDetails from './Components/Transactions/Transactions';
import AddClient from './Components/Add User/AddUsers';

function App() {
 
  return (
    <>
      <div style={{width:"100%",height:"100%"}}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/dashboard/user" element={<Dashboard />} />
            <Route exact path="/resetPassword" element={<ResetPassword />} />
            <Route exact path="/transactionDetails" element={<TransactionDetails/>}/>
            <Route exact path="/addClient" element={<AddClient/>}/>
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
