import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const url = ctx.query.url;
  if (!url) {
    return {
      props: { result: null, message: "URL not found!" },
    };
  }
  const result = await fetch(API_URL + `/fetch?url=${url}&example=true`).then(
    (res) => res.json()
  );
  return {
    props: { result: result },
  };
};

const ResultPage: NextPage = (props) => {
  const router = useRouter();
  const url = router.query.url;

  return (
    <>
      <p>/result</p>
      <p>{url}</p>
      <p>{JSON.stringify(props, null, 2)}</p>
    </>
  );
};

export default ResultPage;
