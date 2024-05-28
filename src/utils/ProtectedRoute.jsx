import { Navigate } from "react-router-dom";
import { getDecodedToken } from "./authenticate";

const ProtectedRoute = ({ children }) => {
  const decodedToken = getDecodedToken();
  const isTokenValid = decodedToken && decodedToken.exp * 1000 > Date.now();

  if (isTokenValid) {
    return children;
  }

  return <Navigate to="/" />;
};

export default ProtectedRoute;
