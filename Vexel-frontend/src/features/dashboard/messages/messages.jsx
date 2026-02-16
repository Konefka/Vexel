import { useRef } from "react";
import styles from "./messages.module.scss";

import sendSymbol from "/src/assets/svg/send.svg";

import infoSymbol from "/src/assets/svg/info-circle.svg";

export default function Messages() {
  const footerRef = useRef(null);

  const newLineHandler = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + 2 + "px";

    footerRef.current.classList.remove(styles.multipleLines);
    if (e.target.clientHeight > 50) 
      footerRef.current.classList.add(styles.multipleLines);
  }

  return (
    <section className={styles.messages}>
      <header>
        <h3 className="cursor-pointer">Nickname</h3>
        <img src={infoSymbol} className="cursor-pointer" alt="info"/>
      </header>
      <div>
      </div>
      <footer ref={footerRef}>
        <textarea rows="1" placeholder="Aa" onInput={newLineHandler}/>
        <img src={sendSymbol} alt="send" className="cursor-pointer" />
      </footer>
    </section>
  );
}