import Head from "next/head";
import { FC, PropsWithChildren } from "react";

const PSNProfilesLayout: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return (
    <>
      <Head>
        <title>Trophy List Fetcher | PSNProfiles</title>
        <meta name="description" content="Trophy List Fetcher" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </>
  );
};

export default PSNProfilesLayout;
