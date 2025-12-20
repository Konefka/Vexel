import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import styles from "./modal.module.scss";
import xSymbol from "/src/assets/svg/x-symbol-black.svg";

export default function Modal({active = false, onClose, message}) {
    const coverRef = useRef(null);

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

    return (
        <section className={`${styles.modal} ${active ? styles.active : ""}`}>
            <div ref={coverRef}>
                <div>
                    <h1>ERROR:</h1>
                    <img src={xSymbol} onClick={onClose} alt="return button" className="image cursor-pointer"/>
                </div>
                <p>{message}</p>
            </div>
        </section>
    )
}

Modal.propTypes = {
    active: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired
}