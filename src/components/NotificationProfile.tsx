import { Bell } from "lucide-react";
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
        className="rounded-full hover:ring-2 hover:ring-gray-200 transition-all"
        aria-label="Profile"
      >
        <Image
          src="/img/avatar.png"
          alt="Profile picture"
          width={40}
          height={40}
          className="rounded-full"
        />
      </Link>
    </div>
  );
}
