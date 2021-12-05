import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../styles/components/PageError.module.scss";

const PageError = ({ message, className, closeError }) => {
  const handleClose = (e) => {
    e.preventDefault();
    closeError();
  };

  return (
    <div
      className={`df df-ai-c df-jc-sb ${className ? className : ""} ${
        styles.pageError
      }`}
    >
      <p>{message}</p>
      {closeError !== undefined && (
        <button
          className="btn btn-icon df df-ai-c df-jc-c"
          onClick={handleClose}
        >
          <CloseIcon className={styles.close} />
        </button>
      )}
    </div>
  );
};

export default PageError;
