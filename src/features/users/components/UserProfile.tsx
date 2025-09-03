import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { addressService } from '../services/addressService';
import type { User, UpdateUserData, AddressData, Address } from '../interfaces/userTypes';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [formData, setFormData] = useState<UpdateUserData>({});
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [, setCurrentAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<AddressData>({ alias: '', details: '', phone: '', city: '', postalCode: '' });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedUser, fetchedAddresses] = await Promise.all([ userService.getLoggedUserData(), addressService.getLoggedUserAddresses() ]);
        setUser(fetchedUser);
        setAddresses(fetchedAddresses);
        setFormData({ name: fetchedUser.name, email: fetchedUser.email, phone: fetchedUser.phone || '' });
        setError('');
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('An unknown error occurred');
      }
    };
    fetchData();
  }, []);
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    if (formData.name) data.append('name', formData.name);
    if (formData.email) data.append('email', formData.email);
    if (formData.phone) data.append('phone', formData.phone);
    if (profileImg) {
      if (profileImg.size > 5 * 1024 * 1024) {
        setError('Image size exceeds 5MB limit');
        return;
      }
      data.append('profileImg', profileImg);
    }
    try {
      const updatedUser = await userService.updateLoggedUserData(formData);
      setUser(updatedUser);
      setSuccess('Profile updated successfully');
      setError('');
      setProfileImg(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message.includes('Image') ? 'Failed to upload image. Please try a smaller file or check server configuration.' : err.message);
      else setError('An unknown error occurred');
      setSuccess(''); 
    }
  };
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }
    try {
      const result = await userService.updateLoggedUserPassword({ password });
      setUser(result.data);
      setSuccess('Password updated successfully');
      setError('');
      setPassword('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setSuccess('');
    }
  };
  const handleAddAddress = async () => {
    if (!newAddress.alias || !newAddress.details || !newAddress.phone || !newAddress.city || !newAddress.postalCode) {
      setError('All address fields are required');
      return;
    }
    try {
      const updatedAddresses = await addressService.addAddress(newAddress);
      setAddresses(updatedAddresses);
      setSuccess('Address added successfully');
      setError('');
      setIsAddressDialogOpen(false);
      setNewAddress({ alias: '', details: '', phone: '', city: '', postalCode: '' });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
      setSuccess('');
    }
  };
  const handleDeleteAddress = async (addressId: string) => {
    try {
      const updatedAddresses = await addressService.removeAddress(addressId);
      setAddresses(updatedAddresses);
      setSuccess('Address deleted successfully');
      setError('');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
      setSuccess('');
    }
  };
  const openAddressDialog = () => {
    setCurrentAddress(null);
    setNewAddress({ alias: '', details: '', phone: '', city: '', postalCode: '' });
    setIsAddressDialogOpen(true);
  };
  if (!user) return <div className="text-center p-4">Loading...</div>;
  return (
    <div className="container-fluid bg-white mx-auto p-4 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      {/* Profile Information */}
      <div className="shadow-md rounded p-4 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2">Name:</label>
            <input type="text" id="name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="border p-2 w-full rounded"/>
          </div>
          <div>
            <label htmlFor="email" className="block mb-2">Email:</label>
            <input type="email" id="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="border p-2 w-full rounded"/>
          </div>
          <div>
            <label htmlFor="phone" className="block mb-2">Phone:</label>
            <input type="text" id="phone" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="border p-2 w-full rounded" />
          </div>
          <div>
            <label htmlFor="profileImg" className="block mb-2">Profile Image (Max 5MB):</label>
            <input type="file" id="profileImg" accept="image/*" onChange={(e) => setProfileImg(e.target.files ? e.target.files[0] : null)} className="border p-2 w-full rounded"/>
            {user.profileImg && <p className="mt-2">Current Image: {user.profileImg}</p>}
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Update Profile</button>
        </form>
      </div>
      {/* Password Update */}
      <div className="shadow-md rounded p-4 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label htmlFor="password" className="block mb-2">New Password:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="border p-2 w-full rounded"/>
          </div>
          <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Change Password</button>
        </form>
      </div>
      {/* Addresses */}
      <div className="shadow-md rounded p-4">
        <h2 className="text-2xl font-semibold mb-4">Addresses</h2>
        <button onClick={openAddressDialog} className="bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600">Add New Address</button>
        {addresses.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Alias</th>
                <th className="py-3 px-6 text-left">Details</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">City</th>
                <th className="py-3 px-6 text-left">Postal Code</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {addresses.map(addr => (
                <tr key={addr._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{addr.alias}</td>
                  <td className="py-3 px-6 text-left">{addr.details}</td>
                  <td className="py-3 px-6 text-left">{addr.phone}</td>
                  <td className="py-3 px-6 text-left">{addr.city}</td>
                  <td className="py-3 px-6 text-left">{addr.postalCode}</td>
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => handleDeleteAddress(addr._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No addresses added yet.</p>
        )}
      </div>
      {/* Address Dialog */}
      {isAddressDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Address</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="alias" className="block mb-2">Alias:</label>
                <input type="text" id="alias" value={newAddress.alias} onChange={(e) => setNewAddress({ ...newAddress, alias: e.target.value })} required className="border p-2 w-full rounded"/>
              </div>
              <div>
                <label htmlFor="details" className="block mb-2">Details:</label>
                <input type="text" id="details" value={newAddress.details} onChange={(e) => setNewAddress({ ...newAddress, details: e.target.value })} required className="border p-2 w-full rounded" />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2">Phone:</label>
                <input type="text" id="phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} required className="border p-2 w-full rounded"/>
              </div>
              <div>
                <label htmlFor="city" className="block mb-2">City:</label>
                <input type="text" id="city" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required className="border p-2 w-full rounded"/>
              </div>
              <div>
                <label htmlFor="postalCode" className="block mb-2">Postal Code:</label>
                <input type="text" id="postalCode" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} required className="border p-2 w-full rounded"/>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setIsAddressDialogOpen(false)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">Cancel</button>
              <button onClick={handleAddAddress} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Address</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;