"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { useRouter } from "next/navigation";
import BackLink from "@/components/BackLink";
import { toast } from "react-toastify";

interface Permission {
  id: string;
  name: string;
  enabled: boolean;
}

interface Role {
  id: string;
  name: string;
  status: string;
  permissions: Permission[];
}

export default function Page({ params }: { params: { roleId: string } }) {
  const router = useRouter();
  const roleId = use(params).roleId;
  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const response = await fetchWithAuth(
          `https://mojoapi.crosslinkglobaltravel.com/api/roles/${roleId}/edit`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch role");
        }

        const data = await response.json();
        setRoleName(data.role.name);
        setStatus(data.role.status || "active");

        // Transform permissions data
        const mappedPermissions = data.permissions.map((perm: any) => ({
          id: perm.id.toString(),
          name: perm.name,
          enabled: Object.keys(data.rolePermissions).includes(perm.id.toString())
        }));

        setPermissions(mappedPermissions);
      } catch (error) {
        console.error("Error fetching role:", error);
        toast.error("Failed to load role data");
      } finally {
        setLoading(false);
      }
    };

    fetchRoleData();
  }, [roleId]);

  const handlePermissionChange = (id: string) => {
    setPermissions(
      permissions.map((permission) =>
        permission.id === id
          ? { ...permission, enabled: !permission.enabled }
          : permission
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const enabledPermissions = permissions
        .filter(p => p.enabled)
        .map(p => p.id); // Changed from p.id to p.name

      const token = localStorage.getItem("access_token");
      const response = await fetchWithAuth(
        `https://mojoapi.crosslinkglobaltravel.com/api/roles/${roleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: roleName,
            status: status,
            permission: enabledPermissions,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      toast.success("Role updated successfully");
      router.push("/admin-dashboard/role-management");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex flex-col sm:flex-row items-center justify-between border-b p-4 gap-4">
        <div className="flex items-center gap-4">
          <BackLink href="/admin-dashboard/role-management">
            <ArrowLeft className="h-4 w-4" />
          </BackLink>
          <h1 className="text-lg font-semibold">Edit Role</h1>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button className="flex-1 sm:flex-initial" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button className="flex-1 sm:flex-initial" onClick={handleSubmit}>Save Changes</Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
          Update role information
        </p>

        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="role-name">Role Name</Label>
            <Input 
              id="role-name" 
              placeholder="Enter role name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Label>Permissions</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center justify-between p-2 sm:p-3 border rounded"
                >
                  <Label htmlFor={permission.id} className="cursor-pointer text-sm">
                    {permission.name}
                  </Label>
                  <Switch
                    id={permission.id}
                    checked={permission.enabled}
                    onCheckedChange={() => handlePermissionChange(permission.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
