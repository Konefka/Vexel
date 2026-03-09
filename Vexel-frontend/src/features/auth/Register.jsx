import { useRef, useState } from "react";
import { register } from "/src/api/Auth.jsx";

import styles from "./auth.module.scss";

export default function Register(functions) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const buttonRef = useRef(null);

  const submitHandler = (e) => {
    if (e.key === "Enter") {
      if (buttonRef) buttonRef.current.click();
    }
  }

  return (
    <div className={styles.login} onKeyDown={submitHandler}>
      <h2>Welcome!</h2>
      <p>Please register to your account.</p>
      <input name="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} onClick={functions.onFocus} autoComplete="email"/>
      <input name="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onClick={functions.onFocus} autoComplete="off"/>
      <input ref={buttonRef} type="submit" className="cursor-pointer" onClick={async () => await register(email, password).then(logged => {if (logged) functions.then()})} value="Register"/>
      <hr/>
      <p>If you already have an account, please <span className="linked-text" onClick={functions.login}>login</span>.</p>
    </div>
  );
}