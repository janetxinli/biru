import Head from "next/head";
import BeerOverview from "../components/BeerOverview";
import styles from "../styles/Index.module.scss";

export default function Home({ beers }) {
  return (
    <>
      <Head>
        <title>biru</title>
      </Head>
      <section>
        <h2 className={styles.title}>My Beer Journal</h2>
        {beers.map((b) => (
          <BeerOverview key={b.id} beer={b} />
        ))}
      </section>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch("http://localhost:3000/data.json");
  const data = await res.json();

  return {
    props: { beers: data.beers },
  };
}
