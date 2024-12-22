"use client";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  MoreVertical,
  Search,
  Send,
  Trash2,
  Filter,
  Download,
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
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";

export default function TransferPage() {
  const [transactions, setTransactions] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch transaction data from API
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://mojoapi.siltet.com/api/transfers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error Response:", errorBody);
        const parsedError = JSON.parse(errorBody);
        
        // Enhanced error handling
        const errorMessage = parsedError.message || "Failed to fetch data";
        const detailedError = parsedError.error ? JSON.parse(parsedError.error) : null;
        const detailedMessage = detailedError ? detailedError.message : "";

        setError(`${errorMessage} ${detailedMessage}`.trim() || "Failed to fetch data");
        return;
      }
      const data = await response.json();
      console.log("Fetched Response:", data);

      // Handle successful response
      if (data.status === "success" && Array.isArray(data.data)) {
        setTransactions(data.data); // Store the array of transactions
      } else {
        setError("No transactions found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTransactions(); // Fetch transactions when the component mounts
  }, []);

  // Format Date and Time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short", // Abbreviated month name (e.g., "Dec")
      day: "numeric", // Day of the month (e.g., "8")
      year: "numeric", // Full year (e.g., "2024")
    });
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit", // 2-digit hour
      minute: "2-digit", // 2-digit minute
      hour12: true, // 12-hour clock format
    });
  };

  return (
    <>
      <div className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-[#2B3674]">
            Transfer Money
          </h1>
          <div className="flex items-center gap-4">
            <Link href="transfer/step-one">
              <Button className="gap-2 rounded-full bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
                Send Money
              </Button>
            </Link>
            <NotificationProfile
              profileLink="/agent-dashboard/settings"
              notificationLink="/agent-dashboard/notifications"
            />
          </div>
        </div>
      </div>

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
            <Link href="transfer/step-one" className="flex">
              <Button className="gap-2 rounded-full bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
                Send Money
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}

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
                    Date
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
              {Array.isArray(transactions) && transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.transaction_id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{transaction.transaction_id}</TableCell>
                    <TableCell>{transaction.sender_name}</TableCell>
                    <TableCell>{transaction.receiver_name}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{formatDate(transaction.created_at)}</TableCell>
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
                            <Link
                              href={`transfer/view-transaction/${transaction.id}`}
                            >
                              view
                            </Link>
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem>Delete</DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm text-gray-500">
              Showing 1 to 10 of {transactions.length} results
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
