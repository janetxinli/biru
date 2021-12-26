import React from "react";
import Link from "next/link";
import styles from "../styles/components/UserOverview.module.scss";

const UserOverview = ({ user }) => (
  <article className={styles.userOverview}>
    <Link href={`/user/${user.username}`}>
      <a href={`/user/${user.username}`}>
        <h3>{user.name}</h3>
        <p>{user.username}</p>
      </a>
    </Link>
  </article>
);

export default UserOverview;
