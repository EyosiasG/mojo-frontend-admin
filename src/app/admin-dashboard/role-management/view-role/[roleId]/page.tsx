"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import BackLink from "@/components/BackLink";
import { useEffect, useState, use } from "react";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  enabled?: boolean;
}

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

interface RoleData {
  role: Role;
  permissions: Permission[];
  rolePermissions: string[];
}

export default function RoleView({ params }: { params: { roleId: string } }) {
  const unwrappedParams = use(params);
  const [roleData, setRoleData] = useState<RoleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetchWithAuth(
          `https://mojoapi.crosslinkglobaltravel.com/api/roles/${unwrappedParams.roleId}/edit`
        );
        if (!response.ok) throw new Error("Failed to fetch role");
        const data = await response.json();
        
        // Transform the data to match our interface
        const transformedData: RoleData = {
          role: data.role,
          permissions: data.permissions.map((perm: Permission) => ({
            ...perm,
            enabled: Object.keys(data.rolePermissions).includes(perm.id.toString())
          })),
          rolePermissions: Object.keys(data.rolePermissions)
        };

        setRoleData(transformedData);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [unwrappedParams.roleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading role details...</p>
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;
  if (!roleData) return <div>Role not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="flex flex-col sm:flex-row items-center justify-between border-b p-4 gap-4">
        <div className="flex items-center gap-4">
          <BackLink href="/admin-dashboard/role-management">
            <ArrowLeft className="h-4 w-4" />
          </BackLink>
          <h1 className="text-lg font-semibold">View Role</h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
          Role information
        </p>

        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label>Role Name</Label>
            <Input 
              value={roleData.role.name}
              disabled
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Label>Permissions</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {roleData.permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center justify-between p-2 sm:p-3 border rounded"
                >
                  <Label htmlFor={permission.id.toString()} className="cursor-pointer text-sm">
                    {permission.name}
                  </Label>
                  <Switch 
                    id={permission.id.toString()}
                    checked={permission.enabled}
                    disabled
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
