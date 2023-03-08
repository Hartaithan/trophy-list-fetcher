import { FC, SelectHTMLAttributes } from "react";
import styles from "@/styles/Input.module.css";
import { ISelectOption } from "@/models/SelectModel";

interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: ISelectOption[];
}

const Select: FC<ISelectProps> = (props) => {
  const { className, options, ...rest } = props;
  return (
    <select className={`${className} ${styles.input}`} {...rest}>
      {options.map(({ id, value, label }) => (
        <option key={id} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default Select;
