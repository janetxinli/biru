import React from "react";
import Link from "next/link";
import styles from "../styles/components/SearchResult.module.scss";

const SearchResult = ({ user }) => (
  <article className={styles.searchResult}>
    <Link href={`/user/${user.username}`}>
      <a href={`/user/${user.username}`}>
        <h3>{user.name}</h3>
        <p>{user.username}</p>
      </a>
    </Link>
  </article>
);

export default SearchResult;
