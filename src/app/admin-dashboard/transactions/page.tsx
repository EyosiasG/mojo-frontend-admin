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

export default function TransferPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        const response = await fetch(
          "https://mojoapi.grandafricamarket.com/api/transactions",
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
        } else {
          setError(data.message || "Failed to fetch transactions.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this exchange rate?"
    );
    if (!isConfirmed) return;

    try {
      const response = await fetchWithAuth(
        `https://mojoapi.grandafricamarket.com/api/transactions/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setTransactions(
          transactions.filter((transactions) => transactions.id !== id)
        );
      } else {
        alert("Failed to delete the exchange rate");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (transactions.length === 0) {
    return <div>No transactions found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
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
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            transaction.status === "successful"
                              ? "bg-green-500"
                              : transaction.status === "failed"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        <span
                          className={`capitalize ${
                            transaction.status === "successful"
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
