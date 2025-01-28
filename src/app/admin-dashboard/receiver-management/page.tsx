"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  Download,
  Filter,
  MoreVertical,
  PlusCircle,
  Search,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/badge";
import Link from "next/link";
import NotificationProfile from "@/components/NotificationProfile";
import { format } from "date-fns";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import Swal from 'sweetalert2';

export default function ReceiverManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


  // Function to fetch users
  const fetchUsers = async () => {
    try {
      console.log('Attempting to fetch users...');
      const response = await fetchWithAuth(
        "https://mojoapi.crosslinkglobaltravel.com/api/admin/receivers"
      ).catch(error => {
        console.error('Network error:', error);
        throw new Error('Network connection failed - please check your internet connection');
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.users) {
        console.warn('No users data in response:', data);
        throw new Error('Invalid response format from server');
      }

      // Sort users by registration date (created_at) in descending order (newest first)
      const sortedUsers = data.users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setUsers(sortedUsers); // Set the sorted users
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);

      console.error('Detailed error information:', {
        error: err,
        timestamp: new Date().toISOString(),
        endpoint: "https://mojoapi.crosslinkglobaltravel.com/api/admin/receivers"
      });
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchUsers(); // Call the fetchUsers function here
  }, []);

  // Function to delete a user
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
        const response = await fetchWithAuth(
          `https://mojoapi.crosslinkglobaltravel.com/api/users/${userId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Remove the deleted user from the list
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        await fetchUsers(); // Regenerate the user list after deletion
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      } catch (err) {
        setError(err.message);
        Swal.fire('Error!', 'Failed to delete user.', 'error');
      }
    }
  };

  // Function to handle search
  const handleSearch = async () => {
    console.log("Search Query: ", searchQuery);
    try {
      const response = await fetchWithAuth(
        `https://mojoapi.crosslinkglobaltravel.com/api/users/search/${searchQuery}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Search Users: ", data.data);
      if (!data.data || data.data.length === 0) {
        throw new Error('User not found');
      }
      setUsers(data.data); // Set users state with the array directly
    } catch (err) {
      setError(err.message);
      alert("Failed to find user");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="bg-blue-50">
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <h1 className="text-xl text-primary font-semibold md:text-xl ml-8 mb-3 sm:mb-0">Receiver Management</h1>
          <div className="flex w-full sm:w-auto justify-center sm:justify-end gap-4">
            <NotificationProfile
              profileLink="/agent-dashboard/settings"
              notificationLink="/agent-dashboard/notifications"
            />
          </div>
        </div>
      </div>


      <div className="p-6 m-4">
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              className="pl-10 w-full bg-white"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value.trim();
                setSearchQuery(value);
              }}
            />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
            <Button variant="outline" className="gap-2 w-full md:w-auto" onClick={handleSearch}>
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 hidden md:table-cell">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          Receiver ID
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead className="hidden md:table-cell">Bank</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Phone Number</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, i) => (
                      <TableRow
                        key={user.id || i}
                        className="border-b last:border-b-0"
                      >
                        <TableCell className="hidden md:table-cell">
                          <Checkbox />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {user.id}
                        </TableCell>
                        <TableCell>
                          {user.name}
                        </TableCell>
                        <TableCell>
                          {user.account_number}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {user.phone}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {user.phone_number}
                        </TableCell> 
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {users.length > 0 ? (
            <div className="flex items-center justify-between px-4 py-4 flex-wrap">
              <div className="text-sm text-gray-500 w-full text-center md:text-left md:w-auto">
                Showing 1 to 10 of {users.length} results
              </div>
            </div>
          ) : (
            <div className="text-red-500 text-center py-4">No Receivers found!</div>
          )}
        </div>
      </div>
    </div>
  );
}
