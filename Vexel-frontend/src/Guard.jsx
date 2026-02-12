import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { checkAuth } from "./api/Auth.jsx";

import Loader from "/src/components/loader/loader.jsx";

export function MyRouteHandler({isPrivate, children}) {

  const [isLogged, setIsLogged] = useState(null); // The switch that turns on when you are logged in and off if you are not
  const location = useLocation(); // Takes the current subwebsite location

  // If location changes then check if the user is still logged in
  useEffect(() => {
    let mounted = true;
    checkAuth().then(logged => {
      if (mounted) setIsLogged(logged);
    });
    return () => { mounted = false; };
  }, [location.pathname]);

  if (isLogged == null) return <Loader/>;


  // Redirects you from a site that you can not enter to the one that's perfect for you :)
  if (isPrivate && !isLogged) return <Navigate to="/home" replace />;
  if (!isPrivate && isLogged) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}