"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { toast, ToastContainer } from "react-toastify";
import BackLink from "@/components/BackLink";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from 'sweetalert2';
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import NotificationProfile from "@/components/NotificationProfile";

export default function EditExchangeRate() {
  const { rateId } = useParams();
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [formData, setFormData] = useState({
    currency_id: "",
    rate: "",
    effective_date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetchWithAuth(`https://mojoapi.crosslinkglobaltravel.com/api/rates/${rateId}`);
        if (!response.ok) throw new Error("Failed to fetch rate");
        const data = await response.json();
        setRate(data.data);
        setFormData({
          currency_id: data.data.currency_id,
          rate: data.data.rate,
          effective_date: data.data.effective_date,
        });
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (rateId) {
      fetchRate();
    }
  }, [rateId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetchWithAuth(
        `https://mojoapi.crosslinkglobaltravel.com/api/rates/${rateId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update exchange rate");
      }

      Swal.fire({
        title: 'Success!',
        text: 'Exchange rate updated successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        router.push("/admin-dashboard/exchange-rates");
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

   // Handle loading and error states
   if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (error) {
    toast.error(`Error: ${error}`);
    return null; // Prevent further rendering
  }

  return (
    <div className="container mx-auto py-6 px-10 space-y-8 min-h-screen bg-blue-50">
      <ToastContainer />
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

      <BackLink href="/admin-dashboard/exchange-rates" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Exchange Rates
      </BackLink>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Exchange Rate</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update the exchange rate details below
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency_id">Currency ID</Label>
              <Input
                id="currency_id"
                name="currency_id"
                value={formData.currency_id}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Rate</Label>
              <Input
                id="rate"
                name="rate"
                type="number"
                step="0.01"
                value={formData.rate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="effective_date">Effective Date</Label>
              <Input
                id="effective_date"
                name="effective_date"
                type="date"
                value={formData.effective_date}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Exchange Rate"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
