import styles from "./loader.module.scss";

export default function Loader() {

  return (
    <div className={styles.loader}>
      <div className={styles.spinner}></div>
      <h1>Loading...</h1>
    </div>
  );
}