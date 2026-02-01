import styles from "./sidebar.module.scss";

import hashSymbol from "/src/assets/svg/hash.svg";
import homeSymbol from "/src/assets/svg/home.svg";
import friendsSymbol from "/src/assets/svg/friends.svg";
import messagesSymbol from "/src/assets/svg/messages.svg";
import communitySymbol from "/src/assets/svg/community.svg";
import bellSymbol from "/src/assets/svg/bell.svg";
import settingsSymbol from "/src/assets/svg/settings.svg";

export default function Sidebar() {
  return (
    <section className={`${styles.sidebar} no-select`}>
      <div className={`${styles.profile} cursor-pointer`}>
        <img src={hashSymbol} alt="logo"/>
        <div>
          <h2>Konefka</h2>
          <h5>Tymoteusz Konefał</h5>
        </div>
      </div>
      <nav>
        <div>
          <h4 className="cursor-pointer"><img src={homeSymbol}/>home</h4>
          <h4 className="cursor-pointer"><img src={friendsSymbol}/>friends</h4>
          <h4 className="cursor-pointer"><img src={messagesSymbol}/>messages</h4>
          <h4 className="cursor-pointer"><img src={communitySymbol}/>community</h4>
        </div>
        <div>
          <h4 className="cursor-pointer"><img src={bellSymbol}/>notifications</h4>
          <h4 className="cursor-pointer"><img src={settingsSymbol}/>settings</h4>
        </div>
      </nav>
    </section>
  )
}