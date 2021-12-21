import React from "react";
import styles from "../styles/components/ProfileCard.module.scss";

const ProfileCard = ({ profile }) => {
  const { name, username, bio } = profile;
  const imgSrc = "/profilePicDefault.svg";

  return (
    <article className={`df ${styles.profileCard}`}>
      <img src={imgSrc} alt={`${name}'s avatar`} />
      <div className={styles.userInfo}>
        <h2>{name}</h2>
        <p className={styles.username}>{username}</p>
        {bio !== null && <p>{bio}</p>}
      </div>
    </article>
  );
};

export default ProfileCard;
