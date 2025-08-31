import type { IAuthResponse } from "../interfaces/IAuthResponse";
import type { IForgotPassword, ILogin, IRegister, IResetPassword, IVerifyResetCode } from "../interfaces/Auth";
import api from "./api";
import Cookies from "js-cookie";

// Save token to cookie
const saveToken = (token: string) => {
  Cookies.set("token", token, { expires: 7, secure: true, sameSite: "Strict" });
};

// Check if user is logged in
export const isLoggedIn = (): boolean => !!Cookies.get("token");

// Logout
export const logoutUser = () => Cookies.remove("token");

// Login
export const loginUser = (credentials: ILogin): Promise<IAuthResponse> => {
  return api.post<IAuthResponse>("/auth/login", credentials)
    .then(res => {
      saveToken(res.data.token);
      return res.data;
    });
};

// Register / Signup
export const registerUser = (userInfo: IRegister): Promise<IAuthResponse> => {
  return api.post<IAuthResponse>("/auth/signup", userInfo)
    .then(res => {
      saveToken(res.data.token);
      return res.data;
    });
};

// Forgot Password
export const forgotPassword = (data: IForgotPassword): Promise<{ status: string; message: string }> => {
  return api.post("/auth/forgotPassword", data).then(res => res.data);
};

// Verify Reset Code
export const verifyResetCode = (data: IVerifyResetCode): Promise<{ status: string }> => {
  return api.post("/auth/verifyResetCode", data).then(res => res.data);
};

// Reset Password
export const resetPassword = (data: IResetPassword): Promise<{ token: string }> => {
  return api.put("/auth/resetPassword", data)
    .then(res => {
      saveToken(res.data.token);
      return res.data;
    });
};
