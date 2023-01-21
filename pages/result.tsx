import styles from "@/styles/Result.module.css";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useState } from "react";

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
  message: string | null;
}

interface IResultPageProps {
  result: IResult;
}

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

  const onChange = () => {
    setComplete((prev) => !prev);
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
      <table className={styles.table}>
        {props.result.lists.map((list) =>
          list.trophies.map((trophy, index) => {
            if (trophy.type === "Platinum") {
              return null;
            }
            return (
              <tr key={trophy.name + index}>
                <td>{complete ? "YES" : "NO"}</td>
                <td>{trophy.name}</td>
                <td>{trophy.description}</td>
                <td>{list.name}</td>
                <td>{list.name === "Base Game" ? "YES" : "NO"}</td>
              </tr>
            );
          })
        )}
      </table>
    </>
  );
};

export default ResultPage;
