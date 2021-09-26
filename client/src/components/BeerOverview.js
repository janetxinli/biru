import React from "react";
import { Rating } from "@mui/material";
import styles from "../styles/BeerOverview.module.scss";

export default function BeerOverview({ beer }) {
  return (
    <article className={`df df-jc-sb df-ai-c ${styles.beerOverview}`}>
      <span className={`df df-fc ${styles.beerInfo}`}>
        <h3>{beer.name}</h3>
        <p>{beer.brewer}</p>
        <p className={styles.dateAdded}>{beer.added}</p>
        <Rating
          name="beer-rating"
          value={parseInt(beer.rating)}
          readOnly
          precision={0.5}
          size="small"
          className={styles.rating}
        />
      </span>
      <img src="./undraw_beer.svg" className={styles.beerImage} />
    </article>
  );
}
