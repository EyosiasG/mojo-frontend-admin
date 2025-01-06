import { useState } from 'react';
import { usersApi } from '@/api/users';
import Swal from 'sweetalert2';

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      console.log('Attempting to fetch users...');
      const sortedUsers = await usersApi.getAllUsers();
      setUsers(sortedUsers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Detailed error information:', {
        error: err,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const isConfirmed = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => result.isConfirmed);

    if (isConfirmed) {
      try {
        await usersApi.deleteUser(userId);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        await fetchUsers();
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      } catch (err) {
        setError(err.message);
        Swal.fire('Error!', 'Failed to delete user.', 'error');
      }
    }
  };

  const handleSearch = async () => {
    console.log("Search Query: ", searchQuery);
    try {
      const searchResults = await usersApi.searchUsers(searchQuery);
      setUsers(searchResults);
    } catch (err) {
      setError(err.message);
      alert("Failed to find user");
    }
  };

  return {
    users,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchUsers,
    handleDelete,
    handleSearch
  };
}; 