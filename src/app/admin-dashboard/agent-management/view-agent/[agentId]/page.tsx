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

export default function Page() {
  const { agentId } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isImageMaximized, setIsImageMaximized] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth(
          `https://mojoapi.crosslinkglobaltravel.com/api/users/${agentId}`
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
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

  const handleView = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);
    let embeddedImage = null;

    try {
    page.drawRectangle({
      x: 0,
      y: 500,
      width: 600,
      height: 60,
      color: rgb(0.2, 0.4, 0.6),
    });
    page.drawText('Agent Details', {
      x: 50,
      y: 520,
      size: 30,
      color: rgb(1, 1, 1),
    });

    // Add a line for separation
    page.drawLine({ start: { x: 50, y: 390 }, end: { x: 350, y: 390 }, color: rgb(0.7, 0.7, 0.7), thickness: 1 });

    // User details section
    let yPosition = 370;
    const details = [
      { label: 'First Name', value: userData?.first_name || 'N/A' },
      { label: 'Last Name', value: userData?.last_name || 'N/A' },
      { label: 'Email', value: userData?.email || 'N/A' },
      { label: 'Phone', value: userData?.phone || 'N/A' },
      { label: 'Status', value: userData?.status || 'Active' },
      {
        label: 'Registration Date',
        value: userData?.created_at
          ? new Date(userData.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
          : 'N/A'
      },
    ];

    details.forEach((detail) => {
      page.drawText(`${detail.label}:`, { x: 50, y: yPosition, size: 10, color: rgb(0, 0, 0) });
      page.drawText(String(detail.value), { x: 150, y: yPosition, size: 10, color: rgb(0, 0, 0) });
      yPosition -= 20;
    });

    // Footer Section
    page.drawLine({
      start: { x: 50, y: yPosition - 10 },
      end: { x: 350, y: yPosition - 10 },
      color: rgb(0.8, 0.8, 0.8),
      thickness: 1,
    });
    yPosition -= 30;

    page.drawText('Mojo Money Transfer!', {
      x: 225,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText('Contact us: support@mojo.com', {
      x: 210,
      y: yPosition - 20,
      size: 10,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfData = await pdfDoc.save();
    const pdfUrl = URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));
    window.open(pdfUrl, '_blank');
  } catch (err) {
    console.error('Error generating PDF:', err);
  }
};

  const handleDownload = async () => {
    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);
  
    // Header
    page.drawRectangle({
      x: 0,
      y: 500,
      width: 600,
      height: 60,
      color: rgb(0.2, 0.4, 0.6),
    });
    page.drawText('User Details', {
      x: 50,
      y: 520,
      size: 30,
      color: rgb(1, 1, 1),
    });

    // User details
    let yPosition = 370;
    const details = [
      { label: 'First Name', value: userData?.first_name || 'N/A' },
      { label: 'Last Name', value: userData?.last_name || 'N/A' },
      { label: 'Email', value: userData?.email || 'N/A' },
      { label: 'Phone', value: userData?.phone || 'N/A' },
      { label: 'Status', value: userData?.status || 'Active' },
      {
        label: 'Registration Date',
        value: userData?.created_at
          ? new Date(userData.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
          : 'N/A'
      },
    ];

    details.forEach((detail) => {
      page.drawText(`${detail.label}:`, { x: 50, y: yPosition, size: 10, color: rgb(0, 0, 0) });
      page.drawText(String(detail.value), { x: 150, y: yPosition, size: 10, color: rgb(0, 0, 0) });
      yPosition -= 20;
    });

    // Footer
    page.drawLine({
      start: { x: 50, y: yPosition - 10 },
      end: { x: 350, y: yPosition - 10 },
      color: rgb(0.8, 0.8, 0.8),
      thickness: 1,
    });
    yPosition -= 30;

    page.drawText('Mojo Money Transfer!', {
      x: 225,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText('Contact us: support@mojo.com', {
      x: 210,
      y: yPosition - 20,
      size: 10,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfData = await pdfDoc.save();
    const pdfUrl = URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'agent_details.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(pdfUrl);
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!userData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-gray-500">Loading user data...</p>
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
