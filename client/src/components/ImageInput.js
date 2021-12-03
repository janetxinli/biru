import React from "react";
import styles from "../styles/components/ImageInput.module.scss";

const ImageInput = ({ label, handleChange, className, htmlFor, preview }) => {
  const imgSrc = preview ? preview : "/beerIconSquare.svg";
  return (
    <label
      className={`df df-fc df-ai-c df-jc-c ${styles.imageInput} ${
        className ? className : ""
      }`}
      htmlFor={htmlFor}
    >
      <img src={imgSrc} />
      <p className={styles.label}><span className="btn btn-primary">{label}</span></p>
      <input
        type="file"
        id={htmlFor}
        className={styles.imageInputHidden}
        onChange={handleChange}
        onClick={(e) => (e.target.value = null)}  // allow same file to be selected
        accept="image/png, image/jpeg"
      />
    </label>
  );
};

export default ImageInput;
