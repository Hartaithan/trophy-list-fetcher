import { FC } from "react";
import styles from "@/styles/PSNHeader.module.css";
import { useRouter } from "next/router";
import Input from "./Input";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const PSNHeader: FC = () => {
  const router = useRouter();

  const handleSignOut = () => {
    fetch(`${API_URL}/psn/signOut`)
      .then(() => {
        router.reload();
      })
      .catch((error) => {
        console.error("sign out error", error);
      });
  };

  return (
    <header className={styles.header}>
      <Input
        className={styles.button}
        onClick={() => handleSignOut()}
        type="button"
        value="Sign out"
      />
    </header>
  );
};

export default PSNHeader;
