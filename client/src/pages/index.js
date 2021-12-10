import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { beerTypes } from "../utils/dataTypes";
import { getAll } from "../services/beer";
import { useAuth } from "../context/auth";
import BeerOverview from "../components/BeerOverview";
import Dropdown from "../components/Dropdown";
import PageError from "../components/PageError";
import withAuth from "../hocs/withAuth";
import styles from "../styles/pages/Index.module.scss";

const Home = () => {
  const { user } = useAuth();

  // data state
  const [beerList, setBeerList] = useState(null);
  const [filter, setFilter] = useState({
    sort: "date",
    descending: true,
    beerType: [],
  });

  // menu button state
  const [sortVisible, setSortVisible] = useState(false);
  const [beerTypeVisible, setBeerTypeVisible] = useState(false);

  // page state
  const [error, setError] = useState(null);

  // update beerList on filter/sort change
  useEffect(() => {
    const updateBeers = async () => {
      setError(null);
      try {
        const { data } = await getAll(filter);
        setBeerList(data.payload.Beers);
      } catch (e) {
        setError("Cannot get your beer journal right now.");
      }
    };

    updateBeers();
  }, [filter]);

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
    if (filter.beerType.includes(beerType)) {
      setFilter({
        ...filter,
        beerType: filter.beerType.filter((v) => v !== beerType),
      });
    } else {
      setFilter({ ...filter, beerType: filter.beerType.concat(beerType) });
    }
  };

  const sortMap = {
    date: () => setFilter({ ...filter, descending: true, sort: "date" }),
    name: () => setFilter({ ...filter, descending: "", sort: "name" }),
    rating: () => setFilter({ ...filter, descending: true, sort: "rating" }),
  };

  const beerTypeMap = beerTypes.reduce(
    (o, t) => ({ ...o, [t]: () => toggleSelectedBeerType(t) }),
    {}
  );

  if (!beerList) return <p>Loading...</p>;

  let beerListElement;
  if (beerList && !beerList.length) {
    // no beers to show
    beerListElement = (
      <p className={styles.noMatchingBeers}>Nothing to show. Add a new beer!</p>
    );
  } else {
    beerListElement = beerList.map((b) => <BeerOverview key={b.id} beer={b} />);
  }

  return (
    <>
      <Head>
        <title>biru</title>
      </Head>
      <section className={`df df-fc ${styles.pageHeader}`}>
        <h2>{user.username}&apos;s Beer Journal</h2>
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
            selected={filter.beerType}
          />
          <Link href="/beer/new">
            <a className={`btn btn-primary ${styles.newBeer}`} href="/beer/new">
              new
            </a>
          </Link>
        </section>
      </section>
      {error === null ? (
        <section>{beerListElement}</section>
      ) : (
        <PageError message={error} />
      )}
    </>
  );
};

export default withAuth(Home);
