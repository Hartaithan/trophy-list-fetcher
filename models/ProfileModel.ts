import { ProfileFromUserNameResponse } from "psn-api";

export type Profile = ProfileFromUserNameResponse["profile"];
export type NullableProfile = Profile | null;

export interface IProfileResponse {
  profile: NullableProfile;
}
