import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import type { User } from '../interfaces/userTypes';


const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<'user' | 'manager' | 'admin'>('user');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await userService.getUsers();
        setUsers(userList);
        setError('');
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!selectedUserId) return;
    try {
      await userService.deleteUser(selectedUserId);
      setUsers(users.filter(user => user._id !== selectedUserId));
      setSuccess('User deleted successfully');
      setError('');
      setIsDeleteDialogOpen(false);
      setSelectedUserId(null);
    } catch (err: any) {
      setError(err.message);
      setSuccess('');
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUserId) return;
    try {
      const formData = new FormData();
      formData.append('role', newRole);
      const updatedUser = await userService.updateUser(selectedUserId, formData);
      setUsers(users.map(user => user._id === selectedUserId ? updatedUser : user));
      setSuccess(`User role updated to ${newRole}`);
      setError('');
      setIsRoleDialogOpen(false);
      setSelectedUserId(null);
      setNewRole('user');
    } catch (err: any) {
      setError(err.message);
      setSuccess('');
    }
  };

  const openDeleteDialog = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const openRoleDialog = (userId: string, currentRole: 'user' | 'manager' | 'admin') => {
    setSelectedUserId(userId);
    setNewRole(currentRole);
    setIsRoleDialogOpen(true);
  };

  return (
    <div className="container-fluid bg-white rounded-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Users List</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <Link to="/users/create" className="bg-blue-500 text-white p-2 rounded mb-4 inline-block">
        Create New User
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {users.map(user => (
              <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{user.name}</td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-left">{user.phone || 'N/A'}</td>
                <td className="py-3 px-6 text-left">{user.role}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex justify-center space-x-2">
                    <Link
                      to={`/users/${user._id}/edit`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => openDeleteDialog(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openRoleDialog(user._id, user.role)}
                      className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                    >
                      Change Role
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Dialog */}
      {isRoleDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">Change User Role</h2>
            <div className="mb-4">
              <label htmlFor="role" className="block mb-2">New Role:</label>
              <select
                id="role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'user' | 'manager' | 'admin')}
                className="border p-2 w-full"
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsRoleDialogOpen(false)}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeRole}
                className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
              >
                Change Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;