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

export default function AddCurrencyForm() {
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    sign: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };


    async function handleSubmit(e) {
      e.preventDefault();
      setIsPending(true);
      setError(null);
    
      try {
        const data = await fetchWithAuth("https://mojoapi.siltet.com/api/currencies", {
          method: "POST",
          body: JSON.stringify(formData),
        });
    
        console.log("Currency added:", data);
        alert("Currency added successfully!");
    
        // Reset form
        setFormData({ name: "", status: "", sign: "" });
      } catch (err) {
        console.error("Failed to add currency:", err);
        setError("Failed to add currency. Please try again.");
      } finally {
        setIsPending(false);
      }
    }
    
  
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <BackLink>
            <ArrowLeft className="w-4 h-4" />
            Add New Currency
          </BackLink>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setFormData({ name: "", status: "", sign: "" })}>
            Cancel
          </Button>
          <Button type="submit" form="currency-form" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl font-semibold mb-1">Add New Currency</h1>
          <p className="text-sm text-muted-foreground mb-6">Fill in the information</p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form id="currency-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="currency-name" className="text-sm font-medium">
                Currency Name
              </label>
              <Input
                id="currency-name"
                name="name"
                value={formData.name}
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
                name="status"
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
                value={formData.sign}
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
