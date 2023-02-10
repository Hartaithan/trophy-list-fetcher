import {
  ChangeEventHandler,
  DetailedHTMLProps,
  FC,
  FocusEventHandler,
  InputHTMLAttributes,
  useState,
} from "react";
import styles from "@/styles/SearchInput.module.css";
import { ISearchResult } from "@/models/SearchModel";
import Loader from "./Loader";
import { isLink } from "@/helpers/link";

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
    isLoading,
    suggestions,
    onSuggestClick,
    onFocus,
    onBlur,
    onChange,
    ...rest
  } = props;
  const [isShow, setShow] = useState(false);

  const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    onFocus && onFocus(e);
    const value = e.target.value.trim();
    const valueIsLink = isLink(value);
    if (value.length > 0 && !valueIsLink) {
      setShow(true);
    }
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    onBlur && onBlur(e);
    setShow(false);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange && onChange(e);
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
    <div className={`${props.className} ${styles.wrapper}`}>
      <input
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...rest}
      />
      {isShow && (
        <div
          className={`${styles.suggestions} ${isLoading ? styles.loader : ""}`}
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
        </div>
      )}
    </div>
  );
};

export default SearchInput;
