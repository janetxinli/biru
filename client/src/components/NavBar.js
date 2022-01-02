import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/auth";
import styles from "../styles/components/NavBar.module.scss";

const NavBar = ({ handleLogout }) => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <nav className={`df df-ai-c ${styles.navBar}`}>
      <Link href="/beer/new">
        <a
          href="/beer/new"
          className={router.asPath === "/beer/new" ? styles.current : null}
        >
          Add Beer
        </a>
      </Link>
      <Link href={`/user/${user.username}`}>
        <a
          href={`/user/${user.username}`}
          className={
            router.asPath === `/user/${user.username}` ? styles.current : null
          }
        >
          Profile
        </a>
      </Link>
      <Link href="/search">
        <a
          href="/search"
          className={router.asPath === "/search" ? styles.current : null}
        >
          Search
        </a>
      </Link>
      <button className="btn btn-text" onClick={handleLogout} type="button">
        Log Out
      </button>
    </nav>
  );
};

export default NavBar;
