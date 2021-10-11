import React from "react";
import { Rating } from "@mui/material";
import { getBeerById } from "../../services/beer";
import styles from "../../styles/Beer.module.scss";

// TODO: find icons, fix style

export default function Beer({ beer }) {
  return (
    <article className={`df df-fc ${styles.beerCard}`}>
      <img src="/undraw_beer.svg" className={styles.beerImage} />
      <section className={styles.beerInfo}>
        <h2>{beer.name}</h2>
        <p className={styles.dateAdded}>added {new Date(Date.parse(beer.date)).toDateString()}</p>
        <div className={`df df-ai-c ${styles.rating}`}>
          <Rating
            name="beer-rating"
            value={parseFloat(beer.rating)}
            precision={0.5}
            readOnly
          />
          <p>{beer.rating}</p>
        </div>
        <div className={styles.beerDetails}>
          <p>brewed by: {beer.brewer}</p>
          <p>type: {beer.beer_type}</p>
          <p>serving: {beer.serving_type}</p>
          <p>ABV: {beer.abv}%</p>
          {beer.ibu && <p>IBU: {beer.ibu}</p>}
          {beer.notes && (
            <div>
              <p className={styles.beerNotesTitle}>notes:</p>
              <p>{beer.notes}</p>
            </div>
          )}
        </div>
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
