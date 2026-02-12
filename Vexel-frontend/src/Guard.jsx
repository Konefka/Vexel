import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { checkAuth } from "./api/Auth.jsx";

import Loader from "/src/components/loader/loader.jsx";

export function MyRouteHandler({isPrivate, redirectTo, children}) {

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

  // A headache
  // Redirects you from a site that you can not enter to the one that's perfect for you :)
  if (isLogged === isPrivate) {
    return <>{children}</>;
  } else {
    if (isLogged) return <Navigate to={redirectTo || "/dashboard/home"} replace />;
    else return <Navigate to={redirectTo || "/home"} replace />;
  }

  return <h1>Something went horribly wrong.</h1>; // In case of idk
}