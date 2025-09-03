import api from "../../../core/services/api";
import type { Address, AddressData } from "../interfaces/userTypes";



export const addressService = {
  getLoggedUserAddresses: async (): Promise<Address[]> => {
    const response = await api.get('/addresses');
    return response.data.data;
  },

  addAddress: async (addressData: AddressData): Promise<Address[]> => {
    const response = await api.post('/addresses', addressData);
    return response.data.data;
  },

  removeAddress: async (addressId: string): Promise<Address[]> => {
    const response = await api.delete(`/addresses/${addressId}`);
    return response.data.data;
  },
};