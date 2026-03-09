import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import styles from "./cover.module.scss";
import xSymbol from "/src/assets/svg/x-symbol-white.svg";

export default function Cover ({ active = false, onClose, show, isModalOn, resetFocus }) {
  const coverRef = useRef(null);
  const clickedOnCover = useRef(false);

  useEffect(() => {
    function handleMouseUp(e) {
      if (active && coverRef.current && !coverRef.current.contains(e.target) && !clickedOnCover.current) {
        onClose();
      }
      clickedOnCover.current = false;
    }

    function handleClickOnCover(e) {
      if (active && coverRef.current && coverRef.current.contains(e.target)) {
        clickedOnCover.current = true;
      }
    }

    if (active && !isModalOn) {
      document.addEventListener("mousedown", handleClickOnCover);
      document.addEventListener("mouseup", handleMouseUp);
      document.documentElement.classList.add("no-scroll");
      resetFocus();
    }

    return () => {
      if (active && !isModalOn) {
        document.removeEventListener("mousedown", handleClickOnCover);
        document.removeEventListener("mouseup", handleMouseUp);
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