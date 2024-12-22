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
import { useParams } from "next/navigation";
import { fetchWithAuth } from '@/components/utils/fetchwitAuth';

export default function EditCurrencyForm() {
  const { currencyId } = useParams(); // Get currency ID from URL params
  const [currencyData, setCurrencyData] = useState({
    name: "",
    status: "",
    sign: "",
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    // console.log("currencyId:", currencyId);


    const fetchCurrency = async () => {
      try {
        const response = await fetchWithAuth(
          `https://mojoapi.grandafricamarket.com/api/currencies/${currencyId}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        // console.log(data)

        setCurrencyData({
          name: data.data.name,
          status: data.data.status,
          sign: data.data.sign,
        });
      } catch (err) {
        console.error("Failed to fetch currency data:", err);
        setError("Failed to load currency data");
      }
    };

    fetchCurrency();
  }, [currencyId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsPending(true);

    try {
      const token = localStorage.getItem("authToken");
      // if (!token) throw new Error("Unauthorized user");

      const response = await fetchWithAuth(
        `https://mojoapi.grandafricamarket.com/api/currencies/${currencyId}`,
        {
          method: "POST",
          
          body: JSON.stringify(currencyData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      // console.log("Currency updated:", data);
      alert("Currency updated successfully!");
    } catch (err) {
      console.error("Failed to update currency:", err);
      setError("Failed to update currency");
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

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <BackLink>
            <ArrowLeft className="w-4 h-4" />
            Edit Currency
          </BackLink>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button type="submit" form="currency-form" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl font-semibold mb-1">Edit Currency</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Fill in the information
          </p>

          {error && <p className="text-red-500">{error}</p>}

          <form
            id="currency-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label htmlFor="currency-name" className="text-sm font-medium">
                Currency Name
              </label>
              <Input
                id="currency-name"
                name="currencyName"
                value={currencyData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className="max-w-md"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={currencyData.status}
                onValueChange={(value) => handleChange("status", value)}
                required
              >
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="sign" className="text-sm font-medium">
                Sign
              </label>
              <Input
                id="sign"
                name="sign"
                value={currencyData.sign}
                onChange={(e) => handleChange("sign", e.target.value)}
                required
                className="max-w-md"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
