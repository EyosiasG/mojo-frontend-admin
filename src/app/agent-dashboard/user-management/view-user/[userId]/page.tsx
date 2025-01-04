"use client";

import React, { useEffect, useState } from "react";
import BackLink from "@/components/BackLink";
import NotificationProfile from "@/components/NotificationProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Eye, Download, FileText, Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { PDFDocument, rgb } from 'pdf-lib'; // Import PDF generation library


export default function Page() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isImageMaximized, setIsImageMaximized] = useState(false);

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

  useEffect(() => {
    const loadImage = async () => {
      try {
        // Assuming the image URL is in userData.image_url
        const imageUrl = userData?.image_url;
        if (!imageUrl) return;

        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Image not found');

        setUserImage(imageUrl);
      } catch (err) {
        console.log('Failed to load user image, using placeholder');
        setUserImage('https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png');
      }
    };

    if (userData) {
      loadImage();
    }
  }, [userData]);


  const handleView = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);
    let embeddedImage = null;

    try {
      // Find the image element that's already loaded in the page
      const imgElement = document.querySelector('img[alt="ID Document"]') as HTMLImageElement;
      
      if (!imgElement) {
        throw new Error('Image element not found');
      }

      // Create a canvas and draw the loaded image
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.naturalWidth;
      canvas.height = imgElement.naturalHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Wait for image to be fully loaded
      await new Promise((resolve) => {
        if (imgElement.complete) {
          resolve(true);
        } else {
          imgElement.onload = () => resolve(true);
        }
      });

      // Draw image to canvas
      ctx.drawImage(imgElement, 0, 0);
      
      // Convert to PNG data
      const pngData = canvas.toDataURL('image/png').split(',')[1];
      const imageBytes = Uint8Array.from(atob(pngData), c => c.charCodeAt(0));
      
      // Embed in PDF
      embeddedImage = await pdfDoc.embedPng(imageBytes);
      console.log('Image embedded successfully');

    } catch (err) {
      console.error('Image processing error:', err);
      console.log('Detailed error:', {
        message: err.message,
        stack: err.stack
      });
      // Continue without the image
    }

    // Draw the image only if successfully embedded
    if (embeddedImage) {
      const imageWidth = 100;
      const imageHeight = 100;
      page.drawImage(embeddedImage, {
        x: (page.getWidth() - imageWidth) / 2,
        y: 400,
        width: imageWidth,
        height: imageHeight,
      });
    }

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

    // Add a line for separation
    page.drawLine({ start: { x: 50, y: 390 }, end: { x: 350, y: 390 }, color: rgb(0.7, 0.7, 0.7), thickness: 1 });

    // User details section
    let yPosition = 370; // Start below the image
    const details = [
      { label: 'User ID', value: userData?.id || 'N/A' },
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
};

  

  const handleDownload = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);
    let embeddedImage = null;

    try {
      // Find the image element that's already loaded in the page
      const imgElement = document.querySelector('img[alt="ID Document"]') as HTMLImageElement;
      
      if (!imgElement) {
        throw new Error('Image element not found');
      }

      // Create a canvas and draw the loaded image
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.naturalWidth;
      canvas.height = imgElement.naturalHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Wait for image to be fully loaded
      await new Promise((resolve) => {
        if (imgElement.complete) {
          resolve(true);
        } else {
          imgElement.onload = () => resolve(true);
        }
      });

      // Draw image to canvas
      ctx.drawImage(imgElement, 0, 0);
      
      // Convert to PNG data
      const pngData = canvas.toDataURL('image/png').split(',')[1];
      const imageBytes = Uint8Array.from(atob(pngData), c => c.charCodeAt(0));
      
      // Embed in PDF
      embeddedImage = await pdfDoc.embedPng(imageBytes);
      console.log('Image embedded successfully');

    } catch (err) {
      console.error('Image processing error:', err);
      console.log('Detailed error:', {
        message: err.message,
        stack: err.stack
      });
    }

    // Draw the image only if successfully embedded
    if (embeddedImage) {
      const imageWidth = 100;
      const imageHeight = 100;
      page.drawImage(embeddedImage, {
        x: (page.getWidth() - imageWidth) / 2,
        y: 400,
        width: imageWidth,
        height: imageHeight,
      });
    }

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

    // Add a line for separation
    page.drawLine({ start: { x: 50, y: 390 }, end: { x: 350, y: 390 }, color: rgb(0.7, 0.7, 0.7), thickness: 1 });

    // User details section
    let yPosition = 370; // Start below the image
    const details = [
      { label: 'User ID', value: userData?.id || 'N/A' },
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

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'user_details.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(pdfUrl); // Clean up the URL object
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
            <h2 className="text-lg font-semibold mb-6 text-center">View Information</h2>
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="relative w-full max-w-[300px]">
                <div className="aspect-[3/2] bg-gray-200 overflow-hidden rounded-lg">
                  <Image
                    src={userData.id_image || "https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png"}
                    alt="ID Document"
                    width={300}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => setIsImageMaximized(true)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-2xl mx-auto px-4 sm:px-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">User ID</p>
                <p className="font-medium">{userData.id}</p>
              </div>

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
                <p className="text-sm text-muted-foreground mb-1">Registration Date</p>
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

      {isImageMaximized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative max-w-[90vw] w-fit h-fit max-h-[90vh] bg-white rounded-lg p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={() => setIsImageMaximized(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Image
              src={userData.id_image || "https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png"}
              alt="ID Document"
              width={1200}
              height={800}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
