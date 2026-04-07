import { useEffect, useMemo, useRef, useState } from "react";
import { useCurrentUser } from "/src/api/UserContext";
import { useParams } from "react-router-dom";
import { useMessages } from "/src/api/useMessages";
import { useConversations } from "/src/api/useConversations";
import { useSignalR } from "/src/api/SignalRContext";
import styles from "./messages.module.scss";

import sendSymbol from "/src/assets/svg/send.svg";
import infoSymbol from "/src/assets/svg/info-circle.svg";
import arrowSymbol from "/src/assets/svg/arrow-down.svg";

export default function Messages({ onSelectConversation }) {
  const { conversationId } = useParams();
  const messagesRef = useRef(null);
  const footerRef = useRef(null);
  const messageBoxRef = useRef(null);
  const [displayName, setDisplayName] = useState("");
  const [showScrollArrow, setShowScrollArrow] = useState(false);

  const { currentUser, userLoading } = useCurrentUser();
  const { conversations, loading: conversationsLoading } = useConversations();
  const { sendMessage, setActiveConversation } = useSignalR();

  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(conv => conv.id === conversationId);

      if (conversation) {
        setDisplayName(conversation.name);
        if (onSelectConversation) onSelectConversation(conversation);
      }
    }

    setActiveConversation(conversationId ?? null);
    
    return () => setActiveConversation(null);
  }, [conversationId, conversations, onSelectConversation, setActiveConversation]);

  const isScrolledToBottom = () => {
    const container = messagesRef.current;
    if (!container) return true;
    return container.scrollHeight - container.scrollTop - container.clientHeight < 50;
  };

  const handleNewMessage = useCallback(() => {
    if (!isScrolledToBottom()) {
      setShowScrollArrow(true);
    }
  }, []);

  const { messages, loadMore, loading, hasMore, error } = useMessages({
    conversationId,
    howMuch: 30,
    onNewMessage: handleNewMessage
  });

  const messagesScrollHandler = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: 'instant',
      });
    }
  }

  const scrollHandler = () => {
    const container = messagesRef.current;
    if (!container) return;

    if (isScrolledToBottom()) {
      setShowScrollArrow(false);
    }

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

    messageBoxRef.current.value = "";
    textAreaSizeHandler();

    await sendMessage(conversationId, value);
    setTimeout(() => messagesScrollHandler(), 100);
  }

  const inputHandler = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      newMessageHandler();
    }
    textAreaSizeHandler();
  }

  const textAreaSizeHandler = () => {
    if (!messageBoxRef.current || !footerRef.current) return;

    messageBoxRef.current.style.height = "auto";
    messageBoxRef.current.style.height = messageBoxRef.current.scrollHeight + 4 + "px";

    if (messagesRef.current.scrollTop === messagesRef.current.scrollHeight) {
      messagesScrollHandler();
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
        currentGroup = { sender: senderName, messages: [msg] };
        grouped.push(currentGroup);
      } else {
        currentGroup.messages.push(msg);
      }
    });

    return grouped;
  };

  useEffect(() => {
    if (!loading) {
      messagesScrollHandler();
    }
  }, [loading]);

  const groupedMessages = useMemo(() => {if (!messages || messages.length === 0) return []; return groupMessagesBySender(messages);}, [messages]);

  return (
    <section className={styles.messages}>
      <header>
        <h3 className="cursor-pointer">{displayName || "Loading..."}</h3>
        {/* <img src={infoSymbol} className="cursor-pointer" alt="info"/> */}
      </header>
      <div ref={messagesRef} onScroll={scrollHandler}>
        <button
          className={`${styles.scrollArrow} ${showScrollArrow ? styles.show : ''}`}
          onClick={() => {
            messagesScrollHandler();
            setShowScrollArrow(false);
          }}
        >
          <img src={arrowSymbol}/>
        </button>
        {!conversationId ? (
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
                const isMe = group.sender === currentUser.name;
                return (
                  <div
                    key={`group-${groupIndex}`}
                    className={styles.messagesBlock}
                    data-sender={isMe ? currentUser.name : group.sender}
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