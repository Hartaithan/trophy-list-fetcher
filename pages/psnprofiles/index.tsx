import styles from "@/styles/PSNProfiles.module.css";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEventHandler,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import useDebounce from "@/hooks/useDebounce";
import SearchInput from "@/components/SearchInput";
import { ISearchResult } from "@/models/SearchModel";
import { SEARCH_RESULTS } from "@/models/ExampleModel";
import { isLink } from "@/helpers/link";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { ISelectOption } from "@/models/SelectModel";
import { IPage } from "@/models/AppModel";
import PSNProfilesLayout from "@/layouts/PSNProfilesLayout";
import Button from "@/components/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

const isExample: { value: false; target: SEARCH_RESULTS | boolean } = {
  value: false,
  target: SEARCH_RESULTS.One,
};

const langOptions: ISelectOption[] = [
  { id: 1, value: "en", label: "English" },
  { id: 2, value: "ru", label: "Russian" },
];

const PSNProfilesPage: IPage = () => {
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
      let example = "";
      if (isExample.value) {
        example = `&example=${isExample.target}`;
      }
      const valueIsLink = isLink(value);
      if (value.length > 0 && !valueIsLink) {
        fetch(`${API_URL}/psnprofiles/search?query=${value}${example}`)
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
    const openUrl = `/psnprofiles/result?url=${encodedUrl}&lang=${formLang}`;
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
      pathname: "/psnprofiles/result",
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
        defaultValue={langOptions[0].value}
        name="lang"
        options={langOptions}
      />
      <Button disabled={!url} onClick={handleNewTab} type="button">
        Open in New Tab
      </Button>
      <Input value="Submit" type="submit" />
    </form>
  );
};

PSNProfilesPage.Layout = PSNProfilesLayout;

export default PSNProfilesPage;
