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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Currency {
  id: string;
  name: string;
  sign: string;
  status: string;
  created_at: string;
}

const CurrencyManagementPage = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      let url = "https://mojoapi.crosslinkglobaltravel.com/api/currencies";
      if (searchQuery) {
        url = `https://mojoapi.crosslinkglobaltravel.com/api/currencies/${searchQuery}`;
      }

      const response = await fetchWithAuth(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response || !response.ok) {
        throw new Error(`Error: ${response ? response.statusText : "No response"}`);
      }
  
      const data = await response.json();
      
      if (searchQuery) {
        // If searching by ID, wrap single currency in array
        setCurrencies(data.data ? [data.data] : []);
      } else {
        // For listing all currencies
        setCurrencies(data.data || []);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "An unknown error occurred");
      setCurrencies([]); // Clear currencies on error
      toast.error("Failed to fetch currencies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []); // Remove searchQuery dependency since we'll use button click

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    fetchCurrencies();
  };

  const handleDelete = async (currencyId: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this currency?"
    );
    if (!isConfirmed) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("User is not authenticated.");
      return;
    }

    try {
      const response = await fetch(
        `https://mojoapi.crosslinkglobaltravel.com/api/currencies/${currencyId}`,
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
      toast.success("Currency deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting currency:", err.message);
      toast.error(`Error: ${err.message}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600">Loading currencies...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 p-6 rounded-lg">
        <p className="text-red-600 font-medium">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => fetchCurrencies()}
        >
          Try Again
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-2 md:p-6 space-y-4 md:space-y-6">
      <ToastContainer position="top-right" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-semibold">Currency Management</h1>
        <NotificationProfile
          profileLink="/admin-dashboard/settings"
          notificationLink="/admin-dashboard/notifications"
        />
      </div>

      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input 
                className="pl-10 w-full" 
                placeholder="Search by currency ID" 
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Button onClick={handleSearchClick} className="w-full md:w-auto">
              Search
            </Button>
          </div>
          <div className="flex items-center">
            <Link href="currency/add-currency" className="w-full md:w-auto">
              <Button className="gap-2 bg-primary hover:bg-primary/90 w-full md:w-auto">
                <PlusCircle className="h-4 w-4" />
                Add Currency
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="role-table min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Currency ID</TableHead>
              <TableHead>Currency Name</TableHead>
              <TableHead className="hidden md:table-cell">Sign</TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
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
                <TableCell className="hidden md:table-cell">{currency.sign}</TableCell>
                <TableCell className="hidden md:table-cell">{currency.created_at}</TableCell>
                <TableCell className="hidden md:table-cell">
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
                      <Link href={`/admin-dashboard/currency/view-currency/${currency.id}`}>
                        <DropdownMenuItem>
                          View
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/admin-dashboard/currency/edit-currency/${currency.id}`}>
                        <DropdownMenuItem>
                          Edit
                        </DropdownMenuItem>
                      </Link>
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
    </div>
  );
};

export default CurrencyManagementPage;
