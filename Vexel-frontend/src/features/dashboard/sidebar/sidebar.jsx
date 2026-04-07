import { useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useConversations } from "/src/api/useConversations";
import { useNotifications } from "../../../api/useNotifications";
import { useCurrentUser } from "/src/api/UserContext";
import { logout } from "/src/api/Auth";
import styles from "./sidebar.module.scss";

import hashSymbol from "/src/assets/svg/hash.svg";
import homeSymbol from "/src/assets/svg/home.svg";
import friendsSymbol from "/src/assets/svg/friends.svg";
import messagesSymbol from "/src/assets/svg/messages.svg";
import communitySymbol from "/src/assets/svg/community.svg";
import bellSymbol from "/src/assets/svg/bell.svg";
import settingsSymbol from "/src/assets/svg/settings.svg";
import arrowSymbol from "/src/assets/svg/arrow-down.svg";
import userSymbol from "/src/assets/svg/user-outline.svg";
import exitSymbol from "/src/assets/svg/exit.svg";

export default function Sidebar({ onSelectConversation }) {
  const { currentUser, userLoading } = useCurrentUser();

  const sidebarRef = useRef(null); // THE ONE AND ONLY SIDEBAR
  const minWidthToOpenSidebar = useRef(0); // Minimum sidebar width where system makes it not thin
  const SIDEBAR_MIN_WIDTH = 197;
  const saveSidebarWidth = (width) => localStorage.setItem("sidebarWidth", width);
  const nameRef = useRef(null); // Ref for when username starts overflowing -> sidebar closes
  const isSidebarThin = useRef(false);
  const isDragging = useRef(false);

  const { conversations, convLoading, error } = useConversations();
  const messagesRef = useRef(null);
  const areChatsShown = useRef(false);
  const chatsArrowRef = useRef(null);
  useNotifications(conversations);

  const { conversationId } = useParams();
  const navigate = useNavigate();

  useEffect (() => {
    if (!sidebarRef.current) return;
    minWidthToOpenSidebar.current = sidebarRef.current.clientWidth; // Right now it has min-content
    const width = parseInt(localStorage.getItem("sidebarWidth"), 10);
    if (!isNaN(width)) sidebarRef.current.style.width = width + "px"; // Set previous sidebar width
    const username = nameRef.current;
    if (username && username.scrollWidth > username.clientWidth) sidebarRef.current.classList.add(styles.thin);

    window.addEventListener("resize", moveHandler);
    return () => {
      window.removeEventListener("resize", moveHandler);
      // document.removeEventListener("mousemove", moveHandler);
      // document.removeEventListener("mouseup", stopDrag);
    };
  }, []);

  // Functions for moving the sidebar

  const moveHandler = (e) => {
    if (!sidebarRef.current) return;
    const newWidth = e.clientX;

    const isOverflowing = (nameRef.current?.scrollWidth ?? 0) > (nameRef.current?.clientWidth ?? 0);
    const isTooNarrow = newWidth < SIDEBAR_MIN_WIDTH;

    if (!isSidebarThin.current && (isOverflowing || isTooNarrow)) {
      sidebarRef.current.classList.add(styles.thin);
      isSidebarThin.current = true;
    } else if (isSidebarThin.current && newWidth > minWidthToOpenSidebar.current) {
      sidebarRef.current.classList.remove(styles.thin);
      isSidebarThin.current = false;
    }

    if (isDragging.current) sidebarRef.current.style.width = newWidth + "px";
  };

  const startDrag = () => {
    if (isDragging.current) return;
    isDragging.current = true;
    document.documentElement.style.cursor = "grabbing";

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", stopDrag);
  };

  const stopDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    saveSidebarWidth(sidebarRef.current.clientWidth);

    document.documentElement.style.cursor = "default";
    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", stopDrag);
  };

  const dblClickHandler = () => {
    if (isSidebarThin.current) {
      sidebarRef.current.classList.remove(styles.thin);
      isSidebarThin.current = false;
      sidebarRef.current.style.width = minWidthToOpenSidebar.current + "px";
    } else {
      sidebarRef.current.classList.add(styles.thin);
      isSidebarThin.current = true;
    }
    
    saveSidebarWidth(sidebarRef.current.clientWidth);
  }

  // Functions for handling Chats

  const showChats = () => {
    messagesRef.current.classList.add(styles.show);
    chatsArrowRef.current.style.transform = "rotate(0deg)";
    areChatsShown.current = true;
  }

  const hideChats = () => {
    messagesRef.current.classList.remove(styles.show);
    chatsArrowRef.current.style.transform = "rotate(-90deg)";
    areChatsShown.current = false;
  }

  const changeStateOfChats = () => {if (areChatsShown.current) hideChats(); else showChats();}

  const handleConversationClick = (conversation) => {
    navigate(`/dashboard/messages/${conversation.id}`);
    
    if (onSelectConversation) {
      onSelectConversation(conversation);
    }
  };

  const isConversationActive = (conversation) => {
    if (!conversationId) return false;
    return conversation.id === conversationId;
  };

  return (
    <aside ref={sidebarRef} className={`${styles.sidebar} no-select`}>
      <div className={`${styles.profile} cursor-pointer`}>
        <img src={hashSymbol} alt="logo"/>
        <div>
          {userLoading ? (
            <h2>Ładowanie...</h2>
          ) : currentUser.displayName ? (
            <>
              <h2 ref={nameRef}>{currentUser.displayName}</h2>
              <h5>{currentUser.name}</h5>
            </>
          ) : (
            <h5>{currentUser.name}</h5>
          )}
        </div>
      </div>
      <nav>
        <div>
          <Link to="/dashboard/home" onClick={hideChats}>
            <img src={homeSymbol}/>
            <h4>home</h4>
          </Link>
          <Link to="/dashboard/friends" onClick={hideChats}>
            <img src={friendsSymbol}/>
            <h4>friends</h4>
          </Link>
          <div ref={messagesRef} onMouseEnter={showChats} className={styles.conversations}>
            <div onClick={changeStateOfChats}>
              <div>
                <img src={messagesSymbol}/>
                <h4>messages</h4>
              </div>
              <img ref={chatsArrowRef} src={arrowSymbol}/>
            </div>
            <div className={styles.userChats}>
              { convLoading ? (
                <div>
                  <div className={styles.spinner}/>
                  <h5>Ładowanie konwersacji...</h5>
                </div>
              ) : error ? (
                  <div>
                    <h5>Błąd: {error}</h5>
                  </div>
              ) : conversations.length === 0 ? (
                  <div>
                    <img src={userSymbol}/>
                    <h5>Brak konwersacji</h5>
                  </div>
              ) : (
                conversations.map((conversation) => (
                  <Link to={`messages/${conversation.id}`}
                    key={conversation.id}
                    className={isConversationActive(conversation) ? styles.active : ''}
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <img src={userSymbol}/>
                    <h5>{conversation.name}</h5>
                  </Link>
                ))
              )}
            </div>
          </div>
          <Link to="/dashboard/community" onClick={hideChats}>
            <img src={communitySymbol}/>
            <h4>community</h4>
          </Link>
        </div>
        <div>
          <Link to="/dashboard/notifications" onClick={hideChats}>
            <img src={bellSymbol}/>
            <h4>notifs</h4>
          </Link>
          <Link to="/dashboard/settings" onClick={hideChats}>
            <img src={settingsSymbol}/>
            <h4>settings</h4>
          </Link>
          <div className="logout" onClick={async () => await logout()}>
            <img src={exitSymbol} alt="logout"/>
            <h4>logout</h4>
          </div>
        </div>
      </nav>
      <div className={styles.grabTool} onMouseDown={startDrag} onDoubleClick={dblClickHandler}></div>
    </aside>
  )
}