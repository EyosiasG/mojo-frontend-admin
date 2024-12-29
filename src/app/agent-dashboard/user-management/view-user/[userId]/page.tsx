"use client";

import React, { useEffect, useState } from "react";
import BackLink from "@/components/BackLink";
import NotificationProfile from "@/components/NotificationProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Eye, Download, FileText } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { PDFDocument, rgb } from 'pdf-lib'; // Import PDF generation library


export default function Page() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth(
          `https://mojoapi.crosslinkglobaltravel.com/api/users/${userId}`
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


  // Add these functions to handle view and download actions
  const handleView = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);
  
    // Load the placeholder image
    const imageUrl = 'data:image/png;base64,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'; // Path to the placeholder image
    const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
    const image = await pdfDoc.embedPng(imageBytes); // Use embedPng instead of embedSvg

    // Draw the image at the top center
    const imageWidth = 100; // Set desired width
    const imageHeight = 100; // Set desired height
  
    // Header Section
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

    // Transaction Details Section
    let yPosition = 450; // Starting position
    
  

    // page.drawImage(image, {
    //   x: (page.getWidth() - imageWidth) / 2, // Center the image
    //   y: 350, // Position below the header
    //   width: imageWidth,
    //   height: imageHeight,
    // });

    // Header
    
    // Add a line for separation
    page.drawLine({ start: { x: 50, y: 390 }, end: { x: 550, y: 390 }, color: rgb(1, 1, 1), thickness: 2 });
  
    // Add user details with improved formatting
    const details = [
      { label: 'First Name', value: userData.first_name },
      { label: 'Last Name', value: userData.last_name },
      { label: 'Email', value: userData.email },
      { label: 'Phone', value: userData.phone },
      { label: 'Status', value: userData.status || 'Active' },
    ];

    details.forEach((detail) => {
      page.drawText(`${detail.label}:`, { x: 50, y: yPosition, size: 10, color: rgb(0, 0, 0) });
      page.drawText(String(detail.value), { x: 150, y: yPosition, size: 10, color: rgb(0, 0, 0) });
      yPosition -= 20;
    });
  
    // Footer Section
    page.drawLine({
      start: { x: 50, y: yPosition - 10 },
      end: { x: 550, y: yPosition - 10 },
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
  };
  
  const handleDownload = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);
  
    // Load the placeholder image
    //const imageUrl = '/placeholder.svg'; // Path to the placeholder image
    //const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
    //const image = await pdfDoc.embedPng(imageBytes); // Use embedPng instead of embedSvg

    // Draw the image at the top center
    const imageWidth = 100; // Set desired width
    const imageHeight = 100; // Set desired height
    // page.drawImage(image, {
    //   x: (page.getWidth() - imageWidth) / 2, // Center the image
    //   y: 350, // Position below the header
    //   width: imageWidth,
    //   height: imageHeight,
    // });

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

    // Transaction Details Section
    let yPosition = 450; // Starting position
    
  

    // page.drawImage(image, {
    //   x: (page.getWidth() - imageWidth) / 2, // Center the image
    //   y: 350, // Position below the header
    //   width: imageWidth,
    //   height: imageHeight,
    // });

    // Header
    
    // Add a line for separation
    page.drawLine({ start: { x: 50, y: 390 }, end: { x: 550, y: 390 }, color: rgb(1, 1, 1), thickness: 2 });
  
    // Add user details with improved formatting
    const details = [
      { label: 'First Name', value: userData.first_name },
      { label: 'Last Name', value: userData.last_name },
      { label: 'Email', value: userData.email },
      { label: 'Phone', value: userData.phone },
      { label: 'Status', value: userData.status || 'Active' },
    ];

    details.forEach((detail) => {
      page.drawText(`${detail.label}:`, { x: 50, y: yPosition, size: 10, color: rgb(0, 0, 0) });
      page.drawText(String(detail.value), { x: 150, y: yPosition, size: 10, color: rgb(0, 0, 0) });
      yPosition -= 20;
    });
  
    // Footer Section
    page.drawLine({
      start: { x: 50, y: yPosition - 10 },
      end: { x: 550, y: yPosition - 10 },
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
    link.setAttribute('download', 'user_details.pdf'); // Specify the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
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
            User Details For - {userData.first_name} {userData.last_name}
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
                      <p className="font-medium">KYC PDF</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">12/2/2024</p>
                    <Button variant="ghost" size="icon" onClick={() => handleView()}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload()}>
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
