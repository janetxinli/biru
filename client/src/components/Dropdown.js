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
  let checkSelected;
  if (typeof selected === "string" || selected === null) {
    checkSelected = (value) => selected === value;
  } else {
    checkSelected = (value) => selected.includes(value);
  }

  // create list of select elements from optionMap
  const selectElements = [];
  for (const [name, onClick] of Object.entries(optionMap)) {
    const inSelected = checkSelected(name);
    selectElements.push(
      <div
        id={name}
        key={name}
        role="option"
        onClick={onClick}
        onKeyPress={onClick}
        tabIndex="0"
        aria-selected={inSelected}
      >
        {inSelected && <CheckIcon fontSize="inherit" />}
        <p className={!inSelected ? styles.shiftRight : ""}>{name}</p>
      </div>
    );
  }

  return (
    <div
      className={`${styles.dropdown} ${className !== undefined && className}`}
    >
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
