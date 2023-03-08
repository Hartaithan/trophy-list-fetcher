import styles from "@/styles/Home.module.css";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => (
  <>
    <p className={styles.title}>Fetch trophy list from:</p>
    <div className={styles.links}>
      <Link className={styles.link} href="/psnprofiles">
        <div className={styles.overlay} />
        <Image
          src="/psnprofiles.png"
          alt="psnprofiles.com logo"
          width={150}
          height={150}
        />
        <p className={styles.linkLabel}>PSNProfiles.com</p>
      </Link>
      <Link className={styles.link} href="/psn-api">
        <div className={styles.overlay} />
        <Image src="/psn-api.png" alt="psn api logo" width={150} height={150} />
        <p className={styles.linkLabel}>PSN API</p>
      </Link>
    </div>
  </>
);

export default Home;
