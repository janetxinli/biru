import React, { useState } from "react";
import { useRouter } from "next/router";
import { GiHops } from "react-icons/gi";
import { IoBeerOutline } from "react-icons/io5";
import { getBeerById, deleteBeer } from "../../services/beer";
import { capitalize } from "../../utils/capitalize";
import PageError from "../../components/PageError";
import styles from "../../styles/pages/Beer.module.scss";
import { extractToken } from "../../utils/extractToken";
import { notFound, redirectToLogin } from "../../utils/serverSide";

const Beer = ({ beer }) => {
  const router = useRouter();

  const [error, setError] = useState(null);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteBeer(beer.id);
      router.push("/");
    } catch (e) {
      setError("Oops, an error occurred. Please try again.");
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    router.push(`/beer/edit/${beer.id}`);
  };

  return (
    <>
      {error && <PageError message={error} closeError={() => setError(null)} />}
      <article className={`df df-fc ${styles.beerCard}`}>
        <section className={`df df-ai-fe ${styles.beerHeader}`}>
          <img src="/undraw_beer.svg" />
          <section className="df df-fc">
            <h2>{beer.name}</h2>
            <p className={styles.brewer}>{beer.brewer}</p>
            <p>Added {new Date(Date.parse(beer.date)).toDateString()}</p>
          </section>
        </section>
        {beer.notes && <p className={styles.notes}>{beer.notes}</p>}
        <section className={`df df-jc-c ${styles.beerStats}`}>
          <article className={`df df-fc df-ai-c ${styles.stat}`}>
            <p className={styles.statName}>rating</p>
            <p className={styles.statValue}>{beer.rating}/5</p>
          </article>
          <article className={`df df-fc df-ai-c ${styles.stat}`}>
            <p className={styles.statName}>ABV</p>
            <p className={styles.statValue}>
              {beer.abv ? `${beer.abv}%` : "N/A"}
            </p>
          </article>
          <article className={`df df-fc df-ai-c ${styles.stat}`}>
            <p className={styles.statName}>IBU</p>
            <p className={styles.statValue}>{beer.ibu ? beer.ibu : "N/A"}</p>
          </article>
        </section>
        <section className={`df df-fc ${styles.beerInfo}`}>
          <article className="df df-ai-c">
            <GiHops className={styles.beerInfoIcon} />
            <p>
              Beer Type: {beer.beerType ? capitalize(beer.beerType) : "N/A"}
            </p>
          </article>
          <article className="df df-ai-c">
            <IoBeerOutline className={styles.beerInfoIcon} />
            <p>
              Serving: {beer.servingType ? capitalize(beer.servingType) : "N/A"}
            </p>
          </article>
        </section>
        <section className={`df ${styles.btnGroup}`}>
          <button
            type="submit"
            className="btn btn-secondary"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleDelete}
          >
            Delete
          </button>
        </section>
      </article>
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  const token = extractToken(ctx);

  if (!token) {
    return redirectToLogin;
  }

  try {
    const res = await getBeerById(ctx.params.id, token);

    return {
      props: {
        beer: res.data.payload,
        loggedIn: true,
      },
    };
  } catch (error) {
    return notFound;
  }
};

export default Beer;
