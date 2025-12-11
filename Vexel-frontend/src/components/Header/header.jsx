import styles from "./header.module.css";
import githubIcon from "/src/assets/svg/github-mark-white.svg";

export default function Header() {
    return (
        <>
            <header className={styles.header}>
                <div>
                    <a href=""><h1 className="cursor-pointer">Vexel</h1></a>
                    <p className="cursor-pointer">Product</p>
                    <p className="cursor-pointer">About</p>
                    <p className="cursor-pointer">FAQ</p>
                </div>
                <div>
                    <button className="cursor-pointer"><h6>Register</h6></button>
                    <a href="https://github.com/Konefka/Vexel" target="_blank" rel="noopener noreferrer">
                        <img className={styles.githubLogo + " cursor-pointer"} src={githubIcon} alt="icon"/>
                    </a>
                </div>
            </header>
        </>
    );
}