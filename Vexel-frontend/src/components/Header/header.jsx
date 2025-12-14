import { useState } from "react";
import Cover from "../cover/cover.jsx";

import styles from "./header.module.scss";
import githubIcon from "/src/assets/svg/github-mark-white.svg";
import Login from "/src/features/auth/Login.jsx";
import Register from "/src/features/auth/Register.jsx";

export default function Header() {
    const [active, setActive] = useState(false);
    const [card, setCard] = useState(0);

    const cards = [<Login register={() => setCard(1)}/>, <Register login={() => setCard(0)}/>];

    return (
        <>
            <header>
                <div>
                    <a href="" className={styles.logo}><h2 className="cursor-pointer">Vexel</h2></a>
                    <nav>
                        <p className="cursor-pointer">Product</p>
                        <p className="cursor-pointer">About</p>
                        <p className="cursor-pointer">FAQ</p>
                    </nav>
                </div>
                <div>
                    <button className="cursor-pointer" onClick={() => setActive(true)}><h6>Login</h6></button>
                    <a href="https://github.com/Konefka/Vexel" target="_blank" rel="noopener noreferrer">
                        <img className={`${styles.githubLogo} cursor-pointer`} src={githubIcon} alt="icon"/>
                    </a>
                </div>
            </header>
            <Cover active={active} onClose={() => setActive(false)} show={cards[card]}/>
        </>
    );
}