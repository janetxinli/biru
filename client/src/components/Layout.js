import React from "react";
import Header from "./Header";

export default function Layout({ loggedIn, children }) {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <main className="container">{children}</main>
    </>
  );
}
