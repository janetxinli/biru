import React from "react";
import styles from "../styles/components/Input.module.scss";

const Input = ({
  type,
  label,
  className,
  htmlFor,
  value,
  handleChange,
  infoLabel,
  error,
  errorMessage,
  children,
  ...rest
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`${styles.input} ${className} ${error ? styles.formError : ""}`}
    >
      <p className="df df-jc-sb df-ai-c">
        {label}
        {infoLabel !== undefined && (
          <span className={styles.inputInfo}>{infoLabel}</span>
        )}
      </p>
      {children ? (
        children
      ) : (
        <input
          id={htmlFor}
          type={type}
          value={value}
          onChange={handleChange}
          {...rest} // maxLength, etc.
        />
      )}
      {error && (
        <p className={error ? styles.formErrorLabel : "hidden"}>
          {errorMessage}
        </p>
      )}
    </label>
  );
};

export default Input;
