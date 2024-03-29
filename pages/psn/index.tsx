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
  useRef,
  useState,
} from "react";
import { ISearchResult } from "@/models/SearchModel";
import { psnLocales } from "@/constants/locales";
import Select from "@/components/Select";
import Button from "@/components/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface IResultsState {
  isLoading: boolean;
  list: ISearchResult[];
}

interface FormTarget extends EventTarget {
  url: { value: string };
  lang: { value: string };
}

interface FormElements extends HTMLFormControlsCollection {
  url: HTMLInputElement;
  lang: HTMLSelectElement;
}

const PSNMainPage: IPSNPage = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
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
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("search error");
          })
          .then((result) => {
            setResults((prev) => ({
              ...prev,
              list: result.results,
            }));
          })
          .catch((error) => {
            console.error("search error", error);
          })
          .finally(() => {
            setResults((prev) => ({
              ...prev,
              isLoading: false,
            }));
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

  const handleNewTab = () => {
    if (!formRef.current) {
      alert("Form not found!");
      return;
    }
    const form = formRef.current.elements as FormElements;
    const formUrl = form.url.value.trim();
    const formLang = form.lang.value;
    if (formUrl.length === 0) {
      alert("URL field is empty!");
      return;
    }
    const encodedUrl = encodeURIComponent(formUrl);
    const openUrl = `/psn/result?url=${encodedUrl}&lang=${formLang}`;
    window.open(openUrl, "_blank");
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
    <form
      className={styles.form}
      onSubmit={onSubmit}
      autoComplete="off"
      ref={formRef}
    >
      <SearchInput
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
        defaultValue={psnLocales[0].value}
        name="lang"
        options={psnLocales}
      />
      <Button disabled={!url} onClick={handleNewTab} type="button">
        Open in New Tab
      </Button>
      <Input value="Submit" type="submit" />
    </form>
  );
};

PSNMainPage.Layout = PSNLayout;

export default PSNMainPage;
