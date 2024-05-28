import Login from "./Pages/Login/Login";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResetPassword from "./Pages/ResetPassword";
import Dashboard from "./Pages/Dashboard/Dashboard";
import "./App.css";
import TransactionDetails from "./Components/Transactions/Transactions";
import AddClient from "./Components/Add User/AddUsers";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route
              exact
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/resetPassword"
              element={
                <ProtectedRoute>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/transactionDetails"
              element={
                <ProtectedRoute>
                  <TransactionDetails />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/addClient"
              element={
                <ProtectedRoute>
                  <AddClient />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
