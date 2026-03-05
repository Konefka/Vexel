import styles from "./loader.module.scss";

export default function Loader() {

  return (
    <div className={styles.loader}>
      <div className={styles.spinner}/>
      <h1>Loading...</h1>
    </div>
  );
}