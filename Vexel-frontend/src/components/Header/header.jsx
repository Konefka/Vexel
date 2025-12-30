import PropTypes from "prop-types";

import styles from "./header.module.scss";
import githubIcon from "/src/assets/svg/github-mark-white.svg";

export default function Header ({nav = [], buttonText, onButtonClick}) {
  return (
    <header>
      <div>
        <a href="/home" className={styles.logo}><h2 className="cursor-pointer">Vexel</h2></a>
        <nav>
          {nav.map((navHeader, index) => (
            <a href={`/${navHeader.toLowerCase()}`} className="cursor-pointer" key={index}>{navHeader}</a>
          ))}
        </nav>
      </div>
      <div>
        <button type="button" className="cursor-pointer" onClick={() => onButtonClick()}><h6>{buttonText}</h6></button>
        <abbr data-tooltip="github" aria-label="github">
          <a href="https://github.com/Konefka/Vexel" target="_blank" rel="noopener noreferrer">
            <img className={`${styles.githubLogo} cursor-pointer`} src={githubIcon} alt="icon"/>
          </a>
        </abbr>
      </div>
    </header>
  );
}

Header.propTypes = {
  nav: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonText: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired
}