import Copy from "@/icons/Copy";
import { EXAMPLE_TARGET } from "@/models/ExampleModel";
import { IResult, IRow } from "@/models/ResultModel";
import styles from "@/styles/Result.module.css";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Image from "next/image";
import { ChangeEventHandler, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const isExample: { value: false; target: EXAMPLE_TARGET | boolean } = {
  value: false,
  target: EXAMPLE_TARGET.Base,
};

interface IResultPageProps {
  result: IResult;
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
  const { url } = ctx.query;
  if (!url) {
    return {
      props: { result: { message: "URL not found!" } },
    };
  }
  try {
    let example = "";
    if (isExample.value) {
      example = `&example=${isExample.target}`;
    }
    const result = await fetch(`${API_URL}/fetch?url=${url}${example}`).then(
      (res) => res.json()
    );
    return {
      props: { result },
    };
  } catch (error) {
    return {
      props: { result: { message: `¯\\_(ツ)_/¯` } },
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

  const copyThumbnail = () => {
    if (navigator && navigator.clipboard && props.result.thumbnail) {
      navigator.clipboard.writeText(props.result.thumbnail);
    } else {
      console.error("there is nothing to copy :(");
    }
  };

  const selectTable = () => {
    const table = document.getElementById("table");
    let range: Range | null = null;
    let selection: Selection | null = null;
    const readyForSelection = !!document.createRange && !!window.getSelection;
    if (!readyForSelection) {
      return;
    }
    range = document.createRange();
    selection = window.getSelection();
    if (selection && table) {
      selection.removeAllRanges();
      try {
        range.selectNodeContents(table);
        selection.addRange(range);
      } catch (e) {
        range.selectNode(table);
        selection.addRange(range);
      }
    }
    document.execCommand("Copy");
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
      <div className={styles.banner}>
        <div className={styles.overlay} />
        <Image
          fill
          placeholder="blur"
          className={styles.cover}
          blurDataURL="/placeholder.jpg"
          alt={`${props.result.title} cover`}
          src={props.result.cover || "/placeholder.png"}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.thumbnailContainer}>
          <div id="overlay" className={styles.thumbnailOverlay}>
            <Copy
              className={styles.copy}
              onClick={copyThumbnail}
              width={48}
              height={48}
              color="#FFF"
            />
          </div>
          <Image
            priority
            width={200}
            height={120}
            quality={100}
            placeholder="blur"
            blurDataURL="/placeholder.jpg"
            className={styles.thumbnail}
            src={props.result.thumbnail || "/placeholder.png"}
            alt={`${props.result.title} thumbnail`}
          />
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{props.result.title}</h3>
          <div className={styles.platformContainer}>
            <p className={styles.platform}>{props.result.platform}</p>
          </div>
          <div className={styles.completeContainer}>
            <input
              id="complete"
              type="checkbox"
              checked={complete}
              onChange={onChange}
            />
            <label className={styles.completeLabel} htmlFor="complete">
              Toggle Completion
            </label>
          </div>
          <button className={styles.copyTable} onClick={selectTable}>
            <p>Copy Table</p>
            <Copy width={12} height={12} color="#FFF" />
          </button>
        </div>
        <div className={styles.rowPicker}>
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
          <div className={styles.rowsList}>
            {rows.map((row) => (
              <div className={styles.rowItem} key={row.id}>
                {row.label}
                <p className={styles.rowDelete} onClick={() => deleteRow(row)}>
                  ✖
                </p>
              </div>
            ))}
          </div>
        </div>
        <table id="table" className={styles.table}>
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
      </div>
    </>
  );
};

export default ResultPage;
