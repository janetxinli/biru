import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { beerTypes } from "../../utils/dataTypes";
import { getProfile, getFollowing, getFollowers } from "../../services/user";
import { useAuth } from "../../context/auth";
import withAuth from "../../hocs/withAuth";
import BeerOverview from "../../components/BeerOverview";
import Dropdown from "../../components/Dropdown";
import Loading from "../../components/Loading";
import PageError from "../../components/PageError";
import ProfileCard from "../../components/ProfileCard";
import UserListPopup from "../../components/UserListPopup";
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
  const [following, setFollowing] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [error, setError] = useState(null);

  // update beerList on queryParams change
  useEffect(() => {
    if (!router.query.username) return;

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

  // reset popup state between redirects
  useEffect(() => {
    setProfile(null);
    setFollowing(null);
    setFollowers(null);
  }, [router.query]);

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

  const toggleShowFollowing = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let data;

      if (following === null) {
        const res = await getFollowing(profile.id);
        data = res.data.payload;
      } else {
        data = null;
      }

      setFollowing(data);
    } catch (err) {
      setError("Cannot get followed users right now");
    }
  };

  const toggleShowFollowers = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let data;

      if (followers === null) {
        const res = await getFollowers(profile.id);
        data = res.data.payload;
      } else {
        data = null;
      }

      setFollowers(data);
    } catch (err) {
      setError("Cannot get followers right now");
    }
  };

  if (!profile) return <Loading />;

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
      {following && (
        <UserListPopup
          title="Following"
          userList={following}
          accessor="FollowedUser"
          toggleVisible={toggleShowFollowing}
        />
      )}
      {followers && (
        <UserListPopup
          title="Followers"
          userList={followers}
          accessor="FollowingUser"
          toggleVisible={toggleShowFollowers}
        />
      )}
      <ProfileCard
        profile={profile}
        setProfile={setProfile}
        toggleShowFollowing={toggleShowFollowing}
        toggleShowFollowers={toggleShowFollowers}
        setError={setError}
      />
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
        <PageError
          message={error}
          closeError={
            error === "Cannot get followed users right now" ||
            error === "Cannot get followers right now"
              ? () => setError(null)
              : undefined
          }
        />
      )}
    </article>
  );
};

export default withAuth(Profile);
