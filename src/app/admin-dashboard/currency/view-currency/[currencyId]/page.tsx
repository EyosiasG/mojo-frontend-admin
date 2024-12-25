"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import BackLink from "@/components/BackLink";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { useParams } from "next/navigation";

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
          `https://mojoapi.grandafricamarket.com/api/currencies/${currencyId}`,
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
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-medium bg-red-50 px-6 py-4 rounded-lg shadow-sm">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <BackLink href="/admin-dashboard/currency" className="group flex items-center gap-3 hover:opacity-75 transition-all">
              <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-gray-200 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                View Currency
              </h1>
            </BackLink>
          </div>
        </header>

        <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-lg p-8">
          <section>
            <h2 className="text-xl font-bold mb-8 pb-4 border-b border-gray-200 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Currency Information
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                  Currency Name
                </h3>
                <p className="text-2xl font-bold text-gray-900">{currencyData.name || "—"}</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                  Sign
                </h3>
                <p className="text-2xl font-bold text-gray-900">{currencyData.sign || "—"}</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                  Status
                </h3>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      currencyData.status === "Active"
                        ? "bg-gradient-to-r from-green-400 to-green-500 shadow-lg shadow-green-200"
                        : "bg-gradient-to-r from-red-400 to-red-500 shadow-lg shadow-red-200"
                    }`}
                  ></div>
                  <span className="text-2xl font-bold text-gray-900">
                    {currencyData.status || "—"}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
