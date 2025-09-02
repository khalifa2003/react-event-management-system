import { isLoggedIn } from "./auth.service";

export const useAuth = () => {
  const isAuthenticated = isLoggedIn();
  return { isAuthenticated };
};
