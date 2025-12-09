import { useState } from "react";
import { login, saveToken } from "../../api/SignalR.jsx";

export default function Login() {
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
    <div className="login">
        <h2>Logowanie</h2>
        <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)}/>
        <input type="password" placeholder="hasło" value={password} onChange={e => setPassword(e.target.value)}/>
        <button onClick={handleLogin}>Zaloguj</button>
    </div>
  );
}