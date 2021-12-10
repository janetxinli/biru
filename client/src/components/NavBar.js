import React from "react";

const NavBar = ({ handleLogout }) => (
  <nav>
    <button className="btn btn-secondary" onClick={handleLogout} type="button">
      log out
    </button>
  </nav>
);

export default NavBar;
