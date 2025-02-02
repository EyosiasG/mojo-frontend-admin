import { Bell, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NotificationProfile({
  notificationLink,
  profileLink,
}: {
  notificationLink: string;
  profileLink: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 bg-white rounded-full p-2">
      <Link
        href={notificationLink}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-500" />
      </Link>
      <Link
        href={profileLink}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Profile"
      >
        <User className="w-5 h-5 text-gray-500" />
      </Link>
    </div>
  );
}
