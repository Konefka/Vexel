import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import styles from "./modal.module.scss";
import xSymbol from "/src/assets/svg/x-symbol-black.svg";

export default function Modal ({ active = false, onClose, message }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (active && modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    
    if (active) {
      document.addEventListener("mouseup", handleClickOutside);
      document.documentElement.classList.add("no-scroll");
    }
    
    return () => {
      if (active) {
        document.removeEventListener("mouseup", handleClickOutside);
        document.documentElement.classList.remove("no-scroll");
      }
    };
  }, [active]);

  return (
    <section className={`${styles.modalWrapper} ${active ? styles.active : ""}`}>
      <div ref={modalRef} className={styles.modal}>
        <div>
          <h1>ERROR:</h1>
          <img src={xSymbol} onClick={onClose} alt="return button" className="image cursor-pointer"/>
        </div>
        <p>{message}</p>
      </div>
    </section>
  );
}

Modal.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired
}