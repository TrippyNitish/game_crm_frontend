import Login from './Pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./Pages/Dashboard/Dashboard";
import ResetPassword from './Pages/ResetPassword';
import CompanyDashboard from './Pages/CompanyDashboard/CompanyDashboard';
import './App.css'

function App() {
 
  return (
    <>
      <div style={{minWidth:"100%",minHeight:"100%"}}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/dashboard/user" element={<Dashboard />} />
            <Route exact path="/dashboard/company" element={<CompanyDashboard />} />
            <Route exact path="/resetPassword" element={<ResetPassword />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
