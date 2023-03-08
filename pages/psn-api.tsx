import Input from "@/components/Input";
import { NextPage } from "next";
import {
  exchangeNpssoForCode,
  exchangeCodeForAccessToken,
  AuthTokensResponse,
} from "psn-api";
import { useState } from "react";

const PSNPage: NextPage = () => {
  const [auth, setAuth] = useState<AuthTokensResponse>(
    {} as AuthTokensResponse
  );
  const [npsso, setNpsso] = useState("");

  const handleSubmit = async () => {
    console.info("npsso", npsso);
    const accessCode = await exchangeNpssoForCode(npsso);
    console.info("accessCode", accessCode);
    const authorization = await exchangeCodeForAccessToken(accessCode);
    console.info("authorization", authorization);
    setAuth(authorization);
  };

  return (
    <>
      <p style={{ marginBottom: 10 }}>Authorization: {JSON.stringify(auth)}</p>
      <Input
        value={npsso}
        placeholder="Enter your NPSSO token"
        onChange={(e) => setNpsso(e.target.value)}
      />
      <Input type="button" value="Submit" onClick={() => handleSubmit()} />
    </>
  );
};

export default PSNPage;
