"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import Image from "next/image";
import NotificationProfile from "@/components/NotificationProfile";
import BackLink from "@/components/BackLink";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";

const Page = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idImage: null,
    role: "user", // Default role
  });

  const [roles, setRoles] = useState<string[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch roles dynamically when the component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetchWithAuth("https://mojoapi.siltet.com/api/users/create");
        console.log(response)
        if (!response.ok) {
          throw new Error(`Failed to fetch roles: ${response.statusText}`);
        }
        const data = await response.json();
        setRoles(data.roles || []); // Ensure roles is set to an empty array if no roles are returned
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError("Failed to load roles.");
      }
    };

    fetchRoles();
  }, []);

  // Handle form input changes, including dropdown
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      idImage: e.target.files ? e.target.files[0] : null,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
  
    if (!token) {
      console.error("Token not found");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    // formDataToSend.append("role", formData.role); // Add role
  
    try {
      const response = await fetch("https://mojoapi.siltet.com/api/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Attach token in headers
        },
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit data");
      }
  
      const data = await response.json();
      console.log("User added successfully:", data);
    } catch (err) {
      console.error("Error submitting data:", err);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-xl font-semibold">User Management</h1>
        <div className="flex items-center gap-4">
          <NotificationProfile
            profileLink="/admin-dashboard/settings"
            notificationLink="/admin-dashboard/notifications"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <BackLink>
            <ArrowLeft className="h-4 w-4" />
            Add New User
          </BackLink>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">Add New User</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Fill in the information below
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-2"
                  >
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-2"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone No.
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Role Dropdown */}
                {/* <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium mb-2"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  >
                    {roles && roles.length > 0 ? (
                      roles.map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitalizing the role */}
                      {/* </option>
                      ))
                    ) : (
                      <option value="user">Loading roles...</option>
                    )} */}
                  {/* </select>
                </div> */} 
              </div> 

              {/* File Upload */}
              {/* <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Id
                </label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <div className="mb-4">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="Upload preview"
                      width={100}
                      height={100}
                      className="mx-auto"
                    />
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button type="button" className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Take photo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Button>
                    <input
                      type="file"
                      id="fileInput"
                      name="idImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div> */}

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>

            {error && <p className="text-red-500 mt-4">{error}</p>}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Page;
