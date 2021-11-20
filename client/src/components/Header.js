import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { logout } from "../services/auth";
import styles from "../styles/components/Header.module.scss";

export default function Header({ loggedIn }) {
  const router = useRouter();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      router.push("/login");
    } catch (e) {
      console.log(e); // TODO: create global error handler
    }
  };

  return (
    <header className="container df df-ai-c df-jc-sb">
      <h1 className={styles.logo}>
        <Link href="/">biru</Link>
      </h1>
      {loggedIn && (
        <button className="btn btn-secondary" onClick={handleLogout}>
          log out
        </button>
      )}
    </header>
  );
}
