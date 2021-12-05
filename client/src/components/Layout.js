import React from "react";
import Header from "./Header";

const Layout = ({ loggedIn, children }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <main className="container">{children}</main>
    </>
  );
};

export default Layout;
