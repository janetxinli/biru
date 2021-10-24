import React from "react";
import styles from "../styles/components/PageError.module.scss";

// TODO: reorganize styles directory

export default function PageError({ message }) {
  return (
    <div className={styles.pageError}>
      <p>{message}</p>
    </div>
  );
}
