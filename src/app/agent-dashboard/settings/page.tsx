"use client";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Camera } from "lucide-react";
import { Layout } from "@/components/AgentLayout";
// import jwt_decode from "jwt-decode";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    timezone: "",
    profilePicture: "/img/profile.jpg",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [logoutPassword, setLogoutPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch(
          "https://mojoapi.grandafricamarket.com/api/user",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
        setFormData(data);
      } catch (err: unknown) {
        setError(err.message);
      }
    };
    getUserData();
  }, []);
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle password form input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission for updating user profile
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const userId = 1;
    try {
      const response = await fetch(
        "https://mojoapi.siltet.com/api/users/${userId}",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setFormData(data);
      setError(null);
      alert("Profile updated successfully!");
    } catch (err: unknown) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://mojoapi.siltet.com/api/users/${userId}",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(passwordData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change password");
      }

      alert("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setError(null);
    } catch (err: unknown) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logging out other sessions
  const handleLogoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/logout-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ password: logoutPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to log out other sessions");
      }

      alert("Successfully logged out of other sessions");
      setLogoutPassword("");
      setError(null);
    } catch (err: unknown) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      setIsLoading(true);

      try {
        const response = await fetch("/api/user/delete-account", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete account");
        }

        alert("Your account has been deleted");
      } catch (err: unknown) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 space-y-8">
        {error && <p className="text-red-500">{error}</p>}

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <p className="text-sm text-muted-foreground">
              Use a permanent address where you can receive mail
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {userData?.id_image && (
                  <Image
                    src={userData?.id_image}
                    alt="Profile picture"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                )}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline">Change avatar</Button>
            </div>
            <form onSubmit={handleProfileSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  placeholder="Select your timezone"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <p className="text-sm text-muted-foreground">
              Update your password associated with your account
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Logout other sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Logout from all other sessions</CardTitle>
            <p className="text-sm text-muted-foreground">
              This will log you out from all other devices and sessions
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogoutSubmit}>
              <div className="space-y-2">
                <Label htmlFor="logoutPassword">Enter password</Label>
                <Input
                  id="logoutPassword"
                  name="logoutPassword"
                  type="password"
                  value={logoutPassword}
                  onChange={(e) => setLogoutPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Logging out..." : "Logout"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Deletion */}
        <Card>
          <CardHeader>
            <CardTitle>Delete Account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account
            </p>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete account"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
