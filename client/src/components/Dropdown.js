import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CheckIcon from "@mui/icons-material/Check";
import styles from "../styles/components/Dropdown.module.scss";

const Dropdown = ({
  label,
  optionMap,
  visibility,
  toggleVisibility,
  selected,
  className,
}) => {
  // create list of select elements from optionMap
  const selectElements = [];
  for (const [name, onClick] of Object.entries(optionMap)) {
    selectElements.push(
      <div id={name} key={name} role="option" onClick={onClick}>
        {selected === name && <CheckIcon fontSize="inherit" />}
        <p className={selected !== name ? styles.shiftRight : undefined}>
          {name}
        </p>
      </div>
    );
  }

  return (
    <div className={`${styles.dropdown} ${className ? className : ""}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded="true"
        onClick={toggleVisibility}
        className="btn btn-secondary"
      >
        {label}{" "}
        {visibility ? (
          <ArrowDropUpIcon fontSize="inherit" />
        ) : (
          <ArrowDropDownIcon fontSize="inherit" />
        )}
      </button>
      <div
        role="listbox"
        aria-activedescendant="date"
        tabIndex="-1"
        className={`${styles.options} ${visibility ? "" : "hidden"}`}
      >
        {selectElements}
      </div>
    </div>
  );
};

export default Dropdown;
