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
  errorMessage,
  children,
  ...rest
}) => (
  <label
    htmlFor={htmlFor}
    className={`${styles.input} ${className !== undefined && className} ${
      errorMessage !== undefined && errorMessage !== null
        ? styles.formError
        : null
    }`}
  >
    <p className="df df-jc-sb df-ai-c">
      {label}
      {infoLabel !== undefined && (
        <span className={styles.inputInfo}>{infoLabel}</span>
      )}
    </p>
    {children || (
      <input
        id={htmlFor}
        type={type}
        value={value}
        onChange={handleChange}
        {...rest} // maxLength, etc.
      />
    )}
    {errorMessage && (
      <p className={errorMessage !== null ? styles.formErrorLabel : "hidden"}>
        {errorMessage}
      </p>
    )}
  </label>
);

export default Input;
