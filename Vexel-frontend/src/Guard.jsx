import { Navigate } from "react-router-dom";

export function PrivateRoute({isLoggedIn, redirectTo, children}) {

  if (!isLoggedIn) {
    return <Navigate to={redirectTo || "/"} replace />;
  }

  return <>{children}</>
}

export function PublicRoute({isLoggedIn, redirectTo, children}) {

  if (isLoggedIn) {
    return <Navigate to={redirectTo || "/message-dashboard"} replace />;
  }

  return <>{children}</>
}