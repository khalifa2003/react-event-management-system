import type { IAuthResponse } from "../interfaces/i-auth-response.model";
import api from "../../../core/services/api";
import Cookies from "js-cookie";
import type { ILogin } from "../interfaces/i-login.model";
import type { IRegister } from "../interfaces/i-register.model";
import type { IForgotPassword } from "../interfaces/i-forgot-password.model";
import type { IVerifyResetCode } from "../interfaces/i-verify-reset-code.model";
import type { IResetPassword } from "../interfaces/i-reset-password.model";

const saveToken = (token: string) => {
  Cookies.set("token", token, { expires: 7, secure: true, sameSite: "Strict" });
};
export const isLoggedIn = (): boolean => !!Cookies.get("token");
export const logoutUser = () => Cookies.remove("token");
export const loginUser = (credentials: ILogin): Promise<IAuthResponse> => {
  return api.post<IAuthResponse>("/auth/login", credentials).then((res) => {
    saveToken(res.data.token);
    return res.data;
  });
};
export const registerUser = (userInfo: IRegister): Promise<IAuthResponse> => {
  return api.post<IAuthResponse>("/auth/signup", userInfo).then((res) => {
    saveToken(res.data.token);
    return res.data;
  });
};
export const forgotPassword = ( data: IForgotPassword ): Promise<{ status: string; message: string }> => {
  return api.post("/auth/forgotPassword", data).then((res) => res.data);
};
export const verifyResetCode = (data: IVerifyResetCode): Promise<{ status: string }> => {
  return api.post("/auth/verifyResetCode", data).then((res) => res.data);
};
export const resetPassword = ( data: IResetPassword ): Promise<{ token: string }> => {
  return api.put("/auth/resetPassword", data).then((res) => {
    saveToken(res.data.token);
    return res.data;
  });
};
