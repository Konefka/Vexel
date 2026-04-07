import { useRef } from "react";
import { logout } from "/src/api/Auth.jsx";
import { useNavigate } from "react-router-dom";
import { setUsername } from "/src/api/Account.jsx";

import styles from "./setUsername.module.scss";

export default function SetUsername() {
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const errorRef = useRef(null);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    if (e.key === "Enter") {
      buttonRef.current?.click();
    }
  };

  const sendUsername = async () => {
    const username = inputRef.current.value;
    if (!username.trim()) {
      errorRef.current.innerText = "";
      return;
    }

    const result = await setUsername(username);

    if (result !== true) {
      errorRef.current.innerText = result || "Something went wrong";
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <section className={styles.userSetup}>
      <fieldset className={styles.username}>
        <legend>Step 1</legend>
        <h1>Write your unique username</h1>
        <p ref={errorRef}/>
        <input ref={inputRef} type="text" /*onFocus={showRequirements}*/ onKeyDown={inputHandler}/>
        <div className={styles.buttons}>
          <button ref={buttonRef} className={`${styles.submit} cursor-pointer`} onClick={sendUsername}>Submit</button>
          <button className="logout cursor-pointer" onClick={async () => await logout()}>Logout</button>
        </div>
      </fieldset>
    </section>
  );
}