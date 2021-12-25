import React, { useEffect } from "react";
import Head from "next/head";
import { AuthProvider } from "../context/auth";
import Layout from "../components/Layout";
import ping from "../services/ping";
import "../styles/global/globals.scss";

const MyApp = ({ Component, pageProps }) => {
  const sendPing = async () => {
    await ping();
  };

  useEffect(() => {
    const interval = setInterval(() => sendPing(), 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </>
  );
};

export default MyApp;
