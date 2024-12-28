"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import Image from "next/image";
import NotificationProfile from "@/components/NotificationProfile";
import BackLink from "@/components/BackLink";
import { useParams } from "next/navigation";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";

const EditUserPage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idImage: "",
  });
  const setError = useState(null)[1]; // OR simply remove it if unnecessary
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const response = await fetchWithAuth(`https://mojoapi.crosslinkglobaltravel.com/api/users/${userId}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setUserData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          idImage: data.idImage || "",
        });
        // Set preview image, fallback to a placeholder
        setImagePreview(data.idImage ? `${process.env.BACKEND_URL}/images/${data.idImage}` : "/placeholder.svg?height=100&width=100");
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", userData.firstName);
    formData.append("last_name", userData.lastName);
    formData.append("email", userData.email);
    formData.append("phone", userData.phone);
    if (userData.idImage) {
      formData.append("idImage", userData.idImage); // Append the file for uploading
    }

    try {
      const response = await fetchWithAuth(`https://mojoapi.crosslinkglobaltravel.com/api/users/${userId}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      // console.log("User updated:", data); // Debugging log
    } catch (err) {
      console.error("Failed to update user data:", err);
      setError("Failed to update user");
    }
  };

  const handleChange = (key, value) => {
    setUserData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData((prevState) => ({
        ...prevState,
        idImage: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-xl font-semibold">User Management</h1>
        <div className="flex items-center gap-4">
          <NotificationProfile
            profileLink="/agent-dashboard/settings"
            notificationLink="/agent-dashboard/notifications"
          />
          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
            <Image
              src="/placeholder.svg?height=32&width=32"
              alt="Profile"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <BackLink>
            <ArrowLeft className="h-4 w-4" />
            Edit User
          </BackLink>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              Edit User {userData.firstName} {userData.lastName}
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Fill in the information below
            </p>

            <form className="space-y-6" onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    value={userData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    value={userData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone No.
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Id</label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <div className="mb-4">
                    <Image
                      src={imagePreview || "/placeholder.svg?height=100&width=100"}
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
                    >
                      <Upload className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                      />
                      <span>Upload Image</span> {/* Make the text visible */}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EditUserPage;
