import React from "react";
import withAuth from "../hocs/withAuth";

const Home = () => <h2>Your feed</h2>;

export default withAuth(Home);
