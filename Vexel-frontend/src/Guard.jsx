import { Navigate } from "react-router-dom";
import { getToken } from "./api/SignalR.jsx";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = !!getToken();

  if (!isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }) => {
  const isLoggedIn = !!getToken();

  if (isLoggedIn) {
    return <Navigate to="/message-dashboard" />;
  }

  return <>{children}</>;
};

export { PrivateRoute, PublicRoute };