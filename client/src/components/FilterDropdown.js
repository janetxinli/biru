import React, { useState } from "react";

// TODO: add styles; make options display absolute
// TODO: show what option is selected
export default function FilterDropdown({ label, optionMap }) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = (e) => {
    e.preventDefault();
    setVisible(!visible);
  };

  // create list of select elements from optionMap
  const selectElements = [];
  for (const [name, onClick] of Object.entries(optionMap)) {
    selectElements.push(
      <div id={name} key={name} role="option" onClick={onClick}>
        {name}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded="true"
        onClick={toggleVisibility}
      >
        {label}
      </button>
      <div
        role="listbox"
        aria-activedescendant="date"
        tabIndex="-1"
        className={visible ? "" : "hidden"}
      >
        {selectElements}
      </div>
    </div>
  );
}
