import "@/styles/globals.css";
import { FC } from "react";
import { Inter } from "next/font/google";
import MainLayout from "@/layouts/MainLayout";
import { IAppProps } from "@/models/AppModel";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const App: FC<IAppProps> = (props) => {
  const { Component, pageProps } = props;
  const Layout = Component.Layout || MainLayout;
  return (
    <Layout>
      <Component {...pageProps} />
      <style jsx global>{`
        * {
          font-family: ${inter.style.fontFamily};
          font-style: ${inter.style.fontStyle};
        }
      `}</style>
    </Layout>
  );
};

export default App;
