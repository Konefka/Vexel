import styles from "./dashboard.module.scss";

export default function Dashboard({children}) {
  return <section className={styles.dashboard}>{children}</section>
}