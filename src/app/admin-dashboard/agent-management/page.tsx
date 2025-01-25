"use client";

import React, { useEffect, useState } from "react";
import {
  Download,
  Filter,
  MoreVertical,
  PlusCircle,
  Search,
  Trash2,
  ChevronDown,
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
import { fetchWithAuth } from "./../../../components/utils/fetchwitAuth";
import { format } from "date-fns";
import Swal from 'sweetalert2';
import { usersApi } from "@/api/users";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await usersApi.getAllAgents();
        console.log("Agents Retrieved: ", data); // Check the structure
        setUsers(data || []); // Adjust this line based on actual API response
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleSearch = async () => {
    console.log("Search Query: ", searchQuery);
    try {
      const data = await usersApi.searchUsers(searchQuery as string);
      if (!data || data.length === 0) {
        throw new Error('Agent not found');
      }
      setUsers(data);
    } catch (err) {
      setError(err.message);
      alert("Failed to find agent");
    }
  };

  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await usersApi.deleteUser(userId);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete agent.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 h-full">
      <div className="bg-blue-50">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl text-primary font-semibold">Agent Management</h1>
          <div className="flex items-center gap-4">
            <NotificationProfile
              profileLink="/admin-dashboard/settings"
              notificationLink="/admin-dashboard/notifications"
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg m-4">
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full md:w-auto bg-white">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              className="pl-10 w-full"
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
            <Link href="agent-management/create-agent" className="w-full md:w-auto">
              <Button className="gap-2 bg-primary hover:bg-primary/90 w-full">
                <PlusCircle className="h-4 w-4" />
                Create Agent
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 hidden md:table-cell">
                  <Checkbox />
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    Agent ID
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone no.</TableHead>
                <TableHead className="hidden md:table-cell">Created At</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="10" className="text-center">
                    No transactions
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="hidden md:table-cell">
                        <Checkbox />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.id}</TableCell>
                      <TableCell>{user.first_name}</TableCell>
                      <TableCell>{user.last_name}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.phone}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.created_at
                          ? format(new Date(user.created_at), "MMMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`agent-management/view-agent/${user.id}`}
                                className="w-full"
                              >
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`agent-management/edit-agent/${user.id}`}
                                className="w-full"
                              >
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(user.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          {users.length > 0 ? (
            <div className="flex items-center justify-between px-4 py-4 flex-wrap">
              <div className="text-sm text-gray-500 w-full text-center md:text-left md:w-auto">
                Showing 1 to 10 of {users.length} results
              </div>
            </div>
          ) : (
            <div className="text-red-500 text-center py-4">No Agents found!</div>
          )}
        </div>
      </div>
    </div>
  );
}
