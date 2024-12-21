import { CheckCircle2, Search, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import NotificationProfile from "@/components/NotificationProfile";

interface Notification {
  id: number;
  success: boolean;
  message: string;
  recipient: string;
  timestamp: string;
}

export default function NotificationPage() {
  const notifications: Notification[] = [
    {
      id: 1,
      success: true,
      message: "Money Sent Successfully",
      recipient: "Abebe",
      timestamp: "Jul 8, 2024 - 10:00am",
    },
    {
      id: 2,
      success: false,
      message: "Money Transfer is not Successful",
      recipient: "Abebe",
      timestamp: "Jul 8, 2024 - 10:00am",
    },
    {
      id: 3,
      success: false,
      message: "Money Transfer is not Successful",
      recipient: "Abebe",
      timestamp: "Jul 8, 2024 - 10:00am",
    },
    {
      id: 4,
      success: false,
      message: "Money Transfer is not Successful",
      recipient: "Abebe",
      timestamp: "Jul 8, 2024 - 10:00am",
    },
    {
      id: 5,
      success: true,
      message: "Money Sent Successfully",
      recipient: "Abebe",
      timestamp: "Jul 8, 2024 - 10:00am",
    },
    {
      id: 6,
      success: true,
      message: "Money Sent Successfully",
      recipient: "Abebe",
      timestamp: "Jul 8, 2024 - 10:00am",
    },
    {
      id: 7,
      success: false,
      message: "Money Transfer is not Successful",
      recipient: "Abebe",
      timestamp: "Jul 8, 2024 - 10:00am",
    },
    {
      id: 8,
      success: true,
      message: "Money Sent Successfully",
      recipient: "Abebe",
      timestamp: "Jul 8, 2024 - 10:00am",
    },
    {
      id: 9,
      success: false,
      message: "Money Transfer is not Successful",
      recipient: "Abebe",
      timestamp: "Jul 8, 2024 - 10:00am",
    },
  ];

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
            profileLink="/agent-dashboard/settings"
            notificationLink="/agent-dashboard/notifications"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <h2 className="font-semibold">Most Recent</h2>
        </div>
        <div className="divide-y">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-3 p-4 transition-colors hover:bg-muted/50"
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
          ))}
        </div>
      </div>
    </div>
  );
}
