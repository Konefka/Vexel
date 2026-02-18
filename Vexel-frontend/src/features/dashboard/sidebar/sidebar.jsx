import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./sidebar.module.scss";

import hashSymbol from "/src/assets/svg/hash.svg";
import homeSymbol from "/src/assets/svg/home.svg";
import friendsSymbol from "/src/assets/svg/friends.svg";
import messagesSymbol from "/src/assets/svg/messages.svg";
import communitySymbol from "/src/assets/svg/community.svg";
import bellSymbol from "/src/assets/svg/bell.svg";
import settingsSymbol from "/src/assets/svg/settings.svg";

export default function Sidebar() {
  const sidebarRef = useRef(null);
  const grabRef = useRef(null);
  const nameRef = useRef(null);
  const isDragging = useRef(false);
  const sidebarWidthToOpenNameRef = useRef(0);
  const SIDEBAR_MIN_WIDTH = 168.4;


  useEffect (() => {
    sidebarWidthToOpenNameRef.current = sidebarRef.current.clientWidth;
    const width = parseInt(localStorage.getItem("sidebarWidth"), 10) + "px";
    sidebarRef.current.style.width = width;
    if (nameRef.current.scrollWidth > nameRef.current.clientWidth) sidebarRef.current.classList.add(styles.thin);

    window.addEventListener("resize", moveHandler);
    return () => {
      window.removeEventListener("resize", moveHandler);
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, []);

  const moveHandler = (e) => {
    if (sidebarWidthToOpenNameRef.current === 0 && (nameRef.current.clientWidth < nameRef.current.scrollWidth || e.clientX < SIDEBAR_MIN_WIDTH)) {
      sidebarWidthToOpenNameRef.current = sidebarRef.current.clientWidth;
      sidebarRef.current.classList.add(styles.thin);
    } else if (sidebarWidthToOpenNameRef.current !== 0 && e.clientX > sidebarWidthToOpenNameRef.current) {
      sidebarWidthToOpenNameRef.current = 0;
      sidebarRef.current.classList.remove(styles.thin);
    }

    if (!isDragging.current) return;
    
    sidebarRef.current.style.width = e.clientX + "px";
    localStorage.setItem("sidebarWidth", e.clientX);
  };

  const startDrag = () => {
    isDragging.current = true;
    document.documentElement.style.cursor = "grabbing";
    grabRef.current.style.cursor = "grabbing";

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", stopDrag);
  };

  const stopDrag = () => {
    isDragging.current = false;
    document.documentElement.style.cursor = "default";
    grabRef.current.style.cursor = "grab";

    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", stopDrag);
  };

  const dblClickHandler = () => {
    if (sidebarRef.current.classList.contains(styles.thin)) {
      sidebarRef.current.classList.remove(styles.thin);
      sidebarRef.current.style.width = "fit-content";
      sidebarWidthToOpenNameRef.current = 0;
      localStorage.setItem("sidebarWidth", sidebarRef.current.clientWidth);
    } else {
      sidebarRef.current.style.width = "fit-content";
      sidebarWidthToOpenNameRef.current = sidebarRef.current.clientWidth;
      sidebarRef.current.classList.add(styles.thin);
      localStorage.setItem("sidebarWidth", sidebarRef.current.clientWidth);
    }
  }

  const navigate = useNavigate();

  return (
    <aside ref={sidebarRef} className={`${styles.sidebar} no-select`}>
      <div className={`${styles.profile} cursor-pointer`}>
        <img src={hashSymbol} alt="logo"/>
        <div>
          <h2 ref={nameRef}>Konefka</h2>
          <h5>Tymoteusz Konefał</h5>
        </div>
      </div>
      <nav>
        <div>
          <div onClick={() => navigate("home")}>
            <img src={homeSymbol}/>
            <h4>home</h4>
          </div>
          <div onClick={() => navigate("friends")}>
            <img src={friendsSymbol}/>
            <h4>friends</h4>
          </div>
          <div onClick={() => navigate("messages")}>
            <img src={messagesSymbol}/>
            <h4>messages</h4>
          </div>
          <div onClick={() => navigate("community")}>
            <img src={communitySymbol}/>
            <h4>community</h4>
          </div>
        </div>
        <div>
          <div onClick={() => navigate("notifications")}>
            <img src={bellSymbol}/>
            <h4>notifs</h4>
          </div>
          <div onClick={() => navigate("settings")}>
            <img src={settingsSymbol}/>
            <h4>settings</h4>
          </div>
        </div>
      </nav>
      <div ref={grabRef} className={styles.grabTool} onMouseDown={startDrag} onDoubleClick={dblClickHandler}></div>
    </aside>
  )
}