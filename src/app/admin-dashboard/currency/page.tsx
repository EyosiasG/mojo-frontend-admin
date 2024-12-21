"use client";

import React, { useEffect, useState } from "react";
import {
  Download,
  Filter,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import NotificationProfile from "@/components/NotificationProfile";
import { fetchWithAuth } from "../../../components/utils/fetchwitAuth";

const CurrencyManagementPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth("https://mojoapi.siltet.com/api/currencies", {
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (!response || !response.ok) {
          throw new Error(`Error: ${response ? response.statusText : "No response"}`);
        }
    
        const data = await response.json();
        console.log("Fetched data:", data); // Confirm the structure of the response
    
        setCurrencies(data.data || []); // Assuming 'data' holds the array of currencies
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };    
    

    fetchCurrencies();
  }, []);

  const handleDelete = async (currencyId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this currency?"
    );
    if (!isConfirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated.");
      return;
    }

    try {
      const response = await fetch(
        `https://mojoapi.siltet.com/api/currencies/${currencyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      setCurrencies((prev) =>
        prev.filter((currency) => currency.id !== currencyId)
      );
    } catch (err) {
      console.error("Error deleting currency:", err.message);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Currency Management</h1>
        <NotificationProfile
          profileLink="/admin-dashboard/settings"
          notificationLink="/admin-dashboard/notifications"
        />
      </div>

      <div className="relative">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input className="pl-10" placeholder="Search" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Link href="currency/add-currency">
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <PlusCircle className="h-4 w-4" />
                Add Currency
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Table className="role-table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox />
            </TableHead>
            <TableHead>Currency ID</TableHead>
            <TableHead>Currency Name</TableHead>
            <TableHead>Sign</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currencies.map((currency) => (
            <TableRow key={currency.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{currency.id}</TableCell>
              <TableCell>{currency.name}</TableCell>
              <TableCell>{currency.sign}</TableCell>
              <TableCell>{currency.created_at}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center gap-1 ${
                    currency.status === "active"
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      currency.status === "active"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  />
                  {currency.status.charAt(0).toUpperCase() +
                    currency.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href={`currency/view-currency/${currency.id}`}>
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`currency/edit-currency/${currency.id}`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(currency.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CurrencyManagementPage;
