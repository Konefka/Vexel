import styles from "./header.module.scss";
import githubIcon from "/src/assets/svg/github-mark-white.svg";

export default function Header({openAuth}) {
    return (
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
                <button type="button" className="cursor-pointer" onClick={() => openAuth()}><h6>Login</h6></button>
                <abbr data-tooltip="github" aria-label="github">
                    <a href="https://github.com/Konefka/Vexel" target="_blank" rel="noopener noreferrer">
                        <img className={`${styles.githubLogo} cursor-pointer`} src={githubIcon} alt="icon"/>
                    </a>
                </abbr>
            </div>
        </header>
    );
}