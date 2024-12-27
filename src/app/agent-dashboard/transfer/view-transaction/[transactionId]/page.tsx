'use client'

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import NotificationProfile from "@/components/NotificationProfile";
import BackLink from "@/components/BackLink";
import { useParams } from 'next/navigation';
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const page = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState({});
  const fetchTransaction = async () => {
    const response = await fetchWithAuth(`https://mojoapi.grandafricamarket.com/api/transactions/${transactionId}`);
    const data = await response.json();

    //console.log(data.data);
    return data.data;
  };

  const handleView = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
  
    // Header Section
    page.drawRectangle({
      x: 0,
      y: 340,
      width: 600,
      height: 60,
      color: rgb(0.2, 0.4, 0.6),
    });
    page.drawText('Transaction Details', {
      x: 200,
      y: 360,
      size: 20,
      color: rgb(1, 1, 1),
    });

    // Transaction Details Section
    let yPosition = 300; // Starting position
    page.drawText('Transaction Details:', {
      x: 50,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });
    yPosition -= 10;
  
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: 550, y: yPosition },
      color: rgb(0.8, 0.8, 0.8),
      thickness: 1,
    });
    yPosition -= 20;
  
    const details = [
      { label: 'Transaction ID', value: String(transaction.transaction_id || 'N/A') },
      { label: 'Sender Name', value: String(transaction.sender_name || 'N/A') },
      { label: 'Receiver Name', value: String(transaction.reciever_name || 'N/A') },
      { label: 'Account Number', value: String(transaction.account_number || 'N/A') },
      { label: 'Amount in ETB', value: `${transaction.amount || 'N/A'} ETB` },
      { label: 'Amount', value: `${transaction.etb_amount || 'N/A'}` },
      { label: 'Status', value: String(transaction.status || 'Active') },
    ];
  
    details.forEach((detail) => {
      page.drawText(`${detail.label}:`, { x: 50, y: yPosition, size: 10, color: rgb(0, 0, 0) });
      page.drawText(String(detail.value), { x: 300, y: yPosition, size: 10, color: rgb(0, 0, 0) });
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
    const page = pdfDoc.addPage([600, 400]);
  
    // Header Section
    page.drawRectangle({
      x: 0,
      y: 340,
      width: 600,
      height: 60,
      color: rgb(0.2, 0.4, 0.6),
    });
    page.drawText('Transaction Details', {
      x: 200,
      y: 360,
      size: 20,
      color: rgb(1, 1, 1),
    });

    // Transaction Details Section
    let yPosition = 300; // Starting position
    page.drawText('Transaction Details:', {
      x: 50,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });
    yPosition -= 10;
  
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: 550, y: yPosition },
      color: rgb(0.8, 0.8, 0.8),
      thickness: 1,
    });
    yPosition -= 20;
  
    const details = [
      { label: 'Transaction ID', value: String(transaction.transaction_id || 'N/A') },
      { label: 'Sender Name', value: String(transaction.sender_name || 'N/A') },
      { label: 'Receiver Name', value: String(transaction.reciever_name || 'N/A') },
      { label: 'Account Number', value: String(transaction.account_number || 'N/A') },
      { label: 'Amount in ETB', value: `${transaction.amount || 'N/A'} ETB` },
      { label: 'Amount', value: `${transaction.etb_amount || 'N/A'}` },
      { label: 'Status', value: String(transaction.status || 'Active') },
    ];
  
    details.forEach((detail) => {
      page.drawText(`${detail.label}:`, { x: 50, y: yPosition, size: 10, color: rgb(0, 0, 0) });
      page.drawText(String(detail.value), { x: 300, y: yPosition, size: 10, color: rgb(0, 0, 0) });
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

  useEffect(() => {
    const fetchAndSetTransaction = async () => {
      const transactionData = await fetchTransaction();
      setTransaction(transactionData);
      console.log(transactionData);
    };
    fetchAndSetTransaction();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-xl font-semibold text-primary">
          Transaction History
        </h1>
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
            View Transaction
          </BackLink>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-6">View Information</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Sender Information */}
              <div>
                <div className="space-y-4">
                  <h3 className="text-md text-muted-foreground">
                    Sender Information
                  </h3>
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full name</p>
                      <p className="text-sm">{transaction.sender_name}</p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-1 grid md:grid-cols-1 pt-6 mt-5 border-t">
                <h3 className="text-md text-muted-foreground">
                Transaction Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mt-2">Amount</p>
                    <p className="font-medium">{transaction.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount in ETB</p>
                    <p className="font-medium">{transaction.etb_amount}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {new Date(transaction.created_at).toLocaleDateString("en-US", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">{transaction.status}</span>
                    </div>
                  </div>
                </div>
               

                </div>

              </div>


              {/* Recipient Information */}
              <div className="space-y-4">
                <h3 className="text-md text-muted-foreground">
                  Recipient Information
                </h3>
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full name</p>
                    <p className="font-medium">{transaction.reciever_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{transaction.account_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone No.</p>
                    <p className="font-medium">09572752191</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">America</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account No.</p>
                    <p className="font-medium">58027502760</p>
                  </div>
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default page;
