import { useState, useEffect } from "react";
import { getToken, setErrorHandler } from "./api/SignalR.jsx";
import Register from "/src/features/auth/Register.jsx";
import Login from "/src/features/auth/Login.jsx";

import Modal from "/src/components/modal/modal.jsx";
import Cover from "/src/components/cover/cover.jsx";
import Header from "/src/components/header/header.jsx";
import Banner from "/src/components/banner/banner.jsx";
import Box from "/src/components/test-box.jsx";


export default function App() {
  // ERROR -> modal
  const [error, setError] = useState(null);

  useEffect(() => {
    setErrorHandler(setError); // Send function to change the state of the modal
  }, []);

  // Login/Register -> Cover
  const [authOpen, setAuthOpen] = useState(false);
  const [authCard, setAuthCard] = useState(0); // 0 = login, 1 = register

  const show = [<Login register={() => setCard(1)}/>, <Register login={() => setCard(0)}/>];

  // Logged in or not
  function WhatToShow() {
    if (getToken()) {
      return <Box/>
    } else {
      return (
        <>
          <Header openAuth={() => setAuthOpen(true)}/>
          <Banner
            bigText={"All your private messages\nIn one place"}
            message="Secure, fast and reliable messages. So that you don't have to worry about anyone stealing your data"
            buttons={["Join us", "Our capabilities"]}
            whatToDoOnClick = {() => setAuthOpen(true)}
          />
        </>
      )  
    }
  }

  return (
    <>
      <Modal active={!!error} message={error} onClose={() => setError(null)} />
      {WhatToShow()}
      <Cover active={authOpen} onClose={() => setAuthOpen(false)}
        show={
          authCard === 0 ? <Login register={() => setAuthCard(1)}/> : <Register login={() => setAuthCard(0)}/>
        }
      />
    </>
  );
}