import React from "react";
import { GiHops } from "react-icons/gi";
import { IoBeerOutline } from "react-icons/io5";
import { getBeerById } from "../../services/beer";
import { capitalize } from "../../utils/capitalize";
import styles from "../../styles/pages/Beer.module.scss";

export default function Beer({ beer }) {
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
          <p>Beer Type: {capitalize(beer.beer_type)}</p>
        </article>
        <article className="df df-ai-c">
          <IoBeerOutline className={styles.beerInfoIcon} />
          <p>Serving: {capitalize(beer.serving_type)}</p>
        </article>
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
