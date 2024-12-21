"use client"
import { useEffect, useState } from "react";
import { CheckCircle2, Search, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import NotificationProfile from "@/components/NotificationProfile";
import axios from "axios"; // Import axios for API requests

interface Notification {
  id: number;
  success: boolean;
  message: string;
  recipient: string;
  timestamp: string;
}

export default function Page() {
  const [notifications, setNotifications] = useState<Notification[]>([]); // State to store notifications
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem("access_token");

        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        // Make the API request with Authorization header
        const response = await axios.get('https://mojoapi.siltet.com/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });

        // console.log("Fetched Notifications Response:", response); // Log the entire response to verify the structure
        // console.log("Fetched Notifications Data:", response.data); // Log just the data

        setNotifications(response.data); // Update state with the fetched notifications
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      await axios.post(
        `https://mojoapi.siltet.com/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) return <div>Loading...</div>; // Show loading state while fetching notifications

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notification</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search" type="search" />
          </div>
          <NotificationProfile
            profileLink="/admin-dashboard/settings"
            notificationLink="/admin-dashboard/notifications"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <h2 className="font-semibold">Most Recent</h2>
        </div>
        <div className="divide-y">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 p-4 transition-colors hover:bg-muted/50"
                onClick={() => markAsRead(notification.id)} // Mark as read on click
              >
                {notification.success ? (
                  <CheckCircle2 className="mt-1 h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="mt-1 h-5 w-5 text-red-500" />
                )}
                <div className="flex-1">
                  <p className="font-medium">
                    {notification.message}{" "}
                    <span className="text-muted-foreground">
                      To {notification.recipient}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.timestamp}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-muted-foreground">No notifications available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
