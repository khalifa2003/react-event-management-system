import type { IUser } from "../../../interfaces/IUser";

export interface IAuthResponse {
  data: IUser;
  token: string;
}
