"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BackLink from "@/components/BackLink";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";

// Interface for Rate Data
interface Rate {
  id: string;
  name: string;
  rate:string;
  value: number;
  sign: string;
  created_at: string;
  status: string;
}

export default function ViewRate() {
  const { rateId } = useParams(); // Use useParams to access route params
  const [rate, setRate] = useState<Rate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRate() {
      try {
        const response = await fetchWithAuth(
          `https://mojoapi.grandafricamarket.com/api/rates/${rateId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch exchange rate");
        }
        const data = await response.json();
        // console.log(data)

        if (data.status === "success") {
          setRate(data.data); // Assuming the data is in a "data" object
        } else {
          setError("Rate not found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch exchange rate");
      } finally {
        setLoading(false);
      }
    }

    if (rateId) fetchRate();
  }, [rateId]);

  // Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <BackLink href="/exchange-rates">
          <ArrowLeft className="w-4 h-4" />
          <span>View Rate · {rate?.id}</span>
        </BackLink>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            View Rate Information
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Rate ID
              </h3>
              <p className="text-base">{rate?.id}</p>
            </div>

            {/* <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Currency Name
              </h3>
              <p className="text-base">{rate?.name}</p>
            </div> */}

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Exchange Rate
              </h3>
              <p className="text-base">{rate?.rate} {rate?.sign}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Effective Date
              </h3>
              <p className="text-base">
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(rate?.created_at))}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </h3>
              <p className={`text-base ${rate?.status === "active" ? "text-green-600" : "text-yellow-600"}`}>
                {rate?.status === "active" ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
