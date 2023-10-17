import Copy from "@/icons/Copy";
import Delete from "@/icons/Delete";
import PSNProfilesLayout from "@/layouts/PSNProfilesLayout";
import { IPage } from "@/models/AppModel";
import { TROPHY_LISTS } from "@/models/ExampleModel";
import {
  IPSNProfilesFetchResponse as IResponse,
  IRow,
} from "@/models/TrophyModel";
import styles from "@/styles/PSNProfilesResult.module.css";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { ChangeEventHandler, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const isExample: { value: false; target: TROPHY_LISTS | boolean } = {
  value: false,
  target: TROPHY_LISTS.Base,
};

interface IPSNProfilesResultPageProps {
  result: IResponse;
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

export const getServerSideProps: GetServerSideProps<
  IPSNProfilesResultPageProps
> = async (ctx) => {
  const { url, lang } = ctx.query;
  if (!url) {
    return {
      props: { result: { message: "URL not found!" } },
    };
  }
  let params = `?url=${url}`;
  if (lang) {
    params += `&lang=${lang}`;
  }
  try {
    let example = "";
    if (isExample.value) {
      example = `&example=${isExample.target}`;
    }
    const result = await fetch(
      `${API_URL}/psnprofiles/fetch${params}${example}`
    ).then((res) => res.json());
    return {
      props: { result },
    };
  } catch (error) {
    return {
      props: { result: { message: `¯\\_(ツ)_/¯` } },
    };
  }
};

const PSNProfilesResultPage: IPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const { result } = props;
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

  const copyTitle = () => {
    if (navigator && navigator.clipboard && result.title) {
      navigator.clipboard.writeText(result.title);
    } else {
      alert("there is nothing to copy :(");
    }
  };

  const copyThumbnail = () => {
    if (navigator && navigator.clipboard && result.thumbnail) {
      navigator.clipboard.writeText(result.thumbnail);
    } else {
      alert("there is nothing to copy :(");
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
    } else {
      alert("there is nothing to copy :(");
    }
    document.execCommand("Copy");
  };

  if (!result.lists) {
    return (
      <>
        <p>On no! Something has gone wrong!</p>
        <p>{result.message || "Error message not found"}</p>
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
          alt={`${result.title} cover`}
          src={result.cover || "/placeholder.png"}
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
            src={result.thumbnail || "/placeholder.png"}
            alt={`${result.title} thumbnail`}
          />
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{result.title}</h3>
          <div className={styles.platformContainer}>
            <p className={styles.platform}>{result.platform}</p>
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
          <button className={styles.copyTitle} onClick={copyTitle}>
            <p>Copy Name</p>
            <Copy width={12} height={12} />
          </button>
          <button className={styles.copyTable} onClick={selectTable}>
            <p>Copy Table</p>
            <Copy width={12} height={12} />
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
                <Delete
                  className={styles.rowDelete}
                  width={15}
                  height={15}
                  onClick={() => deleteRow(row)}
                />
              </div>
            ))}
          </div>
        </div>
        <table id="table" className={styles.table}>
          <tbody>
            {result.lists.map((list) =>
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

PSNProfilesResultPage.Layout = PSNProfilesLayout;

export default PSNProfilesResultPage;
