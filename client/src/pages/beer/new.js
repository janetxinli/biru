import React, { useState } from "react";
import BeerForm from "../../components/BeerForm";
import PageError from "../../components/PageError";

export default function New() {
  const [error, setError] = useState(null);

  return (
    <>
      <h2>Add a New Beer</h2>
      {error && <PageError message={error} />}
      <BeerForm setError={setError} />
    </>
  );
}
