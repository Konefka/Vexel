import { useState } from "react";
import { register, saveToken } from "../../api/SignalR.jsx";

export default function Register() {
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
    <div className="register">
      <h2>Rejestracja</h2>
      {/* <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /> */}
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Zarejestruj</button>
    </div>
  );
}
