import React, { useState } from "react";
import { getBeerById } from "../../../services/beer";
import { getFormattedDate } from "../../../utils/getFormattedDate";
import BeerForm from "../../../components/BeerForm";
import PageError from "../../../components/PageError";
import { extractToken } from "../../../utils/extractToken";
import { notFound, redirectToLogin } from "../../../utils/serverSide";

const EditBeer = ({ beer }) => {
  const [error, setError] = useState(null);

  return (
    <>
      <h2>Edit Beer</h2>
      {error && <PageError message={error} closeError={() => setError(null)} />}
      <BeerForm editMode formValues={beer} setError={setError} />
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  const token = extractToken(ctx);

  if (!token) {
    return redirectToLogin;
  }

  try {
    const {
      data: { payload },
    } = await getBeerById(ctx.params.id, token);

    // convert null values to empty strings
    for (const [k, v] of Object.entries(payload)) {
      if (v === null) {
        payload[k] = "";
      }
    }

    return {
      props: {
        beer: {
          ...payload,
          date: getFormattedDate(payload.date), // make date conform to input format
        },
        loggedIn: true,
      },
    };
  } catch (error) {
    return notFound;
  }
};

export default EditBeer;
