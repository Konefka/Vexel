import { use, useEffect, useRef } from "react";
import styles from "./messages.module.scss";

import sendSymbol from "/src/assets/svg/send.svg";

import infoSymbol from "/src/assets/svg/info-circle.svg";

export default function Messages() {
  const messagesRef = useRef(null);
  const footerRef = useRef(null);
  const messageBoxRef = useRef(null);

  const messagesScrollHandler = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: 'instant',
      });
    }
  }

  const newMessageHandler = () => {
    const value = messageBoxRef.current.value;
    console.log(value);

    if (!value.trim()) return;

    const lastChild = messagesRef.current.lastElementChild;
    const lastSender = lastChild ? lastChild.getAttribute('data-sender') : null;


    if (lastSender == "me") {
      lastChild.innerHTML +=
        `
          <div class="${styles.messageSelectBlock} ${styles.right}">
            <div class="${styles.message}">
              <p>${value}</p>
            </div>
          </div>
        `;
    } else {
      messagesRef.current.innerHTML += 
        `
          <div class="${styles.messagesBlock}" data-sender="me">
            <div class="${styles.messageSelectBlock} ${styles.right}">
              <div class="${styles.message}">
                <p>${value}</p>
              </div>
            </div>
          </div>
        `;
    }
    
    messageBoxRef.current.value = "";
    textAreaSizeHandler()
  }

  const inputHandler = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      newMessageHandler()
    }
    textAreaSizeHandler()
  }

  const textAreaSizeHandler = () => {
    messageBoxRef.current.style.height = "auto";
    messageBoxRef.current.style.height = messageBoxRef.current.scrollHeight + 4 + "px";
    messagesScrollHandler()

    footerRef.current.classList.remove(styles.multipleLines);
    if (messageBoxRef.current.clientHeight > 55)
      footerRef.current.classList.add(styles.multipleLines);
  }

  useEffect(() => {
    messagesScrollHandler()
  }, []);

  return (
    <section className={styles.messages}>
      <header>
        <h3 className="cursor-pointer">Nickname</h3>
        <img src={infoSymbol} className="cursor-pointer" alt="info"/>
      </header>
      <div ref={messagesRef}>
        <div className={styles.messagesBlock} data-sender="me">
          <div className={`${styles.messageSelectBlock} ${styles.right}`}><div className={styles.message}><p>Hej</p></div></div>
        </div>
        <div className={styles.messagesBlock} data-sender="Michał">
          <div className={styles.messageSelectBlock}><div className={styles.message}><p>Eloo</p></div></div>
        </div>
        <div className={styles.messagesBlock} data-sender="me">
          <div className={`${styles.messageSelectBlock} ${styles.right}`}><div className={styles.message}><p>Co tam u Ciebie?</p></div></div>
        </div>
        <div className={styles.messagesBlock} data-sender="Michał">
          <div className={styles.messageSelectBlock}><div className={styles.message}><p>A nic nic</p></div></div>
          <div className={styles.messageSelectBlock}><div className={styles.message}><p>Robię projekt</p></div></div>
        </div>
        <div className={styles.messagesBlock} data-sender="me">
          <div className={`${styles.messageSelectBlock} ${styles.right}`}><div className={styles.message}><p>Vexel?</p></div></div>
        </div>
        <div className={styles.messagesBlock} data-sender="Michał">
          <div className={styles.messageSelectBlock}><div className={styles.message}><p>Dokładnie</p></div></div>
          <div className={styles.messageSelectBlock}><div className={styles.message}><p>a ty?</p></div></div>
          <div className={styles.messageSelectBlock}><div className={styles.message}><p>Co tam porabasz?</p></div></div>
        </div>
        <div className={styles.messagesBlock} data-sender="me">
          <div className={`${styles.messageSelectBlock} ${styles.right}`}><div className={styles.message}><p>Idę na siłkę</p></div></div>
        </div>
        <div className={styles.messagesBlock} data-sender="Michał">
          <div className={styles.messageSelectBlock}><div className={styles.message}><p>ooo</p></div></div>
          <div className={styles.messageSelectBlock}><div className={styles.message}><p>Co dziś robisz?</p></div></div>
        </div>
        <div className={styles.messagesBlock} data-sender="me">
          <div className={`${styles.messageSelectBlock} ${styles.right}`}><div className={styles.message}><p>klatę i plecy</p></div></div>
        </div>
        <div className={styles.messagesBlock} data-sender="Michał">
          <div className={styles.messageSelectBlock}><div className={styles.message}><p>nicee</p></div></div>
          <div className={styles.messageSelectBlock}><div className={styles.message}><p>Musimy niedługo razem pójść</p></div></div>
        </div>
        <div className={styles.messagesBlock} data-sender="me">
          <div className={`${styles.messageSelectBlock} ${styles.right}`}><div className={styles.message}><p>dosło</p></div></div>
          <div className={`${styles.messageSelectBlock} ${styles.right}`}><div className={styles.message}><p>dawno razem nie byliśmy</p></div></div>
          <div className={`${styles.messageSelectBlock} ${styles.right}`}><div className={styles.message}><p>dobra, muszę lecieć</p></div></div>
        </div>
        <div className={styles.messagesBlock} data-sender="Michał">
          <div className={styles.messageSelectBlock}><div className={styles.message}><p>byee</p></div></div>
        </div>
      </div>
      <footer ref={footerRef}>
        <textarea ref={messageBoxRef} rows="1" placeholder="Aa" onKeyDown={inputHandler} onInput={inputHandler}/>
        <img src={sendSymbol} alt="send" className="cursor-pointer" onClick={newMessageHandler}/>
      </footer>
    </section>
  );
}