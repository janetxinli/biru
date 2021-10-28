import React from "react";
import { useRouter } from "next/router";
import { GiHops } from "react-icons/gi";
import { IoBeerOutline } from "react-icons/io5";
import { getBeerById, deleteBeer } from "../../services/beer";
import { capitalize } from "../../utils/capitalize";
import styles from "../../styles/pages/Beer.module.scss";

export default function Beer({ beer }) {
  const router = useRouter();

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteBeer(beer.id);
      router.push("/");
    } catch (e) {
      console.log(e); // TODO: create error banner
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    router.push(`/beer/edit/${beer.id}`);
  };

  return (
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
            Beer Type: {beer.beer_type ? capitalize(beer.beer_type) : "N/A"}
          </p>
        </article>
        <article className="df df-ai-c">
          <IoBeerOutline className={styles.beerInfoIcon} />
          <p>
            Serving: {beer.serving_type ? capitalize(beer.serving_type) : "N/A"}
          </p>
        </article>
      </section>
      <section className={`df df-jc-fe ${styles.btnGroup}`}>
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

  return {
    props: {
      beer: res.data.payload,
    },
  };
}
