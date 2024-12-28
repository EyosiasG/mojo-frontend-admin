"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import { toast, ToastContainer } from "react-toastify";
import BackLink from "@/components/BackLink";
import { ArrowLeft } from "lucide-react";

export default function EditExchangeRate() {
  const { rateId } = useParams();
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetchWithAuth(`https://mojoapi.crosslinkglobaltravel.com/api/rates/${rateId}`);
        if (!response.ok) throw new Error("Failed to fetch rate");
        const data = await response.json();
        setRate(data.data);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <ToastContainer />
      <BackLink href="/admin-dashboard/exchange-rates">
        <ArrowLeft /> Back to Exchange Rates
      </BackLink>
      <h1>Edit Exchange Rate for {rate?.currency_id}</h1>
    </div>
  );
}
