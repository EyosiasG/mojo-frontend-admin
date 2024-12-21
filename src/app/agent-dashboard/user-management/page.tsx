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

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        console.log('Attempting to fetch users...');
        const response = await fetchWithAuth(
          "https://mojoapi.siltet.com/api/users"
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
        setUsers(data.users);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('Detailed error information:', {
          error: err,
          timestamp: new Date().toISOString(),
          endpoint: "https://mojoapi.siltet.com/api/users"
        });
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Function to delete a user
  const handleDelete = async (userId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (isConfirmed) {
      try {
        const response = await fetchWithAuth(
          `https://mojoapi.siltet.com/api/users/${userId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Remove the deleted user from the list
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        alert("User deleted successfully");
      } catch (err) {
        setError(err.message);
        alert("Failed to delete user");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-semibold">User Management</h1>
          <div className="flex items-center gap-4">
            <NotificationProfile
              profileLink="/agent-dashboard/settings"
              notificationLink="/agent-dashboard/notifications"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input className="pl-10" placeholder="Search" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Link href="user-management/create-user">
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <PlusCircle className="h-4 w-4" />
                Create User
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    User ID
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, i) => (
                <TableRow key={user.id || i}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {user.created_at
                      ? format(new Date(user.created_at), "MMMM d, yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "active" ? "success" : "warning"}
                      className="capitalize"
                    >
                      {user.status || "unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`user-management/view-user/${user.id}`}
                            className="w-full"
                          >
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`user-management/edit-user/${user.id}`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleDelete(user.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
