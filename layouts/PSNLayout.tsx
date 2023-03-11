import PSNHeader from "@/components/PSNHeader";
import Head from "next/head";
import { FC, PropsWithChildren } from "react";

const PSNLayout: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return (
    <>
      <Head>
        <title>Trophy List Fetcher | PSN</title>
        <meta name="description" content="Trophy List Fetcher" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PSNHeader />
      <main>{children}</main>
    </>
  );
};

export default PSNLayout;
