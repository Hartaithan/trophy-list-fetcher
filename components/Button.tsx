import { FC, ButtonHTMLAttributes } from "react";
import styles from "@/styles/Input.module.css";

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  const { className, ...rest } = props;
  return <button {...rest} className={`${className} ${styles.input}`} />;
};

export default Button;
