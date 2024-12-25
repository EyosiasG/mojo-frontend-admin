"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import NotificationProfile from "@/components/NotificationProfile";
import { fetchWithAuth } from "../../../components/utils/fetchwitAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CurrencyEntry {
  id: string;
  name: string;
  sign: string;
  status: string;
  created_at: string;
}

export default function Page() {
  const [rates, setRates] = useState<CurrencyEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetching rates data from the API
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetchWithAuth(
          "https://mojoapi.grandafricamarket.com/api/rates",
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json"
            }
          }
        );
        const data = await response.json();
        console.log(data);
        // Check if the response is JSON
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not in JSON format");
        }

        // Handle case when no rates are found
        if (data.status === "failed" && data.message === "No Exchange rate found!") {
          setRates([]);
          return;
        }

        if (data.status === "success") {
          setRates(data.data);
        } else {
          setError("Failed to load exchange rates.");
          toast.error("Failed to load exchange rates");
        }
      } catch (err) {
        setError("Failed to load exchange rates.");
        toast.error("Failed to load exchange rates");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this exchange rate?"
    );
    if (!isConfirmed) return;

    try {
      const response = await fetch(
        `https://mojoapi.grandafricamarket.com/api/rates/${id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (response.ok) {
        setRates(rates.filter((rate) => rate.id !== id));
        toast.success("Exchange rate deleted successfully");
      } else {
        toast.error("Failed to delete the exchange rate");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete exchange rate");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-primary">
          Currency Exchange Rates
        </h1>
        <div className="flex items-center gap-2">
          <NotificationProfile
            profileLink="/admin-dashboard/settings"
            notificationLink="/admin-dashboard/notifications"
          />
          <div className="w-8 h-8 rounded-full bg-gray-200" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Link href="exchange-rates/add-exchange-rate">
            <Button>Create Exchange Rate</Button>
          </Link>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Rate ID</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Sign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No exchange rates found
                </TableCell>
              </TableRow>
            ) : (
              rates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>{rate.id}</TableCell>
                  <TableCell>{rate.name}</TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(rate.created_at))}
                  </TableCell>

                  <TableCell>{rate.sign}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        rate.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {rate.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link
                            href={`./exchange-rates/view-exchange-rate/${rate.id}`}
                          >
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href={`./exchange-rates/edit-exchange-rate/${rate.id}`}
                          >
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(rate.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
