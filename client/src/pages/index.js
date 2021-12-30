import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import withAuth from "../hocs/withAuth";
import { useAuth } from "../context/auth";
import { getFeed } from "../services/user";
import BeerOverview from "../components/BeerOverview";
import PageError from "../components/PageError";
import Loading from "../components/Loading";
import styles from "../styles/pages/Index.module.scss";

const Home = () => {
  const { user } = useAuth();

  const [beers, setBeers] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);

  const observer = useRef(null);
  const lastBeerElementRef = useCallback(
    (element) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum(pageNum + 1);
        }
      });
      if (element) observer.current.observe(element);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const requestFeed = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getFeed(user.id, pageNum);
        setBeers(beers.concat(res.data.payload));
        setHasMore(res.data.payload.length > 0);
      } catch (e) {
        setError("Cannot get your feed right now");
      } finally {
        setLoading(false);
      }
    };

    requestFeed();
  }, [pageNum]);

  if (error !== null) {
    return <PageError error={error} />;
  }

  return (
    <section>
      {beers.length === 0 && pageNum === 0 && (
        <p className={styles.nothing}>
          Nothing to show in your feed.{" "}
          <Link href="/search">
            <a href="/search">Search</a>
          </Link>{" "}
          for users to follow!
        </p>
      )}
      {beers.length > 0 &&
        beers.map((b, i) => {
          if (i !== beers.length - 1) {
            return <BeerOverview key={b.id} beer={b} />;
          }
          return <BeerOverview ref={lastBeerElementRef} key={b.id} beer={b} />;
        })}
      {loading && <Loading className={styles.loading} />}
    </section>
  );
};

export default withAuth(Home);
