import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const AuthorizeUser = ({ children }) => {
  const [cookies, setCookie] = useCookies(["userId"]);

  if (!token) {
    return <Navigate to={"/"} replace={true}></Navigate>;
  }

  return children;
};

export const ProtectRoute = ({ children }) => {
  const username = useAuthStore.getState().auth.username;
  if (!username) {
    return <Navigate to={"/"} replace={true}></Navigate>;
  }
  return children;
};
