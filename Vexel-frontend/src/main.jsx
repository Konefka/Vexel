import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import Snowfall from "react-snowfall";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Snowfall color="hsl(0, 0%, 98%)" snowflakeCount={120} speed={[0.5, 2]} wind={[-1, 1]}/>
    <App />
  </StrictMode>,
)