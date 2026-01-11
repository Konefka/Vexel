import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import { getToken, setErrorHandler, logout } from "./api/SignalR.jsx";
import { setErrorHandler, checkAuth, logout } from "./api/Auth.jsx";
import { PrivateRoute, PublicRoute } from "./Guard.jsx";
import Register from "/src/features/auth/Register.jsx";
import Login from "/src/features/auth/Login.jsx";

import Modal from "/src/components/modal/modal.jsx";
import Cover from "/src/components/cover/cover.jsx";
import Header from "/src/components/header/header.jsx";
import Banner from "/src/components/banner/banner.jsx";
import Box from "/src/components/test-box.jsx";


export default function App () {
  // ERROR -> modal
  const [error, setError] = useState(null);

  useEffect(() => {
    setErrorHandler(setError); // Send function to change the state of the modal
  }, []);

  // Login/Register -> Cover
  const [authOpen, setAuthOpen] = useState(false);
  const [authCard, setAuthCard] = useState(0); // 0 = login, 1 = register

  // Set usable navigation buttons
  const navigate = useNavigate();

  //test

  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
      checkAuth().then(logged => {
        setIsLogged(logged);
      });
  }, []);

  useEffect(() => {
    if (isLogged) {
      navigate("/message-dashboard");
    }
  }, [isLogged]);

  return (
    <>
      <Modal active={!!error} message={error} onClose={() => setError(null)} />
      <Routes>
        <Route path="/" element={<Navigate to="/home"/>}/>
        <Route path="/home"
          element={
            <PublicRoute isLoggedIn={isLogged}>
              <Header nav={["Application", "About", "FAQ"]} buttonText="Login" onButtonClick={() => setAuthOpen(true)}/>
              <Banner
                bigText={"All your private messages\nIn one place"}
                message={"Secure, fast and reliable messages\nSo that you don't have to worry about anyone stealing your data"}
                buttons={["Join us", "About us"]}
                whatToDoOnClick = {[() => setAuthOpen(true)]}
              />
              <Cover active={authOpen} onClose={() => setAuthOpen(false)}
                show={
                  authCard === 0 ? <Login register={() => setAuthCard(1)}/> : <Register login={() => setAuthCard(0)}/>
                }
              />
            </PublicRoute>
          }
        />
        <Route path="/message-dashboard"
          element={
            <PrivateRoute isLoggedIn={isLogged}>
              <Header nav={["Messages", "Profile"]} buttonText="Logout" onButtonClick={() => logout()}/>
              <Box/>
            </PrivateRoute>
          }
        />
        <Route path="*"
        element={
          <>
            <Header buttonText="Return to home" onButtonClick={() => navigate("/home")}/>
            <Banner
              bigText={"Something went wrong\n404 not found"}
              message="The page you were looking for doesn't exist"
              buttons={["Return to home", "Try again"]}
              whatToDoOnClick = {[() => navigate("/home"), () => window.location.reload()]}
            />
          </>
        }/>
      </Routes>
    </>
  );
}