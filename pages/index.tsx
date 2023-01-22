import styles from "@/styles/Home.module.css";
import { NextPage } from "next";
import { FormEventHandler } from "react";
import { useRouter } from "next/router";

interface FormTarget extends EventTarget {
  url: { value: string };
  lang: { value: string };
}

const Home: NextPage = () => {
  const router = useRouter();

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.target as FormTarget;
    const url = form.url.value.trim();
    const lang = form.lang.value;
    if (url.length === 0) {
      alert("URL field is empty!");
      return;
    }
    router.push({
      pathname: "/result",
      query: {
        url,
        lang,
      },
    });
  };

  return (
    <>
      <form className={styles.form} onSubmit={onSubmit}>
        <input className={styles.input} name="url" placeholder="Enter URL" />
        <select className={styles.input} name="lang">
          <option value="ru" selected>
            Russian
          </option>
          <option value="en">English</option>
        </select>
        <input className={styles.input} value="Submit" type="submit" />
      </form>
    </>
  );
};

export default Home;
