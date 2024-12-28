// "use client";

// import { useState } from "react";
// import { ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { fetchWithAuth } from "@/components/utils/fetchwitAuth";

// interface Permission {
//   id: string;
//   name: string;
//   enabled: boolean;
// }

// async function fetchRoles() {
//   const response = await fetchWithAuth("https://mojoapi.crosslinkglobaltravel.com/api/admin/roles");
//   if (!response.ok) throw new Error('Failed to fetch roles');
//   return response.json();
// }



// export default function Page() {
//   const [permissions, setPermissions] = useState<Permission[]>([
//     { id: "create-user", name: "Create User", enabled: false },
//     { id: "view-user", name: "View User", enabled: true },
//     { id: "view-transaction", name: "View Transaction", enabled: true },
//     { id: "create-role", name: "Create Role", enabled: true },
//     { id: "view-role", name: "View Role", enabled: true },
//   ]);

//   const handlePermissionChange = (id: string) => {
//     setPermissions(
//       permissions.map((permission) =>
//         permission.id === id
//           ? { ...permission, enabled: !permission.enabled }
//           : permission
//       )
//     );
//   };

//   return (
//     <div className=" bg-background">
//       <header className="flex items-center justify-between border-b p-4">
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" size="icon">
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <h1 className="text-lg font-semibold">Edit Role</h1>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="ghost">Cancel</Button>
//           <Button>Submit</Button>
//         </div>
//       </header>

//       <div className="mx-auto max-w-2xl p-6">
//         <p className="text-sm text-muted-foreground mb-6">
//           Fill in the information
//         </p>

//         <div className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="role-name">Role Name</Label>
//             <Input id="role-name" placeholder="Enter role name" />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="status">Status</Label>
//             <Select>
//               <SelectTrigger id="status">
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="inactive">Inactive</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-4">
//             <Label>Permissions</Label>
//             <div className="space-y-4">
//               {permissions.map((permission) => (
//                 <div
//                   key={permission.id}
//                   className="flex items-center justify-between"
//                 >
//                   <Label htmlFor={permission.id} className="cursor-pointer">
//                     {permission.name}
//                   </Label>
//                   <Switch
//                     id={permission.id}
//                     checked={permission.enabled}
//                     onCheckedChange={() =>
//                       handlePermissionChange(permission.id)
//                     }
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
