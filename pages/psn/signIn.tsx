import Input from "@/components/Input";
import { IPage } from "@/models/AppModel";
import { useRouter } from "next/router";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const PSNSignInPage: IPage = () => {
  const [npsso, setNpsso] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    fetch(`${API_URL}/psn/signIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ npsso }),
    })
      .then((response) => response.json())
      .then(() => {
        router.push("/psn");
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  return (
    <>
      <Input
        value={npsso}
        placeholder="Enter your NPSSO token"
        onChange={(e) => setNpsso(e.target.value)}
      />
      <Input type="button" value="Submit" onClick={() => handleSubmit()} />
    </>
  );
};

export default PSNSignInPage;
