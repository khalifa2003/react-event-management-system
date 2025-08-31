import type { IUser } from "./IUser";

export interface IForgotPassword {
  email: string;
}
export interface IVerifyResetCode {
  resetCode: string;
}
export interface IResetPassword {
  email: string;
  newPassword: string;
}
export interface ILogin {
  email: string;
  password: string;
}
export interface IRegister {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
export interface IAuthResponse {
  data: IUser;
  token: string;
}
