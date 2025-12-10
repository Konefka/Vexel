import styles from './header.module.css'
// import { Component as Icon } from '../../assets/svg/github-mark-white.svg';

export default function Header() {
    return (
        <>
            <header className={styles.header}>
                <h4>Vexel</h4>
                <div>
                    <p>About</p>
                    <p>FAQ</p>
                </div>
                {/* <div>{Icon}</div> */}
            </header>
            <hr/>
        </>
    );
}