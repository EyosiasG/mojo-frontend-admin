"use client";

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
import { useState } from "react";
import BackLink from "@/components/BackLink";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

export default function AddCurrencyForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    sign: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
  
    try {
      const data = await fetchWithAuth("https://mojoapi.grandafricamarket.com/api/currencies", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      console.log("Currency added:", data);
      toast.success("Currency added successfully!", {
        autoClose: 2000 // 2 seconds delay
      });

      // Reset form
      setFormData({ name: "", status: "", sign: "" });
      
      // Delay navigation to show toast
      setTimeout(() => {
        router.push("/admin-dashboard/currency");
      }, 2000);
    } catch (err) {
      console.error("Failed to add currency:", err);
      toast.error("Failed to add currency. Please try again.");
    } finally {
      setIsPending(false);
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="top-right" />
      <div className="flex items-center justify-between p-6 border-b bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="flex items-center gap-4">
          <BackLink href="/admin-dashboard/currency" className="group flex items-center gap-3 hover:opacity-75 transition-all">
            <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-gray-200 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-semibold">Add New Currency</span>
          </BackLink>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={() => setFormData({ name: "", status: "", sign: "" })}
            className="hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="currency-form" 
            disabled={isPending}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-200"
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Add New Currency
          </h1>
          <p className="text-gray-500 mb-8">Fill in the currency information below</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form id="currency-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="currency-name" className="text-sm font-semibold text-gray-700">
                Currency Name
              </label>
              <Input
                id="currency-name"
                name="name"
                value={formData.name}
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
                name="status"
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
                value={formData.sign}
                onChange={(e) => handleChange("sign", e.target.value)}
                required
                className="max-w-md border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter currency sign"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
