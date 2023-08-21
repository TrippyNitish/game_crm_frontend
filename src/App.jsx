import Login from './Pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./Pages/Dashboard/Dashboard";
import ResetPassword from './Pages/ResetPassword';

function App() {

  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/dashboard/user" element={<Dashboard />} />
            <Route exact path="/resetPassword" element={<ResetPassword />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
