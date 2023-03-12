import styles from "@/styles/PSNProfiles.module.css";
import Input from "@/components/Input";
import SearchInput from "@/components/SearchInput";
import useDebounce from "@/hooks/useDebounce";
import PSNLayout from "@/layouts/PSNLayout";
import { IPSNPage } from "@/models/AppModel";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEventHandler,
  useState,
} from "react";
import { ISearchResult } from "@/models/SearchModel";
import { ISelectOption } from "@/models/SelectModel";
import Select from "@/components/Select";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface IResultsState {
  isLoading: boolean;
  list: ISearchResult[];
}

interface FormTarget extends EventTarget {
  url: { value: string };
  lang: { value: string };
}

const langOptions: ISelectOption[] = [
  { id: 1, value: "en-en", label: "English" },
  { id: 2, value: "ru-ru", label: "Russian" },
];

const PSNMainPage: IPSNPage = () => {
  const router = useRouter();
  const [url, setUrl] = useState<string>("");
  const [results, setResults] = useState<IResultsState>({
    isLoading: true,
    list: [],
  });

  const handleSearch: ChangeEventHandler = useDebounce(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const valueIsLink = value.includes("/games/");
      if (value.length > 0 && !valueIsLink) {
        fetch(`${API_URL}/psn/search?query=${value}`)
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
    500
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
      pathname: "/psn/result",
      query: {
        url: formUrl,
        lang: formLang,
      },
    });
  };

  return (
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
      <Select
        defaultValue={langOptions[0].value}
        name="lang"
        options={langOptions}
      />
      <Input className={styles.input} value="Submit" type="submit" />
    </form>
  );
};

PSNMainPage.Layout = PSNLayout;

export default PSNMainPage;
