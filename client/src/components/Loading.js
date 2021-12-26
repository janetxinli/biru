import React from "react";
import styles from "../styles/components/Loading.module.scss";

const Loading = ({ className }) => (
  <p
    className={`${styles.loading} ${
      className !== undefined ? className : null
    }`}
  >
    Loading
  </p>
);

export default Loading;
