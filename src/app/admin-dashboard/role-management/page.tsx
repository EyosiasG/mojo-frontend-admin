// "use client";
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
  Download,
  Filter,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface Role {
  id: string;
  name: string;
  users: number;
  created: string;
  status: "active" | "inactive";
}

const roles: Role[] = [
  {
    id: "001",
    name: "Admin",
    users: 12,
    created: "Nov 13,2024",
    status: "active",
  },
  {
    id: "001",
    name: "Cashier",
    users: 1,
    created: "Nov 13,2024",
    status: "active",
  },
  {
    id: "001",
    name: "Support",
    users: 1,
    created: "Nov 13,2024",
    status: "active",
  },
  {
    id: "001",
    name: "Viewer",
    users: 1,
    created: "Nov 13,2024",
    status: "active",
  },
];
const page = () => {
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
            <TableHead>Number of users</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id + role.name}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{role.id}</TableCell>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.users}</TableCell>
              <TableCell>{role.created}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Active
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
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
      {/* <style jsx>{`
      .role-table :global(td),
      .role-table :global(th) {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }
    `}</style> */}
    </div>
  );
};

export default page;
