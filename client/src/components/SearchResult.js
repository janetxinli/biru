import React from "react";
import styles from "../styles/components/SearchResult.module.scss";

const SearchResult = ({ user }) => (
  <article className={styles.searchResult}>
    <h3>{user.name}</h3>
    <p>{user.username}</p>
  </article>
);

export default SearchResult;
