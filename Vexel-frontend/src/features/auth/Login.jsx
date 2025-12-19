import { useState } from "react";
import { login } from "/src/api/SignalR.jsx";

import styles from "./auth.module.scss";

export default function Login(functions) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.login}>
        <h2>Welcome!</h2>
        <p>Please login to your account.</p>
        <input name="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"/>
        <input name="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="off"/>
        <input type="button" className="cursor-pointer" onClick={async () => await login(email, password)} value="Login"/>
        <hr/>
        <p>If you don't have an account, please <span className="linked-text" onClick={functions.register}>register</span>.</p>
    </div>
  );
}