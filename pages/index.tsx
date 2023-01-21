import Head from "next/head";
import styles from "@/styles/Home.module.css";

const Home = () => {
  return (
    <>
      <Head>
        <title>Trophy List Fetcher</title>
        <meta name="description" content="Trophy List Fetcher" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>Hello world!</main>
    </>
  );
};

export default Home;
