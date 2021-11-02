import React, { useState } from "react";
import { getBeerById } from "../../../services/beer";
import { getFormattedDate } from "../../../utils/getFormattedDate";
import BeerForm from "../../../components/BeerForm";
import PageError from "../../../components/PageError";

export default function EditBeer({ beer }) {
  const [error, setError] = useState(null);
  return (
    <>
      <h2>Edit Beer</h2>
      {error && <PageError message={error} />}
      <BeerForm editMode formValues={beer} setError={setError} />
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { id } = ctx.params;
  const res = await getBeerById(id);
  if (!res.data.payload) {
    return {
      notFound: true,
    };
  }

  // convert null valuess to empty strings
  for (const [k, v] of Object.entries(res.data.payload)) {
    if (v === null) {
      res.data.payload[k] = "";
    }
  }

  return {
    props: {
      beer: {
        ...res.data.payload,
        date: getFormattedDate(res.data.payload.date),
      },
    },
  };
}
