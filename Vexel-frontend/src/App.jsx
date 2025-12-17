import { getToken } from "./api/SignalR.jsx";

import Header from "./components/header/header.jsx";
import Box from "./components/test-box.jsx"


function App() {

  function WhatToShow() {
    if (getToken()) {
      return <Box/>
    } else {
      return <Header/>
    }
  }

  return (
    <>
      {WhatToShow()}
    </>
  );
}

export default App