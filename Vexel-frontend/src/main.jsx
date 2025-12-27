import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import Snowfall from "react-snowfall";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Snowfall
      style={{
        pointerEvents: "none",
        backgroundColor: "transparent",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1
      }}
      
      color="hsl(0, 0%, 98%)"
      snowflakeCount={150}
      speed={[0.5, 2]}
      wind={[-1, 1.1]}/>
    <App/>
  </StrictMode>,
)