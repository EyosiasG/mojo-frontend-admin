"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import BackLink from "@/components/BackLink";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { useParams } from "next/navigation";
import NotificationProfile from "@/components/NotificationProfile";
import { Card, CardContent } from "@/components/ui/card";

export default function ViewCurrency() {
  const { currencyId } = useParams();

  const [currencyData, setCurrencyData] = useState({
    name: "",
    status: "",
    sign: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await fetchWithAuth(
          `https://mojoapi.crosslinkglobaltravel.com/api/currencies/${currencyId}`,
          { method: "GET" }
        );
  
        const data = await response.json();
  
        if (data.status === "success") {
          setCurrencyData({
            name: data.data.name,
            status: data.data.status,
            sign: data.data.sign,
          });
        } else {
          setError(data.message || "Currency not found");
        }
      } catch (err) {
        console.error("Error fetching currency:", err);
        setError("Failed to fetch currency details.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCurrency();
  }, [currencyId]);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-gray-500">Loading currency data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold text-primary">Currency Management</h1>
        <div className="flex items-center gap-4">
          <NotificationProfile
            profileLink="/admin-dashboard/settings"
            notificationLink="/admin-dashboard/notifications"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <BackLink href="/admin-dashboard/currency">
            <ArrowLeft className="h-4 w-4" />
            Currency Details - {currencyData.name}
          </BackLink>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-10 text-center">View Information</h2>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-2xl mx-auto px-4 sm:px-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Currency ID</p>
                <p className="font-medium">{currencyId}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Currency Name</p>
                <p className="font-medium">{currencyData.name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Sign</p>
                <p className="font-medium">{currencyData.sign}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      currencyData.status === "Active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <p className="font-medium">{currencyData.status}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
