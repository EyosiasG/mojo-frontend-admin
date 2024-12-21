"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import BackLink from "@/components/BackLink";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { useParams } from "next/navigation";

export default function ViewCurrency() {
  // Fetch currencyId dynamically from URL params
  // const params = useParams();
  const { currencyId } = useParams();
  // const currencyId = "1";  // Hardcoded value for testing

  // console.log("Currency ID from route:", currencyId);

  const [currencyData, setCurrencyData] = useState({
    name: "",
    status: "",
    sign: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch currency details
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        
        // console.log("Fetching currency data...");
        const response = await fetchWithAuth(
          `https://mojoapi.siltet.com/api/currencies/${currencyId}`,
          { method: "GET" }
        );
  
        // console.log("Response status:", response.status);
  
        const data = await response.json();
        // console.log("Fetched data:", data);
  
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
        setLoading(false); // Ensure loading is set to false
      }
    };
  
    fetchCurrency();
  }, [currencyId]);
  

  // if (loading) {
  //   return <p className="text-center">Loading...</p>;
    
  // }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <BackLink href="/admin-dashboard/currency">
            <ArrowLeft className="h-4 w-4" />
            <h1 className="text-lg font-semibold">View Currency</h1>
          </BackLink>
        </div>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            View Information
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Currency Name
              </h3>
              <p className="text-base">{currencyData.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Sign
              </h3>
              <p className="text-base">{currencyData.sign}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    currencyData.status === "Active" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span>{currencyData.status}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
