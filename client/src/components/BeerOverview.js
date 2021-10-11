import React from "react";
import Link from "next/link";
import { Rating } from "@mui/material";
import styles from "../styles/BeerOverview.module.scss";

export default function BeerOverview({ beer }) {
  return (
    <article className={styles.beerOverview}>
      <Link href={`/beer/${beer.id}`}>
        <a className="df df-jc-sb df-ai-c">
          <span className={`df df-fc ${styles.beerInfo}`}>
            <h3>{beer.name}</h3>
            <p>{beer.brewer}</p>
            <p className={styles.dateAdded}>{new Date(Date.parse(beer.date)).toDateString()}</p>
            <Rating
              name="beer-rating"
              value={parseFloat(beer.rating)}
              readOnly
              precision={0.5}
              size="small"
              className={styles.rating}
            />
          </span>
          <img src="/undraw_beer.svg" className={styles.beerImage} />
        </a>
      </Link>
    </article>
  );
}
