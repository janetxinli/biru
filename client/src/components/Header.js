import React from "react";
import Link from "next/link";
import styles from "../styles/components/Header.module.scss";

export default function Header() {
  return (
    <header className="container">
      <h1 className={styles.logo}>
        <Link href="/">biru</Link>
      </h1>
    </header>
  );
}
