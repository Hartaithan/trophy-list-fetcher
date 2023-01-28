import styles from "@/styles/Result.module.css";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { ChangeEventHandler, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ITrophy {
  name: string;
  description: string;
  type: string;
}

interface IList {
  name: string;
  count: number;
  trophies: ITrophy[];
}

interface IResult {
  title: string;
  lists: IList[];
  platform: string;
  thumbnail: string;
  cover: string | null;
  message: string | null;
}

interface IResultPageProps {
  result: IResult;
}

interface IRow {
  id: number;
  value: string;
  label: string;
}

const options: IRow[] = [
  {
    id: 1,
    value: "complete",
    label: "Complete",
  },
  {
    id: 2,
    value: "name",
    label: "Trophy name",
  },
  {
    id: 3,
    value: "description",
    label: "Trophy description",
  },
  {
    id: 4,
    value: "list_name",
    label: "List name",
  },
  {
    id: 5,
    value: "type",
    label: "Trophy type",
  },
  {
    id: 6,
    value: "is_base",
    label: "Is trophy is base game",
  },
];

export const getServerSideProps: GetServerSideProps<IResultPageProps> = async (
  ctx
) => {
  const url = ctx.query.url;
  if (!url) {
    return {
      props: { result: { message: "URL not found!" } },
    };
  }
  try {
    const result = await fetch(API_URL + `/fetch?url=${url}`).then((res) =>
      res.json()
    );
    return {
      props: { result },
    };
  } catch (error) {
    return {
      props: { result: { message: `¯\_(ツ)_/¯` } },
    };
  }
};

const ResultPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const [complete, setComplete] = useState(false);
  const [rows, setRows] = useState<IRow[]>([...options]);

  const onChange = () => {
    setComplete((prev) => !prev);
  };

  const addRow: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const option = options.find((opt) => opt.value === e.target.value);
    if (!option) {
      alert("option not found");
      return;
    }
    const isAlreadySelected = rows.some((row) => row.value === option.value);
    if (isAlreadySelected) {
      alert("row is already showed");
    } else {
      const editedRows = [...rows, option].sort((a, b) => a.id - b.id);
      setRows(editedRows);
    }
    e.target.value = "";
  };

  const deleteRow = (row: IRow) => {
    const filtered = [...rows].filter((item) => item.id !== row.id);
    setRows(filtered);
  };

  if (!props.result.lists) {
    return (
      <>
        <p>On no! Something has gone wrong!</p>
        <p>{props.result.message || "Error message not found"}</p>
      </>
    );
  }

  return (
    <>
      <div className={styles.titleWrapper}>
        <h3 className={styles.title}>{props.result.title}</h3>
        <input type="checkbox" checked={complete} onChange={onChange} />
      </div>
      <select
        className={styles.select}
        placeholder="Select table rows"
        onChange={addRow}
      >
        <option
          disabled
          hidden
          selected
          label="Select table rows"
          defaultValue={undefined}
        />
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className={styles.rows}>
        {rows.map((row) => (
          <div className={styles.row} key={row.id}>
            {row.label}
            <p className={styles.rowDelete} onClick={() => deleteRow(row)}>
              ✖
            </p>
          </div>
        ))}
      </div>
      <table className={styles.table}>
        <tbody>
          {props.result.lists.map((list) =>
            list.trophies.map((trophy, index) => {
              if (trophy.type === "Platinum") {
                return null;
              }
              return (
                <tr key={trophy.name + index}>
                  {rows.some((row) => row.value === options[0].value) && (
                    <td>{complete ? "YES" : "NO"}</td>
                  )}
                  {rows.some((row) => row.value === options[1].value) && (
                    <td>{trophy.name}</td>
                  )}
                  {rows.some((row) => row.value === options[2].value) && (
                    <td>{trophy.description}</td>
                  )}
                  {rows.some((row) => row.value === options[3].value) && (
                    <td>{list.name}</td>
                  )}
                  {rows.some((row) => row.value === options[4].value) && (
                    <td>{trophy.type}</td>
                  )}
                  {rows.some((row) => row.value === options[5].value) && (
                    <td>{list.name === "Base Game" ? "YES" : "NO"}</td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </>
  );
};

export default ResultPage;
