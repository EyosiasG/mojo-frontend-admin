"use client";

import React, { useEffect, useState } from "react";
import {
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
import { fetchWithAuth } from "./../../../components/utils/fetchwitAuth";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetchWithAuth(
          "https://mojoapi.grandafricamarket.com/api/users"
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data); // Check the structure
        setUsers(data.users || []); // Adjust this line based on actual API response
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-semibold">User Management</h1>
          <div className="flex items-center gap-4">
            <NotificationProfile
              profileLink="/admin-dashboard/settings"
              notificationLink="/admin-dashboard/notifications"
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
            <Link href="agent-management/create-agent">
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <PlusCircle className="h-4 w-4" />
                Create Agent
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
                <TableHead>Agent ID</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone no.</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
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
                  const formattedDate = new Date(
                    user.created_at
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  });
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>{user.Id}</TableCell>
                      <TableCell>{user.first_name}</TableCell>
                      <TableCell>{user.last_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{formattedDate}</TableCell>{" "}
                      {/* Display the formatted date here */}
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active" ? "success" : "warning"
                          }
                          className="capitalize"
                        >
                          {user.status}
                        </Badge>
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
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm text-gray-500">
              Showing 1 to 10 of 97 results
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                First
              </Button>
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-primary text-white"
              >
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <div className="px-2">...</div>
              <Button variant="outline" size="sm">
                10
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
              <Button variant="outline" size="sm">
                Last
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
