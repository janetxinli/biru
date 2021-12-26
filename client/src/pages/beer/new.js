import React, { useState } from "react";
import BeerForm from "../../components/BeerForm";
import PageError from "../../components/PageError";
import withAuth from "../../hocs/withAuth";

const New = () => {
  const [error, setError] = useState(null);

  return (
    <>
      <h2 className="text-center">Add a New Beer</h2>
      {error && <PageError message={error} closeError={() => setError(null)} />}
      <BeerForm setError={setError} />
    </>
  );
};

export default withAuth(New);
