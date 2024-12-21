import { ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import BackLink from "@/components/BackLink";

export default function RoleView() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <BackLink>
            <ArrowLeft className="h-4 w-4" />
          </BackLink>

          <h1 className="text-lg font-semibold">Edit Role</h1>
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              View Information
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Role Name
                </h3>
                <p className="text-base">Admin</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Status
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              Permissions
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="create-user" className="text-sm">
                  Create User
                </label>
                <Switch id="create-user" disabled />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="view-user" className="text-sm">
                  View User
                </label>
                <Switch id="view-user" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="view-transaction" className="text-sm">
                  View Transaction
                </label>
                <Switch id="view-transaction" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="create-role" className="text-sm">
                  Create Role
                </label>
                <Switch id="create-role" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="view-role" className="text-sm">
                  View Role
                </label>
                <Switch id="view-role" defaultChecked />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
