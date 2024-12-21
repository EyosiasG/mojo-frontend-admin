import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import NotificationProfile from "@/components/NotificationProfile";
import BackLink from "@/components/BackLink";

const page = () => {
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
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Sender Information
                </h3>
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full name</p>
                    <p className="font-medium">John Doe</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">john@gmail.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone No.</p>
                    <p className="font-medium">09572752191</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">America</p>
                  </div>
                </div>
              </div>

              {/* Recipient Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Recipient Information
                </h3>
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full name</p>
                    <p className="font-medium">John Doe</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">john@gmail.com</p>
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

              {/* Transaction Details */}
              <div className="md:col-span-2 grid md:grid-cols-2 gap-8 pt-6 border-t">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium">400.00</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Currency</p>
                      <p className="font-medium">Dollar</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">20 Nov 2024</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">20:00 pm</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">Successful</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default page;
