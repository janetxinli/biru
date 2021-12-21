import React from "react";
import Link from "next/link";
import { useAuth } from "../context/auth";
import styles from "../styles/components/NavBar.module.scss";

const NavBar = ({ handleLogout }) => {
  const { user } = useAuth();

  return (
    <nav className={`df df-ai-c ${styles.navBar}`}>
      <Link href={`/user/${user.username}`}>
        <a href={`/user/${user.username}`}>Profile</a>
      </Link>
      <Link href="/search">
        <a href="/search">Search</a>
      </Link>
      <button
        className="btn btn-secondary"
        onClick={handleLogout}
        type="button"
      >
        log out
      </button>
    </nav>
  );
};

export default NavBar;
