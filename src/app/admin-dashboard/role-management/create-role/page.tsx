"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import BackLink from "@/components/BackLink";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Permission {
  id: string;
  name: string;
  enabled: boolean;
}

export default function Page() {
  const router = useRouter();
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const response = await fetchWithAuth(
          `https://mojoapi.crosslinkglobaltravel.com/api/roles/create`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch permissions");
        }

        const data = await response.json();

        // Transform permissions data
        const mappedPermissions = data.data.map((perm: any) => ({
          id: perm.id,
          name: perm.name,
          enabled: false
        }));

        setPermissions(mappedPermissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast.error("Failed to load permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchRoleData();
  }, []);

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
    if (!roleName.trim()) {
      toast.error("Role name is required");
      return;
    }

    try {
      const enabledPermissions = permissions
        .filter(p => p.enabled)
        .map(p => p.id);

      if (enabledPermissions.length === 0) {
        toast.error("Please select at least one permission");
        return;
      }

      const response = await fetchWithAuth(
        "https://mojoapi.crosslinkglobaltravel.com/api/roles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: roleName,
            permission: enabledPermissions,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create role");
      }

      toast.success("Role created successfully");
      router.push("/admin-dashboard/role-management");
    } catch (error: any) {
      console.error("Error creating role:", error);
      toast.error(error.message || "Failed to create role");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex flex-col sm:flex-row items-center justify-between border-b p-4 gap-4">
        <div className="flex items-center gap-4">
          <BackLink>
            <ArrowLeft className="h-4 w-4" />
          </BackLink>
          <h1 className="text-lg font-semibold">Add New Role</h1>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button className="flex-1 sm:flex-initial" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button className="flex-1 sm:flex-initial" onClick={handleSubmit}>Submit</Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
          Fill in the information
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
                    onCheckedChange={() =>
                      handlePermissionChange(permission.id)
                    }
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
