import type { IUser } from "./IUser";

export interface IAuthResponse {
  data: IUser;
  token: string;
}
