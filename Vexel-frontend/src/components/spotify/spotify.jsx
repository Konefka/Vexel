import styles from "./spotify.module.scss";

export default function Spotify({link}) {
    
  return (
    <iframe
      className={styles.spotify}
      data-testid="embed-iframe"
      src={link.toString()}
      loading="lazy"
      frameBorder="0"
    />
  )
}