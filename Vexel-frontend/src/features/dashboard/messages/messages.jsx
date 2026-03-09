import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useMessages } from "/src/api/useMessages";
import { useConversations } from "/src/api/useConversations";
import styles from "./messages.module.scss";

import sendSymbol from "/src/assets/svg/send.svg";
import infoSymbol from "/src/assets/svg/info-circle.svg";

export default function Messages({ onSelectConversation }) {
  const { conversationId } = useParams();
  const messagesRef = useRef(null);
  const footerRef = useRef(null);
  const messageBoxRef = useRef(null);
  const [displayName, setDisplayName] = useState("");

  const { conversations, loading: conversationsLoading } = useConversations();

  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      
      const conversation = conversations.find(
        conv => conv.id === conversationId
      );

      if (conversation) {
        setDisplayName(conversation.name);
        
        if (onSelectConversation) {
          onSelectConversation(conversation);
        }
      }
    }
  }, [conversationId, conversations, onSelectConversation]);

  const { messages, loadMore, loading, hasMore, error } = useMessages({ 
    conversationId,
    howMuch: 30
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

  if (container.scrollTop === 0 && hasMore && !loading) {
    const previousScrollHeight = container.scrollHeight;
    
    loadMore().then(() => {
      requestAnimationFrame(() => {
        if (messagesRef.current) {
            container.scrollTo({
            top: container.scrollHeight - previousScrollHeight,
            behavior: 'instant',
          });
        }
      });
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
      const senderName = msg.senderName;
      
      if (!currentGroup || currentGroup.sender !== senderName) {
        currentGroup = {
          sender: senderName,
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
    if (!loading && hasMore) {
      messagesScrollHandler();
    }
  }, [loading]);

  const groupedMessages = groupMessagesBySender(messages);

  return (
    <section className={styles.messages}>
      <header>
        <h3 className="cursor-pointer">{displayName || "Loading..."}</h3>
        <img src={infoSymbol} className="cursor-pointer" alt="info"/>
      </header>
      <div ref={messagesRef} onScroll={handleScroll}>
        { !conversationId ? (
          <div className={styles.info}>
            <p>
              {conversationsLoading 
                ? "Ładowanie konwersacji..." 
                : "Wybierz konwersację, aby zobaczyć wiadomości"
              }
            </p>
          </div>
        ) : error ? (
          <div className={styles.info}>
            <p>Błąd ładowania wiadomości: {error}</p>
          </div>
        ) : (
          <>
            {!hasMore && !loading && (
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
                const isMe = group.sender === "me";
                
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