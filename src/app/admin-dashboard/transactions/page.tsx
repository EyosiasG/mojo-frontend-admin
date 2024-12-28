"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  MoreVertical,
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
import { format } from "date-fns";
import { fetchWithAuth } from "../../../components/utils/fetchwitAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TransferPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  async function fetchTransactions() {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        return;
      }

      const response = await fetch(
        "https://mojoapi.crosslinkglobaltravel.com/api/transactions",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setTransactions(data.data);
        toast.success("Transactions loaded successfully");
      } else {
        toast.error(data.message || "Failed to fetch transactions.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  const handleSearch = async () => {
    if (searchTerm) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://mojoapi.crosslinkglobaltravel.com/api/transactions/search/${searchTerm}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch transaction");
        }
        const data = await response.json();
        
        if (data.status === "success" && Array.isArray(data.data)) {
          setTransactions(data.data);
          toast.success("Search results loaded successfully");
        } else {
          setTransactions([]);
          toast.info("No transactions found");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Search failed");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    } else {
      fetchTransactions();
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this exchange rate?"
    );
    if (!isConfirmed) return;

    try {
      const response = await fetchWithAuth(
        `https://mojoapi.crosslinkglobaltravel.com/api/transactions/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setTransactions(
          transactions.filter((transactions) => transactions.id !== id)
        );
        toast.success("Transaction deleted successfully");
      } else {
        toast.error("Failed to delete the exchange rate");
      }
    } catch (error) {
      toast.error("Failed to delete transaction");
      console.error("Failed to delete:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-600">Loading transactions...</p>
          <p className="text-sm text-gray-500">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="bg-red-50 p-6 rounded-lg max-w-md">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Transactions</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setError("");
              fetchTransactions();
            }}
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Transactions Found</h3>
          <p className="text-gray-500 mb-4">There are no transactions to display at this time.</p>
          <Button 
            variant="outline" 
            onClick={fetchTransactions}
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-primary">Transfer</h1>
        <div className="flex items-center gap-4">
          <NotificationProfile
            profileLink="/admin-dashboard/settings"
            notificationLink="/admin-dashboard/notifications"
          />
        </div>
      </header>

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input 
              className="pl-10" 
              placeholder="Search" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value === "") {
                  fetchTransactions();
                }
              }} 
            />
          </div>
          <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleSearch}> 
              <Search className="h-4 w-4" />
              Search
            </Button>
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
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  Transaction ID
                  <ChevronDown className="h-4 w-4" />
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Sender Name
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Recipient Names
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Amount
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Currency
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Date
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Time
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Status
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, i) => {
                const formattedDate = format(
                  new Date(transaction.created_at),
                  "MMMM dd, yyyy"
                );
                const time = new Date(
                  transaction.created_at
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <TableRow key={i}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{transaction.transaction_id}</TableCell>
                    <TableCell>{transaction.sender_name}</TableCell>
                    <TableCell>{transaction.receiver_name}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>USD</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>{time}</TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2 justify-center rounded-full p-1 ${
                            transaction.status === "success"
                              ? "bg-green-500/10"
                              : transaction.status === "failed"
                              ? "bg-red-500/10"
                              : "bg-yellow-500/10"
                          }`}>
                        <div
                          className={`h-2 w-2 rounded-full ${
                            transaction.status === "success"
                              ? "bg-green-500"
                              : transaction.status === "failed"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        <span
                          className={`capitalize ${
                            transaction.status === "success"
                              ? "text-green-500"
                              : transaction.status === "failed"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`./transactions/${transaction.id}`}>
                              VIew
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(transaction.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm text-gray-500">
              Showing 1 to 10 of {transactions.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
