import api from "../../../core/services/api";
import type { ChangePasswordData, UpdateUserData, User } from "../interfaces/userTypes";

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data.data;
  },
  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },
  createUser: async (userData: FormData): Promise<User> => {
    const response = await api.post("/users", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
    
  },
  updateUser: async (id: string, userData: FormData): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },
  changeUserPassword: async ( id: string, passwordData: ChangePasswordData ): Promise<User> => {
    const response = await api.put(`/users/changePassword/${id}`,passwordData);
    return response.data.data;
  },
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
  getLoggedUserData: async (): Promise<User> => {
    const response = await api.get("/users/getMe");
    return response.data.data;
  },
  updateLoggedUserPassword: async ( passwordData: ChangePasswordData ): Promise<{ data: User; token: string }> => {
    const response = await api.put("/users/changeMyPassword", passwordData);
    return response.data;
  },
  updateLoggedUserData: async (userData: UpdateUserData): Promise<User> => {
    const response = await api.put("/users/updateMe", userData);
    return response.data.data;
  },
  deleteLoggedUserData: async (): Promise<void> => {
    await api.delete("/users/deleteMe");
  },
};
