import React, { useState } from "react";
import BeerForm from "../../components/BeerForm";
import PageError from "../../components/PageError";
import { extractToken } from "../../utils/extractToken";
import { redirectToLogin } from "../../utils/serverSide";

const New = () => {
  const [error, setError] = useState(null);

  return (
    <>
      <h2>Add a New Beer</h2>
      {error && <PageError message={error} />}
      <BeerForm setError={setError} />
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  const token = extractToken(ctx);

  if (!token) {
    return redirectToLogin;
  }

  return {
    props: {
      loggedIn: true,
    },
  };
};

export default New;
