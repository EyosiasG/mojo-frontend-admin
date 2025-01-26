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
import { useState, useEffect } from "react";
import BackLink from "@/components/BackLink";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationProfile from "@/components/NotificationProfile";

interface Currency {
  id: string;
  name: string;
  sign: string;
}

export default function AddExchangeRate() {
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [isPending, setIsPending] = useState(false);
  const [currency_id, setCurrency_id] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetchWithAuth(
          "https://mojoapi.crosslinkglobaltravel.com/api/admin/currencies"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch currencies");
        }
        const data = await response.json();
        setCurrencies(data.data || []);
      } catch (err) {
        console.error("Error fetching currencies:", err);
        toast.error("Failed to load currencies");
      }
    };

    fetchCurrencies();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    if (!date) {
      toast.error("Please select an effective date");
      return;
    }

    const formData = {
      currency_id,
      rate,
      effective_date: format(date, "yyyy-MM-dd"),
    };

    try {
      setIsPending(true);

      const response = await fetchWithAuth(
        "https://mojoapi.crosslinkglobaltravel.com/api/admin/rates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success('Exchange rate added successfully!', {
          autoClose: 2000,
          onClose: () => {
            router.push("/admin-dashboard/exchange-rates");
          }
        });
      } else {
        if (response.status === 403) {
          toast.error("You do not have permission to perform this action");
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to add exchange rate");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-primary">
         Exchange Rates
        </h1>
        <div className="flex items-center gap-2">
          <NotificationProfile
            profileLink="/admin-dashboard/settings"
            notificationLink="/admin-dashboard/notifications"
          />
        </div>
      </div>
      <div className="max-w-2xl mx-auto mb-6">
          <BackLink href="/admin-dashboard/exchange-rates" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Exchange Rates</span>
          </BackLink>
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-5">
          <h1 className="text-2xl font-semibold mb-2">Add New Exchange Rate</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Set up a new exchange rate for a currency
          </p>

          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {errorMessage}
            </div>
          )}

          <form
            id="exchange-rate-form"
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <div className="space-y-3">
              <label
                htmlFor="currency_id"
                className="text-sm font-medium text-foreground"
              >
                Currency
              </label>
              <select
                name="currency_id"
                required
                value={currency_id}
                onChange={(e) => setCurrency_id(e.target.value)}
                className="block w-full h-12 border rounded p-2"
              >
                <option value="">Select a currency</option>
                {currencies.map((curr) => (
                  <option key={curr.id} value={curr.id}>
                    {curr.name} ({curr.sign})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="rate"
                className="text-sm font-medium text-foreground"
              >
                Exchange Rate
              </label>
              <Input
                id="rate"
                name="rate"
                type="number"
                step="0.0001"
                required
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="h-12"
                placeholder="Enter exchange rate"
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="effective-date"
                className="text-sm font-medium text-foreground"
              >
                Effective Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "MMMM d, yyyy") : "Select effective date"}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => router.push("/admin-dashboard/exchange-rates")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="exchange-rate-form"
            className="bg-primary hover:bg-primary/90"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="animate-spin mr-2">⌛</span>
                Submitting...
              </>
            ) : (
              "Add Exchange Rate"
            )}
          </Button>
        </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}
