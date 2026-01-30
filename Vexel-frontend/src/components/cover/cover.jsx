import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import styles from "./cover.module.scss";
import xSymbol from "/src/assets/svg/x-symbol-white.svg";

export default function Cover ({ active = false, onClose, show, isModalOn }) {
  const coverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (active && coverRef.current && !coverRef.current.contains(e.target)) {
        onClose();
      }
    }

    if (active && !isModalOn) {
      console.log("add");
      document.addEventListener("mouseup", handleClickOutside);
      console.log("add scroll")
      document.documentElement.classList.add("no-scroll");
    }

    return () => {
      if (active && !isModalOn) {
        console.log("del");
        document.removeEventListener("mouseup", handleClickOutside);
        console.log("del scroll")
        document.documentElement.classList.remove("no-scroll");
      }
    };
  }, [active, isModalOn]);
  
  return (
    <section ref={coverRef} className={`${styles.cover} ${active ? styles.active : ""}`}>
      <img src={xSymbol} onClick={onClose} alt="return button" className="image cursor-pointer"/>
      {show != null ? show : <div><h1>Witaj w Cover!</h1><p>Ten panel wysuwa się płynnie po kliknięciu przycisku.</p></div>}
      <div className="linked-text">Reset Password</div>
    </section>
  );
}

Cover.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.element.isRequired
};