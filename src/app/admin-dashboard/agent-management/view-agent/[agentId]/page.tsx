"use client";

import React, { useEffect, useState } from "react";
import BackLink from "@/components/BackLink";
import NotificationProfile from "@/components/NotificationProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Eye, Download, FileText, Maximize2, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { PDFDocument, rgb } from 'pdf-lib';
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { usersApi } from "@/api/users";

export default function Page() {
  const { agentId } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isImageMaximized, setIsImageMaximized] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await usersApi.getUserData(agentId as string);
        setUserData(data.user);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load user data.");
      }
    };

    if (agentId) {
      fetchUserData();
    }
  }, [agentId]);

  if(!userData){
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold text-primary">User Management</h1>
        <div className="flex items-center gap-4">
          <NotificationProfile
            profileLink="/agent-dashboard/settings"
            notificationLink="/agent-dashboard/notifications"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <BackLink>
            <ArrowLeft className="h-4 w-4" />
            User Details For - {userData?.first_name} {userData?.last_name}
          </BackLink>
        </div>

        <Card>
          <CardContent className="py-6">
            <h2 className="text-lg font-semibold mb-10 text-center">View Information</h2>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-2xl">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Agent ID</p>
                <p className="font-medium">{userData?.id}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">First Name</p>
                <p className="font-medium">{userData?.first_name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Name</p>
                <p className="font-medium">{userData?.last_name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{userData?.email}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone no.</p>
                <p className="font-medium">{userData?.phone}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <p className="font-medium">
                  {userData?.created_at
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
                <p className="font-medium">{userData?.status || "Active"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
