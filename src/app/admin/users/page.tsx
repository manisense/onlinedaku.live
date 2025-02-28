'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loader from '@/components/ui/Loader';
import { confirmDelete, confirmStatusChange } from '@/utils/confirmDialog';
import UserModal from './components/UserModal';
import Pagination from '../deals/components/Pagination';
import UsersFilter from './components/UsersFilter';
import UserStatsSection from './components/UserStatsSection';

interface User {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

// For creating users
type NewUserData = {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
};

// For updating users
type UpdateUserData = Partial<Omit<User, '_id' | 'createdAt'>> & { password?: string };

interface FilterState {
  search: string;
  status: string;
  dateRange: string;
}

interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'createdAt',
    order: 'desc'
  });
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setFilteredUsers(data.users);
      setPagination({
        currentPage: data.pagination.page,
        totalPages: data.pagination.totalPages,
        totalUsers: data.pagination.totalUsers
      });
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    const confirmed = await confirmStatusChange(
      currentStatus ? 'deactivate' : 'activate',
      'user'
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive: !currentStatus } : user
      ));
      setFilteredUsers(filteredUsers.map(user => 
        user._id === userId ? { ...user, isActive: !currentStatus } : user
      ));
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update user status');
    }
  };

  const handleAddUser = async (userData: NewUserData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const { user } = await response.json();
      
      // Update users list
      setUsers(prevUsers => [user, ...prevUsers]);
      setFilteredUsers(prevUsers => [user, ...prevUsers]);
      setShowModal(false);
      toast.success('User added successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add user');
      throw err;
    }
  };

  const handleEditUser = async (userData: UpdateUserData) => {
    if (!selectedUser) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Refresh users list
      fetchUsers();
      setShowModal(false);
      setSelectedUser(null);
      toast.success('User updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update user');
      throw err;
    }
  };

  const handleDelete = async (userId: string) => {
    const confirmed = await confirmDelete('user');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast.success('User deleted successfully');
      setUsers(users.filter(user => user._id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete user');
    }
  };

  const filterUsers = (users: User[], filters: FilterState) => {
    return users.filter(user => {
      const matchesSearch = !filters.search || 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = filters.status === 'All' || 
        (filters.status === 'Active' ? user.isActive : !user.isActive);

      // Add date range filter implementation if needed
      
      return matchesSearch && matchesStatus;
    });
  };

  const handleFilterChange = (filters: FilterState) => {
    setFilteredUsers(filterUsers(users, filters));
  };

  const handleSort = (field: string) => {
    const newOrder = sortConfig.field === field && sortConfig.order === 'asc' ? 'desc' : 'asc';
    setSortConfig({ field, order: newOrder });
    
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (field === 'name') {
        return newOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (field === 'email') {
        return newOrder === 'asc'
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      }
      if (field === 'createdAt') {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return newOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    
    setFilteredUsers(sortedUsers);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="large" text="Loading users data..." />
      </div>
    );
  }

  // Calculate pagination
  const indexOfLastUser = pagination.currentPage * 10;
  const indexOfFirstUser = indexOfLastUser - 10;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Users Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all registered users of the platform
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              setSelectedUser(null);
              setShowModal(true);
            }}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FaPlus className="mr-2" /> Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Section */}
      <UserStatsSection />

      <UsersFilter onFilterChange={handleFilterChange} />

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(filteredUsers.map(user => user._id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Name
                        {sortConfig.field === 'name' ? (
                          sortConfig.order === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                        ) : (
                          <FaSort className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">
                        Email
                        {sortConfig.field === 'email' ? (
                          sortConfig.order === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                        ) : (
                          <FaSort className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Verified</th>
                    <th 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center">
                        Joined
                        {sortConfig.field === 'createdAt' ? (
                          sortConfig.order === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                        ) : (
                          <FaSort className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Active</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user._id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <button
                          onClick={() => handleStatusToggle(user._id, user.isActive)}
                          className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                            user.isVerified
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(page) => {
          setPagination(prev => ({ ...prev, currentPage: page }));
        }}
      />

      <UserModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        onSubmit={selectedUser ? 
          (userData: UpdateUserData) => handleEditUser(userData) : 
          (userData: NewUserData) => handleAddUser(userData)
        }
        user={selectedUser}
      />
    </div>
  );
}
