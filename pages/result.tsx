import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";

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
  name: string;
  lists: IList[];
  message: string | null;
}

interface IResultPageProps {
  result: IResult | null;
}

export const getServerSideProps: GetServerSideProps<IResultPageProps> = async (
  ctx
) => {
  const url = ctx.query.url;
  if (!url) {
    return {
      props: { result: null, message: "URL not found!" },
    };
  }
  try {
    const result = await fetch(API_URL + `/fetch?url=${url}&example=true`).then(
      (res) => res.json()
    );
    return {
      props: { result: result },
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
  const router = useRouter();
  const url = router.query.url;

  if (props.result && !props.result.lists) {
    return (
      <>
        <p>On no! Something has gone wrong!</p>
        <p>{props.result.message || "Error message not found"}</p>
      </>
    );
  }

  return (
    <>
      <p>/result</p>
      <p>{url}</p>
      <p>{JSON.stringify(props, null, 2)}</p>
    </>
  );
};

export default ResultPage;
