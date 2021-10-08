import { useState, useEffect } from "react";
import Head from "next/head";
import { getAll } from "../services/beer";
import BeerOverview from "../components/BeerOverview";
import FilterDropdown from "../components/FilterDropdown";
import styles from "../styles/Index.module.scss";

export default function Home({ beers }) {
  const [filter, setFilter] = useState({
    sort: "date_added",
    descending: true,
    beer_type: null,
  });
  const [beerList, setBeerList] = useState(beers);

  const toggleBeerType = (beerType) => {
    if (beerType === filter.beer_type) {
      setFilter({ ...filter, beer_type: null });
    } else {
      setFilter({ ...filter, beer_type: beerType });
    }
  };

  const sortMap = {
    date: () => setFilter({ ...filter, descending: true, sort: "date_added" }),
    name: () => setFilter({ ...filter, descending: "", sort: "name" }),
    rating: () => setFilter({ ...filter, descending: true, sort: "rating" }),
  };

  const beerTypeMap = {
    ale: () => toggleBeerType("ale"),
    lager: () => toggleBeerType("lager"),
    porter: () => toggleBeerType("porter"),
    stout: () => toggleBeerType("stout"),
    pilsner: () => toggleBeerType("pilsner"),
    "pale ale": () => toggleBeerType("pale ale"),
    wheat: () => toggleBeerType("wheat"),
    brown: () => toggleBeerType("brown"),
    blonde: () => toggleBeerType("blonde"),
    IPA: () => toggleBeerType("IPA"),
    sour: () => toggleBeerType("sour"),
  };

  useEffect(async () => {
    const res = await getAll(filter);
    setBeerList(res.data.payload);
  }, [filter]);

  return (
    <>
      <Head>
        <title>biru</title>
      </Head>
      <div>
        <section className="df">
          <FilterDropdown label="sort" optionMap={sortMap} />
          <FilterDropdown label="beer type" optionMap={beerTypeMap} />
        </section>
      </div>{" "}
      <section>
        <h2 className={styles.title}>My Beer Journal</h2>
        {beerList.length ? (
          beerList.map((b) => <BeerOverview key={b.id} beer={b} />)
        ) : (
          <p>No beers...</p> // TODO: make this prettier
        )}
      </section>
    </>
  );
}

export async function getServerSideProps() {
  // sort beers by descending date by default
  const defaultFilters = {
    sort: "date_added",
    descending: true,
    beer_type: null,
  };
  const res = await getAll(defaultFilters);

  return {
    props: { beers: res.data.payload },
  };
}
