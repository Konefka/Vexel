import { useState } from "react";
import { register, saveToken } from "/src/api/SignalR.jsx";

import styles from "./auth.module.scss";

export default function Register(functions) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    const result = await register(email, password);

    if (result.error) {
      alert(result.error);
      return;
    }

    saveToken(result.token);
  }

  return (
    <div className={styles.login}>
      <h2>Welcome!</h2>
      <p>Please register to your account.</p>
      {/* <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /> */}
      <input name="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"/>
      <input name="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} autocomplete="off"/>
      <input type="button" className="cursor-pointer" onClick={handleRegister} value="Register"/>
      <hr/>
      <p>If you already have an account, please <span className="linked-text" onClick={functions.login}>login</span>.</p>
    </div>
  );
}
