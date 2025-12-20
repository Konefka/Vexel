import { useState, useEffect } from "react";
import { getToken, setErrorHandler } from "./api/SignalR.jsx";

import Modal from "/src/components/modal/modal.jsx";
import Header from "./components/header/header.jsx";
import Banner from "./components/banner/banner.jsx";
import Box from "./components/test-box.jsx";


export default function App() {
  const [error, setError] = useState(null);

  useEffect(() => {
    setErrorHandler(setError);
  }, []);

  function WhatToShow() {
    if (getToken()) {
      return <Box/>
    } else {
      return  <>
                <Header/>
                <Banner
                  bigText={"All your private messages\nIn one place"}
                  message="Secure, fast and reliable messages. So that you don't have to worry about anyone stealing your data"
                  buttons={["Join us", "Our capabilities"]}
                />
              </>
    }
  }

  return (
    <>
      <Modal active={!!error} message={error} onClose={() => setError(null)} />
      {WhatToShow()}
    </>
  );
}