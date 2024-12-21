"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import Image from "next/image";
import NotificationProfile from "@/components/NotificationProfile";
import BackLink from "@/components/BackLink";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";

const AddUserPage = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idImage: null,
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
      setUserData((prevState) => ({
        ...prevState,
        idImage: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // const userToken = localStorage.getItem("userToken"); // Log the token to check
  //   // console.log("User token:", userToken); // Check if the token is available

  //   const requestData = {
  //     first_name: userData.firstName,
  //     last_name: userData.lastName,
  //     email: userData.email,
  //     phone: userData.phone,
  //     idImage: userData.idImage ? userData.idImage.name : null,
  //   };

  //   try {
  //     const response = await fetchWithAuth(`https://mojoapi.siltet.com/api/users/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(requestData),
  //     });

  //     if (!response.ok) throw new Error(`Error: ${response.statusText}`);

  //     const data = await response.json();
  //     console.log("User added:", data);
  //   } catch (err) {
  //     console.error("Failed to add user data:", err);
  //     setError("Failed to add user");
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Initialize FormData for multipart/form-data requests
  //   const formBody = new FormData();

  //   // Add text data
  //   formBody.append("first_name", userData.firstName);
  //   formBody.append("last_name", userData.lastName);
  //   formBody.append("email", userData.email);
  //   formBody.append("phone", userData.phone);
  //   formBody.append("password", "12345678");

  //   // Add the image file if provided
  //   if (userData.idImage) {
  //     formBody.append("id_image", userData.idImage); // Add file directly
  //   }

  //   try {
  //     console.log("Submitting user data...");
  //     const response = await fetchWithAuth(
  //       `https://mojoapi.grandafricamarket.com/api/users/store`,
  //       {
  //         method: "POST",
  //         headers: {
  //           // Accept: "application/json", // Optional, matches Postman behavior
  //           "Content-Type": "multipart/form-data", // Optional, matches Postman behavior
  //         },
  //         body: formBody,
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorDetails = await response.text(); // Log backend error message
  //       console.error(`Error ${response.status}:`, errorDetails);
  //       throw new Error(`Error ${response.statusText}`);
  //     }

  //     const data = await response.json();
  //     console.log("User added:", data);
  //   } catch (err) {
  //     console.error("Failed to add user data:", err);
  //     setError("Failed to add user");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Initialize form data for URL-encoded requests
    const formBody = new URLSearchParams();
    // const formBody = new FormData();

    // Add text data
    formBody.append("first_name", userData.firstName);
    formBody.append("last_name", userData.lastName);
    formBody.append("email", userData.email);
    formBody.append("phone", userData.phone);
    formBody.append("password", "12345678");

    // File handling for x-www-form-urlencoded
    if (userData.idImage) {
      try {
        const base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              const base64Content = (reader.result as string).split(",")[1]; // Extract base64 content
              resolve(base64Content);
            } else {
              reject(new Error("Failed to read image as Base64."));
            }
          };
          reader.onerror = () => reject(new Error("Failed to process image."));
          reader.readAsDataURL(userData.idImage); // Read file as base64
        });

        // Add Base64 image to the form body
        formBody.append("id_image", base64Image);

        // Submit the form with the image
        const response = await fetchWithAuth(
          `https://mojoapi.grandafricamarket.com/api/users/store`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              // "Content-Type": "multipart/form-data",
            },
            body: formBody.toString(),
          }
        );

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        console.log("User added with picture:", data);
      } catch (err) {
        console.error("Failed to add user data with image:", err);
        setError("Failed to add user with image");
      }
    } else {
      // No file: Submit without the image
      try {
        const response = await fetchWithAuth(
          `https://mojoapi.grandafricamarket.com/api/users/store`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody.toString(),
          }
        );

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        console.log("User added:", data);
      } catch (err) {
        console.error("Failed to add user data:", err);
        setError("Failed to add user");
      }
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
                    placeholder="Enter first name"
                    value={userData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
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
                    placeholder="Enter last name"
                    value={userData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
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
                    type="email"
                    placeholder="Enter email"
                    value={userData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
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
                    type="tel"
                    placeholder="Enter phone number"
                    value={userData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload ID
                </label>
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
