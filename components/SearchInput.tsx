import {
  ChangeEventHandler,
  DetailedHTMLProps,
  FC,
  FocusEventHandler,
  InputHTMLAttributes,
  useState,
} from "react";
import styles from "@/styles/SearchInput.module.css";
import inputStyles from "@/styles/Input.module.css";
import { ISearchResult } from "@/models/SearchModel";
import { isLink } from "@/helpers/link";
import Loader from "./Loader";

type HTMLInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

interface IInputProps extends HTMLInputProps {
  isLoading: boolean;
  suggestions: ISearchResult[];
  onSuggestClick: (item: ISearchResult) => void;
}

const SearchInput: FC<IInputProps> = (props) => {
  const {
    className,
    isLoading,
    suggestions,
    onSuggestClick,
    onFocus,
    onBlur,
    onChange,
    ...rest
  } = props;
  const [isShow, setShow] = useState(false);
  const isEmpty = suggestions.length === 0;

  const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    if (onFocus) {
      onFocus(e);
    }
    const value = e.target.value.trim();
    const valueIsLink = isLink(value);
    if (value.length > 0 && !valueIsLink) {
      setShow(true);
    }
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    if (onBlur) {
      onBlur(e);
    }
    setShow(false);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (onChange) {
      onChange(e);
    }
    const value = e.target.value.trim();
    const valueIsLink = isLink(value);
    const listClosed = isShow === false;
    if (value.length > 0 && listClosed && !valueIsLink) {
      setShow(true);
    }
    if (value.length === 0 || valueIsLink) {
      setShow(false);
    }
  };

  return (
    <div className={`${className} ${inputStyles.input} ${styles.wrapper}`}>
      <input
        className={`${className} ${inputStyles.input}`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...rest}
      />
      {isShow && (
        <div
          className={`${styles.suggestions} ${
            isLoading || isEmpty ? styles.loader : ""
          }`}
        >
          {isLoading ? (
            <Loader width={80} height={80} />
          ) : (
            suggestions.map((suggest) => (
              <div
                key={suggest.id}
                className={styles.suggestion}
                onMouseDown={() => onSuggestClick(suggest)}
              >
                <p className={styles.name}>{suggest.name}</p>
                <p className={styles.platform}>{suggest.platforms.join(",")}</p>
              </div>
            ))
          )}
          {!isLoading && suggestions.length === 0 && (
            <p className={styles.name}>No results :(</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
