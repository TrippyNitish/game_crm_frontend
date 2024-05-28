import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const getDecodedToken = () => {
  const token = Cookies.get("userToken");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }
  return null;
};
