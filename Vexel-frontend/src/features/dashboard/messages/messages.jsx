import styles from "./messages.module.scss";

import infoSymbol from "/src/assets/svg/info-circle.svg";

export default function Messages() {
    return (
        <section className={styles.messages}>
            <header>
                <h3 className="cursor-pointer">Nickname</h3>
                <img src={infoSymbol} className="cursor-pointer" alt="info"/>
            </header>
            <input type="text"/>
        </section>
    );
}