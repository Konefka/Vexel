import { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate, useNavigate } from "react-router-dom";
// import { getToken, setErrorHandler, logout } from "./api/SignalR.jsx";
import { setErrorHandler, logout } from "./api/Auth.jsx";
import { MyRouteHandler } from "./Guard.jsx";
import Register from "/src/features/auth/Register.jsx";
import Login from "/src/features/auth/Login.jsx";

import Modal from "/src/components/modal/modal.jsx";
import Cover from "/src/components/cover/cover.jsx";
import Header from "/src/components/header/header.jsx";
import Banner from "/src/components/banner/banner.jsx";

import Dashboard from "./features/dashboard/dashboard.jsx";
import Sidebar from "/src/features/dashboard/sidebar/sidebar.jsx";
import Messages from "/src/features/dashboard/messages/messages.jsx";

import Spotify from "/src/components/spotify/spotify.jsx";
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

  return (
    <>
      <Modal active={!!error} message={error} onClose={() => setError(null)} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace/>}/>
        <Route path="/home"
          element={
            <MyRouteHandler isPrivate={false}>
              <Header nav={["Application", "About", "FAQ"]} buttonText="Login" onButtonClick={() => setAuthOpen(true)}/>
              <Banner
                bigText={"All your private messages\nIn one place"}
                message={"Secure, fast and reliable messages\nSo that you don't have to worry about anyone stealing your data"}
                buttons={["Join us", "About us"]}
                whatToDoOnClick = {[() => setAuthOpen(true), () => navigate("/about")]}
              />
              <Cover active={authOpen} onClose={() => setAuthOpen(false)} isModalOn={!!error}
                show={
                  authCard === 0
                  ? <Login register={() => setAuthCard(1)} then={() => navigate("/dashboard", { replace: true })}/>
                  : <Register login={() => setAuthCard(0)} then={() => navigate("/dashboard", { replace: true })}/>
                }
              />
            </MyRouteHandler>
          }
        />
        <Route path="/dashboard"
          element={
            <MyRouteHandler isPrivate={true}>
              <Dashboard>
                <Sidebar/>
                <Outlet/>
              </Dashboard>
            </MyRouteHandler>
          }
        >
          <Route index element={<Navigate to="home" replace/>}/>
          <Route path="home" element={<h1>Home</h1>}/>
          <Route path="friends" element={<h1>Friends</h1>}/>
          <Route path="messages" element={<Messages/>}/>
          <Route path="community" element={<h1>Community</h1>}/>
          <Route path="notifications" element={<h1>Notifications</h1>}/>
          <Route path="settings" element={<h1>Settings</h1>}/>
        </Route>
        
        <Route path="/Who_decided_that?"
          element={
            <Banner
              bigText={"My attacks have no effect on you?\nWho decided that?"}
              message={"Your darkness swallowed up my sun? Who decided that?"}
              buttons={["Who decided that?", "Who decided that?"]}
              whatToDoOnClick = {[() => navigate("/home"), () => navigate("/home")]}
            ><Spotify link="https://open.spotify.com/embed/track/6XNUWMNQxPkOSPOyCpQSM3?utm_source=generator&theme=0"/>
            </Banner>
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
          }
        />
      </Routes>
    </>
  );
}