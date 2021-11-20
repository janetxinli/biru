import Head from "next/head";
import Layout from "../components/Layout";
import "../styles/global/globals.scss";

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Layout loggedIn={pageProps?.loggedIn}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default MyApp;
