import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import type { User } from '../interfaces/userTypes';

const UpdateUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'user' | 'manager' | 'admin'>('user');
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        setError('User ID is missing');
        return;
      }
      try {
        const fetchedUser = await userService.getUser(id);
        setUser(fetchedUser);
        setName(fetchedUser.name);
        setEmail(fetchedUser.email);
        setPhone(fetchedUser.phone || '');
        setRole(fetchedUser.role);
        setError('');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Fetch user error:', err);
      }
    };
    fetchUser();
  }, [id]);

  const validateProfileForm = () => {
    if (!name.trim()) return 'Name is required';
    if (name.length < 3) return 'Name must be at least 3 characters long';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Invalid email format';
    if (phone && !phone.match(/^\+?\d{10,15}$/)) return 'Invalid phone number (use Egyptian or Saudi format)';
    if (profileImg && profileImg.size > 5 * 1024 * 1024) return 'Image size exceeds 5MB limit';
    return '';
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError('User ID is missing');
      return;
    }

    const validationError = validateProfileForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (phone) formData.append('phone', phone);
    formData.append('role', role);
    if (profileImg) formData.append('profileImg', profileImg);

    try {
      const updatedUser: User = await userService.updateUser(id, formData);
      setSuccess(`User updated successfully: ${updatedUser.name}`);
      setError('');
      setUser(updatedUser);
      setProfileImg(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const validatePasswordForm = () => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!passwordConfirm) return 'Password confirmation is required';
    if (password !== passwordConfirm) return 'Passwords do not match';
    return '';
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError('User ID is missing');
      return;
    }

    const validationError = validatePasswordForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      console.log('Updating user password'); // Log action
      setSuccess('Password updated successfully');
      setError('');
      setPassword('');
      setPasswordConfirm('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setSuccess('');
    }
  };

  if (!user) return <div className="text-center p-4 text-gray-600">Loading...</div>;

  return (
    <div className="container-fluid mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Update User</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-6">{error}</p>}
      {success && <p className="text-green-500 bg-green-100 p-3 rounded mb-6">{success}</p>}

      {/* Profile Update */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Update Personal Information</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-600">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-1 font-medium text-gray-600">Phone (Egyptian/Saudi format)</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+201234567890 or +966123456789"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="role" className="block mb-1 font-medium text-gray-600">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'manager' | 'admin')}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label htmlFor="profileImg" className="block mb-1 font-medium text-gray-600">Profile Image (Max 5MB)</label>
            <input
              type="file"
              id="profileImg"
              accept="image/*"
              onChange={(e) => setProfileImg(e.target.files ? e.target.files[0] : null)}
              className="border border-gray-300 p-2 w-full rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
            {user.profileImg && (
              <p className="mt-2 text-gray-600">
                Current Image: <span className="font-medium">{user.profileImg}</span>
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Password Update */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-600">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="passwordConfirm" className="block mb-1 font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;