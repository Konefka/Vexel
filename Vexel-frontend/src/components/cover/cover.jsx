import { act, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import styles from "./cover.module.scss";
import xSymbol from "/src/assets/svg/x-symbol-white.svg";

export default function Cover ({ active = false, onClose, show }) {
    const coverRef = useRef(null);

    useEffect(() => {
        if (active) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [active]);
    
    useEffect(() => {
        function handleClickOutside(e) {
            if (coverRef.current && !coverRef.current.contains(e.target)) {
                onClose();
            }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    // <div><h1>Witaj w Cover!</h1><p>Ten panel wysuwa się płynnie po kliknięciu przycisku.</p></div>
    
    return (
        <section ref={coverRef} className={`${styles.cover} ${active ? styles.active : ""}`}>
            <img src={xSymbol} onClick={onClose} alt="return button" styles="cursor-pointer"/>
            {show}
        </section>
    );
}

Cover.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};