import "@/styles/globals.css";
import { FC } from "react";
import type { AppProps } from "next/app";
import { Inter } from "@next/font/google";
import MainLayout from "@/layouts/MainLayout";

const inter = Inter({ subsets: ["latin"] });

const App: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
  return (
    <MainLayout>
      <Component {...pageProps} />
      <style jsx global>{`
        * {
          font-family: ${inter.style.fontFamily};
          font-style: ${inter.style.fontStyle};
        }
      `}</style>
    </MainLayout>
  );
};

export default App;
