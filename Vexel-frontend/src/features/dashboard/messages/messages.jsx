import { useEffect, useRef, useState } from "react";
import { useMessages } from "/src/api/useMessages";
import styles from "./messages.module.scss";

import sendSymbol from "/src/assets/svg/send.svg";
import infoSymbol from "/src/assets/svg/info-circle.svg";

export default function Messages({ conversationId, conversationName }) {
  const messagesRef = useRef(null);
  const footerRef = useRef(null);
  const messageBoxRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState("cd3ce425-fbec-4dd1-85da-4067bd67cc87");

  const { messages, loadMore, loading, hasMore, error } = useMessages({ 
    conversationId, 
    howMuch: 20 
  });

  const messagesScrollHandler = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: 'instant',
      });
    }
  }

  const handleScroll = () => {
    const container = messagesRef.current;
    if (!container) return;

    if (container.scrollTop < 100 && hasMore && !loading) {
      const previousScrollHeight = container.scrollHeight;
      
      loadMore().then(() => {
        setTimeout(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - previousScrollHeight;
        }, 0);
      });
    }
  };

  const newMessageHandler = async () => {
    const value = messageBoxRef.current.value;

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

    setTimeout(() => messagesScrollHandler(), 100);
  }

  const inputHandler = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      newMessageHandler()
    }
    textAreaSizeHandler()
  }

  const textAreaSizeHandler = () => {
    if (!messageBoxRef.current || !footerRef.current) return;

    messageBoxRef.current.style.height = "auto";
    messageBoxRef.current.style.height = messageBoxRef.current.scrollHeight + 4 + "px";

    if (messagesRef.current.scrollTop = messagesRef.current.scrollHeight) {
      messagesScrollHandler()
    }

    footerRef.current.classList.remove(styles.multipleLines);
    if (messageBoxRef.current.clientHeight > 55)
      footerRef.current.classList.add(styles.multipleLines);
  }

  const groupMessagesBySender = (messages) => {
    const grouped = [];
    let currentGroup = null;

    messages.forEach(msg => {
      const senderId = msg.senderID || msg.senderId;
      
      if (!currentGroup || currentGroup.sender !== senderId) {
        currentGroup = {
          sender: senderId,
          messages: [msg]
        };
        grouped.push(currentGroup);
      } else {
        currentGroup.messages.push(msg);
      }
    });

    return grouped;
  };

  useEffect(() => {
    if (messages.length > 0) {
      messagesScrollHandler()
    }
  }, [conversationId]);

  useEffect(() => {
    if (messages.length > 0 && !loading) {
      setTimeout(() => messagesScrollHandler(), 100);
    }
  }, [messages.length, loading]);

  const groupedMessages = groupMessagesBySender(messages);

  return (
    <section className={styles.messages}>
      <header>
        <h3 className="cursor-pointer">{conversationName || "Konwersacja"}</h3>
        <img src={infoSymbol} className="cursor-pointer" alt="info"/>
      </header>
      <div ref={messagesRef} onScroll={handleScroll}>
        {/* <div className={styles.messagesBlock} data-sender="me">
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
        </div> */}
        { !conversationId ? (
          <div className={styles.info}>
            <p>Wybierz konwersację, aby zobaczyć wiadomości</p>
          </div>
        ) : error ? (
          <div className={styles.info}>
            <p>Błąd ładowania wiadomości: {error}</p>
          </div>
        ) : (
          <>
            {loading && messages.length > 0 && (
              <div className={styles.info}>
                <p>Ładowanie starszych wiadomości...</p>
              </div>
            )}

            {!hasMore && messages.length > 0 && !loading && (
              <div className={styles.info}>
                <p>Początek konwersacji</p>
              </div>
            )}

            {messages.length === 0 && loading ? (
              <div className={styles.info}>
                <p>Ładowanie wiadomości...</p>
              </div>
            ) : (
              groupedMessages.map((group, groupIndex) => {
                const isMe = group.sender === currentUserId;
                
                return (
                  <div 
                    key={`group-${groupIndex}`}
                    className={styles.messagesBlock} 
                    data-sender={isMe ? "me" : group.sender}
                  >
                    {group.messages.map((msg, msgIndex) => (
                      <div 
                        key={msg.id || `msg-${groupIndex}-${msgIndex}`}
                        className={`${styles.messageSelectBlock} ${isMe ? styles.right : ''}`}
                      >
                        <div className={styles.message}>
                          <p>{msg.text || msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
      <footer ref={footerRef}>
        <textarea ref={messageBoxRef} rows="1" placeholder="Aa" onKeyDown={inputHandler} onInput={inputHandler}/>
        <img src={sendSymbol} alt="send" className="cursor-pointer" onClick={newMessageHandler}/>
      </footer>
    </section>
  );
}