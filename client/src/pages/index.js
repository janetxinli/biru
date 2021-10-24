import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { getAll } from "../services/beer";
import BeerOverview from "../components/BeerOverview";
import Dropdown from "../components/Dropdown";
import styles from "../styles/pages/Index.module.scss";

export default function Home({ beers }) {
  // data state
  const [beerList, setBeerList] = useState(beers);
  const [filter, setFilter] = useState({
    sort: "date",
    descending: true,
    beer_type: null,
  });

  // menu button state
  const [sortVisible, setSortVisible] = useState(false);
  const [beerTypeVisible, setBeerTypeVisible] = useState(false);

  const toggleSortVisible = (e) => {
    e.preventDefault();
    setBeerTypeVisible(false);
    setSortVisible(!sortVisible);
  };

  const toggleBeerTypeVisible = (e) => {
    e.preventDefault();
    setSortVisible(false);
    setBeerTypeVisible(!beerTypeVisible);
  };

  const toggleSelectedBeerType = (beerType) => {
    if (beerType === filter.beer_type) {
      setFilter({ ...filter, beer_type: null });
    } else {
      setFilter({ ...filter, beer_type: beerType });
    }
  };

  const sortMap = {
    date: () => setFilter({ ...filter, descending: true, sort: "date" }),
    name: () => setFilter({ ...filter, descending: "", sort: "name" }),
    rating: () => setFilter({ ...filter, descending: true, sort: "rating" }),
  };

  const beerTypeMap = {
    ale: () => toggleSelectedBeerType("ale"),
    lager: () => toggleSelectedBeerType("lager"),
    porter: () => toggleSelectedBeerType("porter"),
    stout: () => toggleSelectedBeerType("stout"),
    pilsner: () => toggleSelectedBeerType("pilsner"),
    "pale ale": () => toggleSelectedBeerType("pale ale"),
    wheat: () => toggleSelectedBeerType("wheat"),
    brown: () => toggleSelectedBeerType("brown"),
    blonde: () => toggleSelectedBeerType("blonde"),
    IPA: () => toggleSelectedBeerType("IPA"),
    sour: () => toggleSelectedBeerType("sour"),
    other: () => toggleSelectedBeerType("other"),
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
      <section className={`df df-fc ${styles.pageHeader}`}>
        <h2>My Beer Journal</h2>
        <section className="df">
          <Dropdown
            label="sort"
            optionMap={sortMap}
            visibility={sortVisible}
            toggleVisibility={toggleSortVisible}
            selected={filter.sort}
          />
          <Dropdown
            label="beer type"
            optionMap={beerTypeMap}
            visibility={beerTypeVisible}
            toggleVisibility={toggleBeerTypeVisible}
            selected={filter.beer_type}
          />
          <Link href="/beer/new">
            <a className={`btn btn-primary ${styles.newBeer}`}>new</a>
          </Link>
        </section>
      </section>
      {beerList.length ? (
        beerList.map((b) => <BeerOverview key={b.id} beer={b} />)
      ) : (
        <p className={styles.noMatchingBeers}>No matching beers.</p>
      )}
    </>
  );
}

export async function getServerSideProps() {
  // sort beers by descending date by default
  const defaultFilters = {
    sort: "date",
    descending: true,
    beer_type: null,
  };
  const res = await getAll(defaultFilters);

  return {
    props: { beers: res.data.payload },
  };
}
