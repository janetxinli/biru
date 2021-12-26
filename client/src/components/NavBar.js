import React from "react";
import Link from "next/link";
import { useAuth } from "../context/auth";
import styles from "../styles/components/NavBar.module.scss";

const NavBar = ({ handleLogout }) => {
  const { user } = useAuth();

  return (
    <nav className={`df df-ai-c ${styles.navBar}`}>
      <Link href="/beer/new">
        <a href="/beer/new">Add Beer</a>
      </Link>
      <Link href={`/user/${user.username}`}>
        <a href={`/user/${user.username}`}>Profile</a>
      </Link>
      <Link href="/search">
        <a href="/search">Search</a>
      </Link>
      <button className="btn btn-text" onClick={handleLogout} type="button">
        Log Out
      </button>
    </nav>
  );
};

export default NavBar;
