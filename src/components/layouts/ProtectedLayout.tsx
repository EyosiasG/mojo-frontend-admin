"use client";
import { useInactivityLogout } from '../../hooks/useInactivityLogout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useInactivityLogout();

  return <>{children}</>;
} 