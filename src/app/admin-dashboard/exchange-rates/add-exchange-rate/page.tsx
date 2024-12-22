"use client";
import { cn } from "@/lib/utils";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react";
import BackLink from "@/components/BackLink";

export default function AddCurrencyForm() {
  const [date, setDate] = useState<Date>();
  const [isPending, setIsPending] = useState(false);
  const [currency, setCurrency] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Authentication token not found.");
      setErrorMessage("Authentication token not found.");
      return;
    }

    // Prepare the form data to send
    const formData = {
      currency: currency,
      exchangeRate: exchangeRate,
      effectiveDate: date ? format(date, "yyyy-MM-dd") : null, // Format the date if it is selected
    };

    try {
      setIsPending(true); // Start the pending state

      // Send the data to the API
      const response = await fetch("https://mojoapi.grandafricamarket.com/api/rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle success: Reset form
        setCurrency("");
        setExchangeRate("");
        setDate(undefined);
        setErrorMessage(null); // Clear any previous error messages
      } else {
        if (response.status === 403) {
          setErrorMessage("You do not have permission to perform this action.");
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "Unknown error");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsPending(false); // Reset the pending state
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
          <Button variant="ghost">Cancel</Button>
          <Button
            type="submit"
            form="currency-form"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-xl font-semibold mb-1">Add New Currency</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Fill in the information
          </p>

          {errorMessage && (
            <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
          )}

          <form
            id="currency-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="currency"
                className="text-sm text-muted-foreground"
              >
                Currency
              </label>
              <Select
                name="currency"
                required
                value={currency}
                onValueChange={(value) => setCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD - US Dollar</SelectItem>
                  <SelectItem value="eur">EUR - Euro</SelectItem>
                  <SelectItem value="gbp">GBP - British Pound</SelectItem>
                  <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="exchange-rate"
                className="text-sm text-muted-foreground"
              >
                Exchange Rate
              </label>
              <Input
                id="exchange-rate"
                name="exchangeRate"
                type="number"
                step="0.0001"
                required
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="effective-date"
                className="text-sm text-muted-foreground"
              >
                Effective Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "yyyy-MM-dd") : "Select date"}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
