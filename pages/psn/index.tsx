import PSNLayout from "@/layouts/PSNLayout";
import { IPSNPage } from "@/models/AppModel";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const PSNMainPage: IPSNPage = () => {
  const handleSubmit = () => {
    fetch(`${API_URL}/psn/fetch?url=/vita/games/killzone_mercenary`)
      .then((response) => response.json())
      .then((res) => {
        console.log("res", res);
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  return <p onClick={() => handleSubmit()}>PSNMainPage</p>;
};

PSNMainPage.Layout = PSNLayout;

export default PSNMainPage;
