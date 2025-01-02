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
  const [userImage, setUserImage] = useState<string | null>(null);

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
      // Using a direct, reliable PNG URL
      const imageUrl = 'data:image/png;base64,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';
    
    // Convert base64 to bytes
    const base64Data = imageUrl.split(',')[1];
    const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    console.log('Embedding image...');
    embeddedImage = await pdfDoc.embedPng(imageBytes.buffer);
    console.log('Image embedded successfully');

  } catch (err) {
    console.error('Image processing error:', err);
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
      const imageUrl = userImage || '/placeholder.svg';
      const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
      embeddedImage = imageUrl.endsWith('.svg')
        ? await pdfDoc.embedPng(imageBytes)
        : await pdfDoc.embedJpg(imageBytes);

      if (embeddedImage) {
        const imageWidth = 100;
        const imageHeight = 100;
        page.drawImage(embeddedImage, {
          x: (page.getWidth() - imageWidth) / 2,
          y: 450,
          width: imageWidth,
          height: imageHeight,
        });
      }
    } catch (err) {
      console.error('Failed to embed image in PDF:', err);
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
      { label: 'User ID', value: userData.id },
      { label: 'First Name', value: userData.first_name },
      { label: 'Last Name', value: userData.last_name },
      { label: 'Email', value: userData.email },
      { label: 'Phone', value: userData.phone },
      { label: 'Status', value: userData.status || 'Active' },
      {
        label: 'Registration Date',
        value: userData.created_at
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
            <div className="flex items-center gap-4 mb-10">
              <div className="rounded-full bg-gray-200 overflow-hidden mx-auto">
                <Image
                  src="https://www.pngitem.com/pimgs/m/551-5510463_default-user-image-png-transparent-png.png"
                  alt="Profile"
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
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
    </div>
  );
}
