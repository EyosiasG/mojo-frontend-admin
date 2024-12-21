"use client"
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Camera } from "lucide-react";
import { fetchWithAuth } from "../../../components/utils/fetchwitAuth";
// import jwt_decode from "jwt-decode";

export default function SettingsPage() {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    timezone: '',
  });

  const [loading, setLoading] = useState(true);

  // Extract userId from the JWT token stored in localStorage
  const getUserIdFromToken = () => {
    // const token = localStorage.getItem("userToken");
    // console.log(token) // Get token from localStorage (or cookies)
    // if (token) {
    //   // const decoded: any = jwt_decode(token); 
    //   // console.log("decoded:" ,decoded);

    //   return decoded.userId; 
    // }
    return 1; // Return 1 if no token found
  };

  const userId = getUserIdFromToken(); // Get userId dynamically from the token

  useEffect(() => {
    // Fetch user settings data from the API
    const fetchUserSettings = async () => {
      try {
        const res = await fetchWithAuth(`https://mojoapi.siltet.com/api/settings/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetchWithAuth(`https://mojoapi.siltet.com/api/settings/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser); // Update the state with the new data
        alert('Settings updated successfully!');
      } else {
        alert('Error updating settings.');
      }
    } catch (error) {
      console.error('Error updating user settings:', error);
      alert('Error updating settings.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
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
              <Image
                src="/img/profile.jpg"
                alt="Profile picture"
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={user.first_name}
                onChange={handleInputChange}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={user.last_name}
                onChange={handleInputChange}
                placeholder="Enter your last name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              value={user.email}
              onChange={handleInputChange}
              type="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={user.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              value={user.timezone}
              onChange={handleInputChange}
              placeholder="Select your timezone"
            />
          </div>
          <Button onClick={handleSubmit}>Save changes</Button>
        </CardContent>
      </Card>

      {/* Additional Sections for Changing Password, Logging out, and Deleting Account */}
    </div>
  );
}
