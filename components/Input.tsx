import { FC, InputHTMLAttributes } from "react";
import styles from "@/styles/Input.module.css";

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const { className, ...rest } = props;
  return <input {...rest} className={`${className} ${styles.input}`} />;
};

export default Input;
