"use client";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Camera } from "lucide-react";
import { Layout } from "@/components/AgentLayout";
import { Upload } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { Loader2 } from "lucide-react";
import NotificationProfile from "@/components/NotificationProfile";
import { ArrowLeft } from "lucide-react";
import BackLink from "@/components/BackLink";
// import jwt_decode from "jwt-decode";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idImage: null,
    idImageUrl: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { userId } = useParams();
  const router = useRouter();
  const [logoutPassword, setLogoutPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      setIsDataLoading(true);
      try {
        const response = await fetch(
          `https://mojoapi.crosslinkglobaltravel.com/api/admin/senders/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data.user);
        console.log("User Data: ", data.user);  
        setFormData({
          firstName: data.user.first_name || "",
          lastName: data.user.last_name || "",
          email: data.user.email || "",
          phone: data.user.phone,
          idImage: null,
          idImageUrl: data.user.id_image || "",
        });
        console.log("Form Data sdaURL: ", data.user.id_image);
        console.log("Form Data URL: ", data.user.profile_photo_url);
        setIsDataLoading(false);
      } catch (err: unknown) {
        setError(err.message);
        setIsDataLoading(false);
      }
    };
    getUserData();
  }, []);

  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value || "" }));
  };

  // Handle password form input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value || "" }));
  };

  // Handle form submission for updating user profile
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    let errorMessages = [];

    if (!formData.firstName.trim()) {
        errorMessages.push("First name is required");
    }
    if (!formData.lastName.trim()) {
        errorMessages.push("Last name is required");
    }
    if (!formData.email.trim()) {
        errorMessages.push("Email is required");
    }
    if (!formData.phone.trim()) {
        errorMessages.push("Phone number is required");
    }

    if (errorMessages.length > 0) {
        Swal.fire({
            title: 'Validation Error',
            html: errorMessages.join('<br>'),
            icon: 'error',
            confirmButtonColor: '#3085d6',
        });
        return;
    }

    setIsLoading(true);
    const userId = userData.id;

    // Prepare the data to send, excluding id_image by default
    const updatedData: any = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || "", // Ensure phone is included, even if empty
    };

    // Only include id_image if a new image was uploaded
    if (formData.idImage) {
        updatedData.id_image = formData.idImage;
    }

    console.log("Request body: ", updatedData);

    try {
        const response = await fetch(
            `https://mojoapi.crosslinkglobaltravel.com/api/admin/senders/${userId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify(updatedData),
            }
        );

        if (!response.ok) {
            const errorData = await response.json(); // Get error details
            throw new Error(errorData.message || "Failed to update profile");
        }

        const data = await response.json();
        setFormData(data);
        setError(null);
        Swal.fire({
            title: 'Success!',
            text: 'Profile updated successfully!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            router.push("/admin-dashboard");
        });

    } catch (err: unknown) {
        setError(err.message);
        toast.error(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let errorMessages = [];

    if (!passwordData.currentPassword.trim()) {
        errorMessages.push("Current password is required");
    }
    if (!passwordData.newPassword.trim()) {
        errorMessages.push("New password is required");
    }
    if (!passwordData.confirmPassword.trim()) {
        errorMessages.push("Please confirm your new password");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        errorMessages.push("Passwords do not match");
    }

    if (errorMessages.length > 0) {
        Swal.fire({
            title: 'Validation Error',
            html: errorMessages.join('<br>'),
            icon: 'error',
            confirmButtonColor: '#3085d6',
        });
        return;
    }

    setIsLoading(true);

    const updatedData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone || "", // Ensure phone is included, even if empty
      id_image: formData.idImage, // Assuming this is a base64 string
      // Include password if you want to allow password updates
      password: passwordData.newPassword || "12345678", // Uncomment if needed
    };

    console.log("Request Body: ", updatedData); 

    const userId = userData.id;
    try {
      const response = await fetch(
        `https://mojoapi.crosslinkglobaltravel.com/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change password");
      }

      Swal.fire({
        title: 'Success!',
        text: 'Password updated successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        router.push("/agent-dashboard");
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setError(null);
    } catch (err: unknown) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logging out other sessions
  const handleLogoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://mojoapi.crosslinkglobaltravel.com/api/user/logout-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ password: logoutPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to log out other sessions");
      }

      toast.success("Successfully logged out of other sessions");
      setLogoutPassword("");
      setError(null);
      setTimeout(() => {
        router.push("/agent-dashboard");
      }, 2000);
    } catch (err: unknown) {
      setError(err.message);
      toast.error(err.message);
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
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete account");
        }

        toast.success("Your account has been deleted");
      } catch (err: unknown) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size exceeds 5MB. Please choose a smaller file.");
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        const cleanBase64 = base64String.replace('data:image/png;base64,', '');
        setFormData((prevData) => ({ 
          ...prevData, 
          idImage: cleanBase64,  // Clean base64 for API
          idImageUrl: base64String  // Full data URL for display
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  

  

  const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.firstName + ' ' + formData.lastName)}&color=7F9CF5&background=EBF4FF`;

  return (
    <>
      <header className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold text-primary">User Management</h1>
        <div className="flex items-center gap-4">
          <NotificationProfile
            profileLink="/agent-dashboard/settings"
            notificationLink="/agent-dashboard/notifications"
          />
        </div>
      </header>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="container mx-auto py-10 space-y-8 max-w-3xl">
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-6">
          <BackLink>
            <ArrowLeft className="h-4 w-4" />
            View User - {userData.first_name} {userData.last_name}
          </BackLink>
        </div>

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
                {isDataLoading ? (
                  <div className="w-[100px] h-[100px] rounded-lg flex items-center justify-center bg-gray-100">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <>
                    {formData.idImageUrl ? (
                      <Image
                        src={formData.idImageUrl}
                        alt="Profile picture"
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-[100px] h-[100px] rounded-lg flex items-center justify-center bg-gray-100">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                />
                
              </div>
              <Button
                    variant="outline"
                    className="relative flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Change Image
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </Button>
                  {/*/check*/}
            </div>
            <form onSubmit={handleProfileSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isDataLoading ? (
                    <div className="flex items-center space-x-2">
                      <Input disabled />
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className={validationErrors.firstName ? "border-red-500" : ""}
                    />
                  )}
                  {validationErrors.firstName && (
                    <p className="text-red-500 text-sm">{validationErrors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isDataLoading ? (
                    <div className="flex items-center space-x-2">
                      <Input disabled />
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className={validationErrors.lastName ? "border-red-500" : ""}
                    />
                  )}
                  {validationErrors.lastName && (
                    <p className="text-red-500 text-sm">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                {isDataLoading ? (
                  <div className="flex items-center space-x-2">
                    <Input disabled />
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter your email"
                    className={validationErrors.email ? "border-red-500" : ""}
                  />
                )}
                {validationErrors.email && (
                  <p className="text-red-500 text-sm">{validationErrors.email}</p>
                )}
              </div>
              <div className="space-y-2 mb-3">
                <Label htmlFor="phone">Phone Number</Label>
                {isDataLoading ? (
                  <div className="flex items-center space-x-2">
                    <Input disabled />
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className={validationErrors.phone ? "border-red-500" : ""}
                  />
                )}
                {validationErrors.phone && (
                  <p className="text-red-500 text-sm">{validationErrors.phone}</p>
                )}
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
