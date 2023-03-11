import Input from "@/components/Input";
import { NextPage } from "next";
import { useState } from "react";
import { AuthTokensResponse } from "psn-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const PSNSignInPage: NextPage = () => {
  const [auth, setAuth] = useState<AuthTokensResponse>(
    {} as AuthTokensResponse
  );
  const [npsso, setNpsso] = useState("");

  const handleSubmit = () => {
    fetch(`${API_URL}/psn/token?npsso=${npsso}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.authorization) {
          setAuth(res.authorization);
        } else {
          console.error("token not found");
        }
      })
      .catch((error) => {
        console.error("token retrieve error", error);
      });
  };

  return (
    <>
      <pre
        style={{
          padding: "0px 100px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          marginBottom: 10,
        }}
      >
        Authorization: {JSON.stringify(auth, null, 2)}
      </pre>
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
