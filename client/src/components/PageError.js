import React from "react";
import styles from "../styles/components/PageError.module.scss";

// TODO: add "hide" button

const PageError = ({ message }) => {
  return (
    <div className={styles.pageError}>
      <p>{message}</p>
    </div>
  );
};

export default PageError;
