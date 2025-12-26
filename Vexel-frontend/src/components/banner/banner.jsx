import PropTypes from "prop-types";

import styles from "./banner.module.scss";

export default function Banner({bigText, message, buttons = null}) {

    let showButtons = null;
    if (buttons != null) {
        showButtons = (
            <div className={styles.buttons}>
                {buttons.map((button, index) => (
                    <button key={index}><h5>{button}</h5></button>
                ))}
            </div>
        );
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
                {showButtons}
            </fieldset>
        </section>
    );
}

Banner.propTypes = {
    bigText: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    buttons: PropTypes.arrayOf(PropTypes.string)
}