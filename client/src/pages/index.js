import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { getAll } from "../services/beer";
import BeerOverview from "../components/BeerOverview";
import Dropdown from "../components/Dropdown";
import PageError from "../components/PageError";
import styles from "../styles/pages/Index.module.scss";
import { extractToken } from "../utils/extractToken";
import { notFound, redirectToLogin } from "../utils/serverSide";

const Home = ({ data, initialQuery }) => {
  // data state
  const [beerList, setBeerList] = useState(data.Beers);
  const [filter, setFilter] = useState(initialQuery);

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
        setBeerList(data.payload ? data.payload.Beers : []);
      } catch (error) {
        setError("Cannot get beer journal right now.");
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
    if (beerType === filter.beerType) {
      setFilter({ ...filter, beerType: null });
    } else {
      setFilter({ ...filter, beerType });
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

  let beerListElement;
  if (beerList && !beerList.length) {
    // no beers
    beerListElement = (
      <p className={styles.noMatchingBeers}>No matching beers.</p>
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
        <h2>{data.name}'s Beer Journal</h2>
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
            <a className={`btn btn-primary ${styles.newBeer}`}>new</a>
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

export const getServerSideProps = async (ctx) => {
  const token = extractToken(ctx);

  // no logged in user
  if (!token) {
    return redirectToLogin;
  }

  try {
    const initialQuery = {
      sort: "date",
      descending: true,
      beerType: null,
    };

    const res = await getAll(initialQuery, token);

    return {
      props: {
        data: res.data.payload,
        loggedIn: true,
        initialQuery,
      },
    };
  } catch (err) {
    return notFound;
  }
};

export default Home;
