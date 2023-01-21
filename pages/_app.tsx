import "@/styles/globals.css";
import { FC } from "react";
import type { AppProps } from "next/app";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

const App: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        * {
          font-family: ${inter.style.fontFamily};
          font-style: ${inter.style.fontStyle};
        }
      `}</style>
    </>
  );
};

export default App;
