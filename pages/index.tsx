import styles from "@/styles/Home.module.css";
import { NextPage } from "next";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEventHandler,
  useState,
} from "react";
import { useRouter } from "next/router";
import useDebounce from "@/hooks/useDebounce";
import SearchInput from "@/components/SearchInput";
import { ISearchResult } from "@/models/SearchModel";
import { SearchResults } from "@/models/ExampleModel";
import { isLink } from "@/helpers/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FormTarget extends EventTarget {
  url: { value: string };
  lang: { value: string };
}

interface IResultsState {
  isLoading: boolean;
  list: ISearchResult[];
}

const isExample: { value: boolean; target: SearchResults | boolean } = {
  value: false,
  target: SearchResults.One,
};

const Home: NextPage = () => {
  const router = useRouter();
  const [url, setUrl] = useState<string>("");
  const [results, setResults] = useState<IResultsState>({
    isLoading: true,
    list: [],
  });

  const handleSearch: ChangeEventHandler = useDebounce(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      let example = "";
      if (isExample.value) {
        example = `&example=${isExample.target}`;
      }
      const valueIsLink = isLink(value);
      if (value.length > 0 && !valueIsLink) {
        fetch(`${API_URL}/search?query=${value}${example}`)
          .then((res) => res.json())
          .then((result) => {
            setResults((prev) => ({
              ...prev,
              isLoading: false,
              list: result.results,
            }));
          })
          .catch((error) => {
            console.error("search error", error);
          });
      }
    },
    1500
  );

  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setResults((prev) => ({ ...prev, isLoading: true }));
    handleSearch(e);
    setUrl(e.target.value);
  };

  const handleSuggestion = (item: ISearchResult) => {
    setUrl(item.url);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.target as FormTarget;
    const formUrl = form.url.value.trim();
    const formLang = form.lang.value;
    if (formUrl.length === 0) {
      alert("URL field is empty!");
      return;
    }
    router.push({
      pathname: "/result",
      query: {
        url: formUrl,
        lang: formLang,
      },
    });
  };

  return (
    <>
      <form className={styles.form} onSubmit={onSubmit} autoComplete="off">
        <SearchInput
          className={styles.input}
          name="url"
          value={url}
          placeholder="Search or enter URL"
          onChange={handleInput}
          suggestions={results.list}
          isLoading={results.isLoading}
          onSuggestClick={handleSuggestion}
          autoComplete="off"
        />
        <select className={styles.input} defaultValue="ru" name="lang">
          <option value="ru">Russian</option>
          <option value="en">English</option>
        </select>
        <input className={styles.input} value="Submit" type="submit" />
      </form>
    </>
  );
};

export default Home;
