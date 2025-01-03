"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload, ChevronDown } from "lucide-react";
import Image from "next/image";
import NotificationProfile from "@/components/NotificationProfile";
import BackLink from "@/components/BackLink";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddUserPage = () => {
  const router = useRouter();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch("https://mojoapi.crosslinkglobaltravel.com/api/roles", {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setRoles(data.data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        toast.error("Failed to load roles");
      }
    };
    fetchRoles();
  }, []);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idImage: null,
    role: "Agent",
  });
  const [imagePreview, setImagePreview] = useState(
    "/placeholder.svg?height=100&width=100"
  );
  const [error, setError] = useState(null);

  const handleChange = (key, value) => {
    setUserData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Extract base64 data
        setUserData((prevState) => ({
          ...prevState,
          idImage: base64String, // Store base64 string
        }));
      };
      reader.readAsDataURL(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a JSON object for the request body using userData
    const requestBody = {
        first_name: userData.firstName, // Use actual first name
        last_name: userData.lastName,     // Use actual last name
        email: userData.email,             // Use actual email
        phone: userData.phone,             // Use actual phone number
        password: "12345678",              // Dummy password
        id_image: userData.idImage,        // Include the base64 image string
        role: "Agent",                // Add this line
    };

    console.log("Request Body:", requestBody); // Log the request data

    try {
        const accessToken = localStorage.getItem("access_token");
        console.log("Access Token:", accessToken); // Log the access token
        const response = await fetch("https://mojoapi.crosslinkglobaltravel.com/api/users/store", {
            method: "POST",
            body: JSON.stringify(requestBody), // Use JSON.stringify for the request body
            headers: {
                "Content-Type": "application/json", // Change content type to application/json
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        console.log("Agent added successfully.");
        toast.success("Agent added successfully!");
        setTimeout(() => {
            router.push("/admin-dashboard/agent-management");
        }, 2000);
    } catch (err) {
        console.error("Failed to add user:", err.message);
        toast.error("Failed to add user. Please check your input and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
     <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    value={userData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    value={userData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={userData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone No.
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={userData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-2">
                    Role
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload ID</label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center relative">
                  <div className="mb-4">
                    <Image
                      src={imagePreview}
                      alt="Upload preview"
                      width={100}
                      height={100}
                      className="mx-auto"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="relative flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </Button>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

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

export default AddUserPage;
