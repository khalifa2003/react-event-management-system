import React, { useState } from 'react';
import { userService } from '../services/userService';
import type { User } from '../interfaces/userTypes';

const CreateUser: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'user' | 'manager' | 'admin'>('user');
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    if (!name.trim()) return 'Name is required';
    if (name.length < 3) return 'Name must be at least 3 characters long';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Invalid email format';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!passwordConfirm) return 'Password confirmation is required';
    if (password !== passwordConfirm) return 'Passwords do not match';
    if (phone && !phone.match(/^\+?\d{10,15}$/)) return 'Invalid phone number (use Egyptian or Saudi format)';
    if (profileImg && profileImg.size > 5 * 1024 * 1024) return 'Image size exceeds 5MB limit';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('passwordConfirm', passwordConfirm);
    if (phone) formData.append('phone', phone);
    formData.append('role', role);
    if (profileImg) formData.append('profileImg', profileImg);

    try {
      console.log('Sending create user request with:', { name, email, password, passwordConfirm, phone, role }); // Log payload
      const newUser: User = await userService.createUser(formData);
      setSuccess(`User created successfully: ${newUser.name}`);
      setError('');
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      setPhone('');
      setRole('user');
      setProfileImg(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.errors
        ? err.response.data.errors.map((e: any) => e.msg).join('; ')
        : err.message.includes('Image')
        ? 'Failed to upload image. Please try a smaller file or check server configuration.'
        : err.message.includes('E-mail already in user')
        ? 'Email already exists. Please use a different email.'
        : err.message;
      setError(errorMessage);
      setSuccess('');
      console.error('Create user error:', err.response?.data || err); // Log error
    }
  };

  return (
    <div className="container-fluid bg-white p-4 rounded-lg min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Create New User</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-4">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="passwordConfirm" className="block mb-2">Confirm Password:</label>
          <input
            type="password"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-2">Phone (Egyptian/Saudi format):</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+201234567890 or +966123456789"
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block mb-2">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'user' | 'manager' | 'admin')}
            className="border p-2 w-full rounded"
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="profileImg" className="block mb-2">Profile Image (Max 5MB):</label>
          <input
            type="file"
            id="profileImg"
            accept="image/*"
            onChange={(e) => setProfileImg(e.target.files ? e.target.files[0] : null)}
            className="border p-2 w-full rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUser;