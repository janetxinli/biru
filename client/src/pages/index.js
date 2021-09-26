import Head from "next/head";
import BeerOverview from "../components/BeerOverview";
import data from "../data.json";
import styles from "../styles/Index.module.scss";

// TODO: create layout component for header
// TODO: integrate getServerSideProps

export default function Home() {
  return (
    <>
      <Head>
        <title>biru</title>
      </Head>
      <section>
        <h2 className={styles.title}>My Beer Journal</h2>
        {data.beers.map((b) => (
          <BeerOverview key={b.id} beer={b} />
        ))}
      </section>
    </>
  );
}
