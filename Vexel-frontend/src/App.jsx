import { useState, useEffect } from "react";
import { getToken, setErrorHandler } from "./api/SignalR.jsx";

import Header from "./components/header/header.jsx";
import Box from "./components/test-box.jsx";
import Modal from "/src/components/modal/modal.jsx";


export default function App() {
  const [error, setError] = useState(null);

  useEffect(() => {
    setErrorHandler(setError);
  }, []);

  function WhatToShow() {
    if (getToken()) {
      return <Box/>
    } else {
      return <Header/>
    }
  }

  return (
    <>
      <Modal active={!!error} message={error} onClose={() => setError(null)} />
      {WhatToShow()}
    </>
  );
}