import React from "react";
import Link from "next/link";
import { Rating } from "@mui/material";
import styles from "../styles/components/BeerOverview.module.scss";

const BeerOverview = ({ beer }) => {
  const imgSrc = beer.imageUrl ? beer.imageUrl : "/beerIconSquare.svg";

  return (
    <article className={styles.beerOverview}>
      <Link href={`/beer/${beer.id}`}>
        <a className="df df-jc-sb df-ai-c">
          <span className={`df df-fc ${styles.beerInfo}`}>
            <h3>{beer.name}</h3>
            <p>{beer.brewer}</p>
            <p className={styles.dateAdded}>
              {new Date(Date.parse(beer.date)).toDateString()}
            </p>
            <Rating
              name="beer-rating"
              value={parseFloat(beer.rating)}
              readOnly
              precision={0.5}
              size="small"
              className={styles.rating}
            />
          </span>
          <img src={imgSrc} className={styles.beerImage} alt={beer.name} />
        </a>
      </Link>
    </article>
  );
};

export default BeerOverview;
