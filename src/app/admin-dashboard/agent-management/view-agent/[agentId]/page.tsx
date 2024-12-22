"use client";

import React, { useEffect, useState } from "react";
import BackLink from "@/components/BackLink";
import NotificationProfile from "@/components/NotificationProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Eye, Download, FileText } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function Page() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://mojoapi.grandafricamarket.com/api/users/${userId}`
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setUserData(data.user); // Accessing the `user` object inside the response
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load user data.");
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!userData) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-xl font-semibold text-primary">User Management</h1>
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
            View User - {userData.first_name} {userData.last_name}
          </BackLink>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-6">View Information</h2>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">First Name</p>
                <p className="font-medium">{userData.first_name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Name</p>
                <p className="font-medium">{userData.last_name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone no.</p>
                <p className="font-medium">{userData.phone}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <p className="font-medium">
                  {userData.created_at
                    ? new Date(userData.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="font-medium">{userData.status || "Active"}</p>
              </div>

              <div className="col-span-2 pt-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">ID.PDF</p>
                      <p className="text-sm text-muted-foreground">320 KB</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">12/2/2024</p>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
