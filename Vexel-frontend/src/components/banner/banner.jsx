import PropTypes from "prop-types";

import styles from "./banner.module.scss";

export default function Banner({bigText, message, buttons = null, whatToDoOnClick}) {

    function showButtons() {
        if (buttons == null) {
            return
        }

        return (
            <div className={styles.buttons}>
                {buttons.map((button, index) => (
                    index == 0 ? (
                        <button key={index} className="cursor-pointer" onClick={() => whatToDoOnClick()}><h5>{button}</h5></button>
                    ) : (
                        <button key={index} className="cursor-pointer"><h5>{button}</h5></button>
                    )
                ))}
            </div>
        )
    }
    
    return (
        <section className={styles.banner}>
            <fieldset>
                <legend>banner</legend>
                <h1>
                    {bigText.split("\n").map((line, index) => (
                        <span key={index}>{line}<br/></span>
                    ))}
                </h1>
                <p>{message.split(". ").map((sentence, index) => (
                    <span key={index}>{sentence}<br/></span>
                ))}</p>
                {showButtons()}
            </fieldset>
        </section>
    );
}

Banner.propTypes = {
    bigText: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    buttons: PropTypes.arrayOf(PropTypes.string)
}