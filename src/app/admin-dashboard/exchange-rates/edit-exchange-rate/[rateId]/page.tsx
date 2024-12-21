"use client";
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
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import BackLink from "@/components/BackLink";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";

export default function EditCurrencyForm() {
  const router = useRouter();
  const { rateId } = useParams(); // Extract rateId from URL

  const [initialData, setInitialData] = useState<any>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<any>({
    Id: "",
    rate: "",
    effective_date: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch exchange rate data asynchronously based on rateId
  useEffect(() => {
    if (!rateId) {
      toast.error("Rate ID is missing");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(
          `https://mojoapi.siltet.com/api/rates/${rateId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch exchange rate data");
        }
        const data = await response.json();
        console.log(data)
        setInitialData(data);
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rateId]);

  // Prefill form fields after data is loaded
  useEffect(() => {
    if (initialData) {
      setDate(
        initialData.effective_date ? new Date(initialData.effective_date) : null
      );
      setCurrency(initialData.currency_id ? initialData.currency_id.toString() : ""); // Set currency_id correctly
      setExchangeRate({
        rate: initialData.rate,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requestData = {
      currency_id: currency,
      rate: exchangeRate.rate,
      effective_date: date ? format(date, "yyyy-MM-dd") : null,
    };

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("Authentication failed. Please log in.");
        return;
      }

      // Include the token in the request headers
      const response = await fetchWithAuth(
        `https://mojoapi.siltet.com/api/rates/${rateId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        toast.success("Exchange rate updated successfully!");
        router.push("/admin-dashboard/exchange-rates");
      } else {
        const result = await response.json();
        // Log the response to understand why it's failing
        setCurrencyData({
          name: result.result.id,
          status: result.result.rate,
          sign: result.result.effective_date,
        });
        console.error("Error Response:", result);
        toast.error(result.message || "Failed to update exchange rate");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("An error occurred while updating the exchange rate");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <BackLink href="/admin-dashboard/exchange-rates">
            <ArrowLeft className="w-4 h-4" />
            Edit Exchange Rate
          </BackLink>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="currency-form"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Submit
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-xl font-semibold mb-1">Edit Rate</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Update the exchange rate information.
          </p>

          <form id="currency-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm text-muted-foreground">
                Currency
              </label>
              <Select
                value={setExchangeRate.Id || ""}
                onValueChange={(value) => setCurrency(value)}
                required
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
              <label htmlFor="exchange-rate" className="text-sm text-muted-foreground">
                Exchange Rate
              </label>
              <Input
                id="exchange-rate"
                name="exchangeRate"
                type="number"
                step="0.0001"
                value={exchangeRate.rate || ""}
                onChange={(e) => setExchangeRate({ rate: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="effective-date" className="text-sm text-muted-foreground">
                Effective Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : "Pick a date"}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
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
