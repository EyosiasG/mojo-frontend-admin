"use client";

import { ReactNode } from "react";
import { Button } from "./ui/button";

interface BackLinkProps {
  fallbackUrl?: string; // Fallback URL if no history exists
  children: ReactNode; // Child component for custom content
  className?: string; // Optional className for styling
}

const BackLink: React.FC<BackLinkProps> = ({
  fallbackUrl = "/",
  children,
  className = "",
}) => {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = fallbackUrl; // Navigate to fallback URL
    }
  };

  return (
    <Button
      onClick={handleBack}
      variant="ghost"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      {children}
    </Button>
  );
};

export default BackLink;
