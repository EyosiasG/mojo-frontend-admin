"use client";

import { useEffect, useState } from "react";
import NotificationProfile from "@/components/NotificationProfile";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreHorizontal,
  PlusCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { toast } from "react-toastify";

interface Role {
  id: string;
  name: string;
  guard_name: string;
  created_at: string;
  status: "active" | "inactive";
}

const Page = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetchWithAuth("https://mojoapi.crosslinkglobaltravel.com/api/roles");
        if (!response.ok) throw new Error("Failed to fetch roles");
        const data = await response.json();
        setRoles(data.data || []); // Provide default empty array if data.roles is undefined
      } catch (err) {
        const error = err as Error; // Type assertion
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleDelete = async (roleId: string) => {
    try {
      const response = await fetchWithAuth(
        `https://mojoapi.crosslinkglobaltravel.com/api/roles/${roleId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete role");
      }

      // Remove the deleted role from the state
      setRoles(roles.filter(role => role.id !== roleId));
      toast.success("Role deleted successfully");
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Role Management</h1>
        <NotificationProfile
          profileLink="/admin-dashboard/settings"
          notificationLink="/admin-dashboard/notifications"
        />
      </div>

      <div className="relative">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            {/* Search bar removed */}
          </div>
          <div className="flex items-center gap-2">
            {/* Removed Trash, Filter, and Export buttons */}
            <Link href="role-management/create-role">
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <PlusCircle className="h-4 w-4" />
                Create Role
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Table className="role-table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox />
            </TableHead>
            <TableHead>Role ID</TableHead>
            <TableHead>Role Name</TableHead>
            <TableHead>Guard Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles && roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{role.id}</TableCell>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.guard_name}</TableCell>
              <TableCell>{new Date(role.created_at).toLocaleDateString()}</TableCell>
             
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/admin-dashboard/role-management/view-role/${role.id}`}>
                      <DropdownMenuItem>View</DropdownMenuItem>
                    </Link>
                    <Link href={`/admin-dashboard/role-management/edit-role/${role.id}`}>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDelete(role.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="icon">
          {"<"}
        </Button>
        <Button variant="outline" size="icon">
          1
        </Button>
        <Button variant="outline" size="icon">
          2
        </Button>
        <Button variant="outline" size="icon">
          {">"}
        </Button>
      </div>
    </div>
  );
};

export default Page;
