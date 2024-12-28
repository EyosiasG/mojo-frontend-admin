import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Camera } from "lucide-react";
import { fetchWithAuth } from "../../../components/utils/fetchwitAuth";

export default function SettingsPage() {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
  });

  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState('/img/profile.jpg');
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference for file input
  const [base64Image, setBase64Image] = useState<string | null>(null); // New state for the base64 image

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("snadnlasndla");
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string); // Store the base64 string in state
        console.log("BAse64: ", base64Image);
        setProfileImage(reader.result as string); // Update the preview image
        setUser((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (!reader.result) return;
        const result = reader.result as string;
        const base64String = result.split(",")[1]; // Extract base64 string

        console.log("Base64 String: ", base64String); // Log the base64 string for debugging

        // Check if the base64 string is valid
        if (!base64String || base64String.length === 0) {
          alert('The generated base64 string is invalid.');
          return;
        }

        setUser((prevState) => ({
          ...prevState,
          id_image: base64String, // Store base64 string
        }));
        setProfileImage(result); // Update the preview image after setting id_image
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click(); // Trigger file input click programmatically
  };

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
      const res = await fetchWithAuth(`https://mojoapi.crosslinkglobaltravel.com/api/settings/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          //id_image: base64Image,
        }),
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
                src={profileImage}
                alt="Profile picture"
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                onClick={openFileSelector} // Opens the file selector
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button variant="outline" onClick={openFileSelector}>
              Change avatar
            </Button>
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
    </div>
  );
}
