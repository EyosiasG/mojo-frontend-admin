"use client";

import { ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import BackLink from "@/components/BackLink";
import { useEffect, useState, use } from "react";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!roleData) return <div>Role not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <BackLink>
            <ArrowLeft className="h-4 w-4" />
          </BackLink>

          <h1 className="text-lg font-semibold">View Role</h1>
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              Role Information
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Role Name
                </h3>
                <p className="text-base">{roleData.role.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Guard Name
                </h3>
                <p className="text-base">{roleData.role.guard_name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Created At
                </h3>
                <p className="text-base">{new Date(roleData.role.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              Permissions
            </h2>

            <div className="space-y-4">
              {roleData.permissions.map((permission) => (
                <div key={permission.id} className="flex items-center justify-between">
                  <label htmlFor={permission.id.toString()} className="text-sm">
                    {permission.name}
                  </label>
                  <Switch 
                    id={permission.id.toString()}
                    checked={permission.enabled}
                    disabled
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
