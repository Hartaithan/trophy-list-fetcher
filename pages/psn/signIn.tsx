import Input from "@/components/Input";
import { NextPage } from "next";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const PSNSignInPage: NextPage = () => {
  const [npsso, setNpsso] = useState("");

  const handleSubmit = () => {
    fetch(`${API_URL}/psn/signIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ npsso }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
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
