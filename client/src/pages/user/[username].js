import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { beerTypes } from "../../utils/dataTypes";
import { getProfile } from "../../services/user";
import { useAuth } from "../../context/auth";
import withAuth from "../../hocs/withAuth";
import BeerOverview from "../../components/BeerOverview";
import Dropdown from "../../components/Dropdown";
import PageError from "../../components/PageError";
import ProfileCard from "../../components/ProfileCard";
import styles from "../../styles/pages/Profile.module.scss";

const Profile = () => {
  const router = useRouter();

  const { user } = useAuth();

  // data state
  const [profile, setProfile] = useState(null);
  const [queryParams, setQueryParams] = useState({
    sort: "date",
    descending: true,
    beerType: [],
  });

  // menu button state
  const [sortVisible, setSortVisible] = useState(false);
  const [beerTypeVisible, setBeerTypeVisible] = useState(false);

  // page state
  const [error, setError] = useState(null);

  // update beerList on queryParams change
  useEffect(() => {
    if (!router) return;

    const updateBeers = async () => {
      setError(null);
      try {
        const result = await getProfile(router.query.username, queryParams);
        setProfile(result.data.payload);
      } catch (e) {
        setError("Cannot get profile right now.");
      }
    };

    updateBeers();
  }, [router, queryParams]);

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
    if (queryParams.beerType.includes(beerType)) {
      setQueryParams({
        ...queryParams,
        beerType: queryParams.beerType.filter((v) => v !== beerType),
      });
    } else {
      setQueryParams({
        ...queryParams,
        beerType: queryParams.beerType.concat(beerType),
      });
    }
  };

  const sortMap = {
    date: () =>
      setQueryParams({ ...queryParams, descending: true, sort: "date" }),
    name: () =>
      setQueryParams({ ...queryParams, descending: "", sort: "name" }),
    rating: () =>
      setQueryParams({ ...queryParams, descending: true, sort: "rating" }),
  };

  const beerTypeMap = beerTypes.reduce(
    (o, t) => ({ ...o, [t]: () => toggleSelectedBeerType(t) }),
    {}
  );

  if (!profile) return <p>Loading...</p>;

  let beerListElement;
  if (profile && !profile.Beers.length) {
    // no beers to show
    beerListElement = (
      <p className={styles.noMatchingBeers}>
        Nothing to show.
        {router.query.username === user.username && " Add a new beer!"}
      </p>
    );
  } else {
    beerListElement = profile.Beers.map((b) => (
      <BeerOverview key={b.id} beer={b} />
    ));
  }

  return (
    <article className={styles.profile}>
      <ProfileCard profile={profile} />
      <section className={`df df-jc-c ${styles.navButtons}`}>
        <Dropdown
          label="sort"
          optionMap={sortMap}
          visibility={sortVisible}
          toggleVisibility={toggleSortVisible}
          selected={queryParams.sort}
        />
        <Dropdown
          label="beer type"
          optionMap={beerTypeMap}
          visibility={beerTypeVisible}
          toggleVisibility={toggleBeerTypeVisible}
          selected={queryParams.beerType}
        />
        {router.query.username === user.username && (
          <Link href="/beer/new">
            <a className={`btn btn-primary ${styles.newBeer}`} href="/beer/new">
              new
            </a>
          </Link>
        )}
      </section>
      {error === null ? (
        <section className={styles.beerList}>{beerListElement}</section>
      ) : (
        <PageError message={error} />
      )}
    </article>
  );
};

export default withAuth(Profile);
