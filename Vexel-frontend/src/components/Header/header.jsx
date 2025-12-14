import { useState } from "react";
import Cover from "../cover/cover.jsx";

import styles from "./header.module.css";
import githubIcon from "/src/assets/svg/github-mark-white.svg";

export default function Header() {
    const [active, setActive] = useState(false);

    return (
        <>
            <header className={styles.header}>
                <div>
                    <a href=""><h2 className="cursor-pointer">Vexel</h2></a>
                    <p className="cursor-pointer">Product</p>
                    <p className="cursor-pointer">About</p>
                    <p className="cursor-pointer">FAQ</p>
                </div>
                <div>
                    <button className="cursor-pointer" onClick={() => setActive(true)}><h6>Login</h6></button>
                    <a href="https://github.com/Konefka/Vexel" target="_blank" rel="noopener noreferrer">
                        <img className={`${styles.githubLogo} cursor-pointer`} src={githubIcon} alt="icon"/>
                    </a>
                </div>
            </header>
            <Cover active={active} onClose={() => setActive(false)}/>
        </>
        
    );
}