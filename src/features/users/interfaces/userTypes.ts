export interface User {
  _id: string;
  name: string;
  slug?: string;
  email: string;
  phone?: string;
  profileImg?: string;
  role: "user" | "manager" | "admin";
  active?: boolean;
  addresses?: Array<{
    _id: string;
    alias: string;
    details: string;
    phone: string;
    city: string;
    postalCode: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordData {
  password: string;
}

export interface AddressData {
  alias: string;
  details: string;
  phone: string;
  city: string;
  postalCode: string;
}
export interface Address {
  _id: string;
  alias: string;
  details: string;
  phone: string;
  city: string;
  postalCode: string;
}
