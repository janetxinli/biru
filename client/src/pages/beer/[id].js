import React from "react";
import { Rating } from "@mui/material";
import styles from "../../styles/Beer.module.scss";

// TODO: find icons

export default function Beer({ beer }) {
  return (
    <article className={`df df-fc ${styles.beerCard}`}>
      <img src="/undraw_beer.svg" className={styles.beerImage} />
      <section className={styles.beerInfo}>
        <h2>{beer.name}</h2>
        <p className={styles.dateAdded}>Added {beer.added}</p>
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
          <p>Brewed by {beer.brewer}</p>
          <p>Type: {beer.beerType}</p>
          <p>Serving: {beer.servingType}</p>
          <p>ABV: {beer.abv}%</p>
          {beer.ibu && <p>IBU: {beer.ibu}</p>}
          {beer.notes && (
            <div>
              <p className={styles.beerNotesTitle}>Notes:</p>
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
  const res = await await fetch("http://localhost:3000/data.json");
  const data = await res.json();
  const beer = data.beers.find((b) => b.id === parseInt(id));
  if (!beer) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      beer,
    },
  };
}
