"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BackLink from "@/components/BackLink";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from '@/components/utils/fetchwitAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationProfile from "@/components/NotificationProfile";
import { Loader2 } from "lucide-react";

export default function EditCurrencyForm() {
  const router = useRouter();
  const { currencyId } = useParams();
  const [currencyData, setCurrencyData] = useState({
    name: "",
    status: "",
    sign: "",
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await fetchWithAuth(
          `https://mojoapi.crosslinkglobaltravel.com/api/admin/currencies/${currencyId}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        setCurrencyData({
          name: data.data.name,
          status: data.data.status,
          sign: data.data.sign,
        });
      } catch (err) {
        console.error("Failed to fetch currency data:", err);
        setError("Failed to load currency data");
        toast.error("Failed to load currency data");
      }
    };

    fetchCurrency();
  }, [currencyId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsPending(true);

    try {
      const response = await fetchWithAuth(
        `https://mojoapi.crosslinkglobaltravel.com/api/admin/currencies/${currencyId}`,
        {
          method: "POST",
          body: JSON.stringify(currencyData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      toast.success("Currency updated successfully!", {
        autoClose: 2000
      });

      // Delay navigation to show toast
      setTimeout(() => {
        router.push("/admin-dashboard/currency");
      }, 2000);

    } catch (err) {
      console.error("Failed to update currency:", err);
      setError("Failed to update currency");
      toast.error("Failed to update currency");
    } finally {
      setIsPending(false);
    }
  }

  const handleChange = (key, value) => {
    setCurrencyData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <ToastContainer position="top-right" />
      <header className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold text-primary">Currency Management</h1>
        <div className="flex items-center gap-4">
          <NotificationProfile
            profileLink="/agent-dashboard/settings"
            notificationLink="/agent-dashboard/notifications"
          />
        </div>
      </header>
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <BackLink href="/admin-dashboard/currency" className="group flex items-center gap-3 hover:opacity-75 transition-all">
            <div>
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back to Currencies</span>
          </BackLink>
        </div>

      </div>

      <div className="w-full mx-auto p-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Edit Currency
          </h1>
          <p className="text-gray-500 mb-8">Update the currency information below</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form
            id="currency-form"
            onSubmit={handleSubmit}
            className="space-y-8 "
          >
            <div className="space-y-3">
              <label htmlFor="currency-name" className="text-sm font-semibold text-gray-700">
                Currency Name
              </label>
              <Input
                id="currency-name"
                name="currencyName"
                value={currencyData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className="max-w-md border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter currency name"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="status" className="text-sm font-semibold text-gray-700">
                Status
              </label>
              <Select
                value={currencyData.status}
                onValueChange={(value) => handleChange("status", value)}
                required
              >
                <SelectTrigger className="max-w-md border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label htmlFor="sign" className="text-sm font-semibold text-gray-700">
                Sign
              </label>
              <Input
                id="sign"
                name="sign"
                value={currencyData.sign}
                onChange={(e) => handleChange("sign", e.target.value)}
                required
                className="max-w-md border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter currency sign"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin-dashboard/currency")}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="currency-form"
                disabled={isPending}
                className="bg-primary text-white shadow-lg shadow-blue-200"
              >
                {isPending ? "Editing..." : "Edit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
