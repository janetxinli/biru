import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { logout } from "../services/auth";
import { useAuth } from "../context/auth";
import PageError from "./PageError";
import styles from "../styles/components/Header.module.scss";

const Header = () => {
  const { authenticated, user, logoutUser } = useAuth();
  const router = useRouter();

  const [error, setError] = useState(null);

  const handleLogout = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await logout();
      logoutUser();
      router.push("/login");
    } catch (e) {
      setError("Unable to log out. Please try again.");
    }
  };

  return (
    <>
      <header className="container df df-ai-c df-jc-sb">
        <h1 className={styles.logo}>
          <Link href="/">biru</Link>
        </h1>
        {authenticated && (
          <button className="btn btn-secondary" onClick={handleLogout}>
            log out
          </button>
        )}
      </header>
      {error !== null && (
        <PageError
          className="container"
          message={error}
          closeError={() => setError(null)}
        />
      )}
    </>
  );
};

export default Header;
