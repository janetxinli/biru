import React from "react";
import styles from "../styles/components/CategoryGroup.module.scss";

export default function CategoryGroup({ categoryMap, selected, id }) {
  return (
    <section id={id} className={`df ${styles.categoryGroup}`}>
      {Object.entries(categoryMap).map((o) => {
        const className = selected === o[0] ? "btn btn-primary" : "btn btn-secondary";
        return (
          <button className={className} key={o[0]} type="submit" onClick={o[1]}>
            {o[0]}
          </button>
        );
      })}
    </section>
  );
}
