import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { NextPage } from "next";
import { FormEventHandler } from "react";
import { useRouter } from "next/router";

interface FormTarget extends EventTarget {
  url: { value: string };
}

const Home: NextPage = () => {
  const router = useRouter();

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.target as FormTarget;
    const url = form.url.value.trim();
    if (url.length === 0) {
      alert("URL field is empty!");
      return;
    }
    router.push({
      pathname: "/result",
      query: {
        url,
      },
    });
  };

  return (
    <>
      <Head>
        <title>Trophy List Fetcher</title>
        <meta name="description" content="Trophy List Fetcher" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <form className={styles.form} onSubmit={onSubmit}>
          <input className={styles.input} name="url" placeholder="Enter URL" />
          <input className={styles.input} value="Submit" type="submit" />
        </form>
      </main>
    </>
  );
};

export default Home;
