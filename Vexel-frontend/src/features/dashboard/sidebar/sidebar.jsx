import { useEffect, useRef, useState } from "react";
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

  useEffect (() => {
    const width = (parseInt(localStorage.getItem("sidebarWidth"), 10) + "px") || "fit-content";
    sidebarRef.current.style.width = width;
    if (nameRef.current.scrollWidth > nameRef.current.clientWidth) sidebarRef.current.classList.add(styles.thin);

    return () => {
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, []);

  const moveHandler = (e) => {

    const availableWidth = e.clientX - nameRef.current.getBoundingClientRect().left;

    if (nameRef.current.scrollWidth >= availableWidth) {
      sidebarRef.current.classList.add(styles.thin);
    } else {
      sidebarRef.current.classList.remove(styles.thin);
    }

    if (!isDragging.current) return;
    
    sidebarRef.current.style.width = e.clientX + "px";
    localStorage.setItem("sidebarWidth", e.clientX);
  };

  const startDrag = () => {
    isDragging.current = true;
    grabRef.current.style.cursor = "grabbing";

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", stopDrag);
  };

  const stopDrag = () => {
    isDragging.current = false;
    grabRef.current.style.cursor = "grab";

    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", stopDrag);
  };

  return (
    <section ref={sidebarRef} className={`${styles.sidebar} no-select`}>
      <div className={`${styles.profile} cursor-pointer`}>
        <img src={hashSymbol} alt="logo"/>
        <div>
          <h2 ref={nameRef}>Konefka</h2>
          <h5>Tymoteusz Konefał</h5>
        </div>
      </div>
      <nav>
        <div>
          <div>
            <img src={homeSymbol}/>
            <h4 className="cursor-pointer">home</h4>
          </div>
          <div>
            <img src={friendsSymbol}/>
            <h4 className="cursor-pointer">friends</h4>
          </div>
          <div>
            <img src={messagesSymbol}/>
            <h4 className="cursor-pointer">messages</h4>
          </div>
          <div>
            <img src={communitySymbol}/>
            <h4 className="cursor-pointer">community</h4>
          </div>
        </div>
        <div>
          <div>
            <img src={bellSymbol}/>
            <h4 className="cursor-pointer">notifications</h4>
          </div>
          <div>
            <img src={settingsSymbol}/>
            <h4 className="cursor-pointer">settings</h4>
          </div>
        </div>
      </nav>
      <div ref={grabRef} className={styles.grabTool} onMouseDown={startDrag}></div>
    </section>
  )
}