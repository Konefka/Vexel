import { useState } from "react";
import { login, saveToken } from "/src/api/SignalR.jsx";

import styles from "./auth.module.scss";

export default function Login(functions) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const result = await login(email, password);

    if (result.error) {
      alert(result.error);
      return;
    }

    saveToken(result.token);
  }

  return (
    <div className={styles.login}>
        <h2>Welcome!</h2>
        <p>Please login to your account.</p>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
        <input type="button" className="cursor-pointer" onClick={handleLogin} value="Login"/>
        <hr />
        <p>If you don't have an account, please <span className="linked-text" onClick={functions.register}>register</span>.</p>
    </div>
  );
}