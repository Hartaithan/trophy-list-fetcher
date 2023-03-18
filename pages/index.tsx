import { IPage } from "@/models/AppModel";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";

const Home: IPage = () => (
  <>
    <p className={styles.title}>Fetch trophy list from:</p>
    <div className={styles.links}>
      <Link className={styles.link} href="/psnprofiles" prefetch={false}>
        <div className={styles.overlay} />
        <Image
          priority
          src="/psnprofiles.png"
          alt="psnprofiles.com logo"
          width={150}
          height={150}
        />
        <p className={styles.linkLabel}>PSNProfiles.com</p>
      </Link>
      <Link className={styles.link} href="/psn" prefetch={false}>
        <div className={styles.overlay} />
        <Image
          priority
          src="/psn.png"
          alt="psn api logo"
          width={150}
          height={150}
        />
        <p className={styles.linkLabel}>PSN API</p>
      </Link>
    </div>
  </>
);

export default Home;
