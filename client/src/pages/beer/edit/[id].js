import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getBeerById } from "../../../services/beer";
import { getFormattedDate } from "../../../utils/getFormattedDate";
import BeerForm from "../../../components/BeerForm";
import PageError from "../../../components/PageError";
import withAuth from "../../../hocs/withAuth";

const EditBeer = () => {
  const router = useRouter();

  const [beer, setBeer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);

    const loadBeer = async () => {
      const { id } = router.query;

      try {
        const res = await getBeerById(id);

        for (const [k, v] of Object.entries(res.data.payload)) {
          if (v === null) {
            res.data.payload[k] = "";
          }
        }
        setBeer({
          ...res.data.payload,
          date: getFormattedDate(res.data.payload.date), // make date conform to input format
        });
      } catch (e) {
        if (e.response.status === 404) {
          router.push("/404");
        }

        setError("Cannot get beer details right now.");
      }
    };

    loadBeer();
  }, []);

  if (!beer) return <p>Loading...</p>;

  return (
    <>
      <h2>Edit Beer</h2>
      {error && <PageError message={error} closeError={() => setError(null)} />}
      <BeerForm editMode formValues={beer} setError={setError} />
    </>
  );
};

export default withAuth(EditBeer);
