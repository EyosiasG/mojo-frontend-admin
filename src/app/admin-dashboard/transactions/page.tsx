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
  Loader2,
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
import { PDFDocument, rgb } from 'pdf-lib';

export default function TransferPage() {
  const [transactions, setTransactions] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add this line at the top of your component
  const [currencies, setCurrencies] = useState([]);

  // Fetch transaction data from API
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://mojoapi.crosslinkglobaltravel.com/api/admin/transfers", {
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

  const fetchCurrencies = async () => {
    try {
      const response = await fetchWithAuth(
        "https://mojoapi.crosslinkglobaltravel.com/api/admin/currencies"
      ).catch(error => {
        console.error('Network error:', error);
        throw new Error('Network connection failed - please check your internet connection');
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.data) {
        console.warn('No currencies data in response:', data);
        throw new Error('Invalid response format from server');
      }
      setCurrencies(data.data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.log("Error :", errorMessage);

      console.error('Detailed error information:', {
        error: err,
        timestamp: new Date().toISOString(),
        endpoint: "https://mojoapi.crosslinkglobaltravel.com/api/admin/currencies"
      });
    }
  };

  // Add this helper function to get currency sign
  const getCurrencySign = (currencyId) => {
    if (!currencyId) return '$'; // Default currency sign if no ID is provided
    
    const numericCurrencyId = parseInt(currencyId, 10);
    const currency = currencies.find(c => c.id === numericCurrencyId);
    
    // Return default sign if currency not found
    return currency?.sign || '$';
  };

  useEffect(() => {
    fetchTransactions();
    fetchCurrencies(); // Make sure to fetch currencies when component mounts
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

  const handleSearch = async () => {
    if (searchTerm) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://mojoapi.crosslinkglobaltravel.com/api/admin/transactions/search/${searchTerm}`, {
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
        
        // Check if the status is success before setting transactions
        if (data.status === "success" && Array.isArray(data.data)) {
          setTransactions(data.data); // Set transactions only if status is success
        } else {
          setTransactions([]);
        }
        console.log("Transactions: ", data.data);
      } catch (err) {
        setError(err.message);
        setTransactions([]);
        console.log("Transactions: ", transactions);
      } finally {
        setLoading(false);
      }
    } else {
      // Refetch all transactions when searchTerm is empty
      fetchTransactions(); // Call the existing fetch function
    }
  };

  return (
    <>
      <div className="bg-blue-50">
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 md:px-14 md:py-4">
          <h1 className="text-4xl font-semibold md:text-xl mb-3 sm:mb-0 text-primary">Transfer Money</h1>
          <div className="flex w-full sm:w-auto justify-center sm:justify-end gap-4">
            <NotificationProfile
              profileLink="/agent-dashboard/settings"
              notificationLink="/agent-dashboard/notifications"
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50">
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full md:w-auto bg-white">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 " />
            <Input 
              className="pl-10 w-full"
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
          
          <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
            <Button variant="outline" className="gap-2 w-full md:w-auto" onClick={handleSearch}> 
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 hidden md:table-cell">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          Transaction ID
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Sender</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden md:table-cell">ETB Amount</TableHead>
                      <TableHead className="hidden md:table-cell">Bank Name</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          <div className="flex justify-center items-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="ml-2">Loading transactions...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : Array.isArray(transactions) && transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.transaction_id} className="border-b last:border-b-0">
                          <TableCell className="hidden md:table-cell">
                            <Checkbox />
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                              {transaction.transaction_id}
                            </div>
                          </TableCell>
                          <TableCell>{transaction.sender_name}</TableCell>
                          <TableCell>{transaction.receiver_name}</TableCell>
                          <TableCell>
                            {(() => {
                              const sign = getCurrencySign(transaction.currency_id);
                              const amount = transaction.amount || '0.00';
                              return `${sign}${amount}`;
                            })()}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {transaction.etb_amount}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {transaction.bank_name}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(transaction.created_at)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${
                                transaction.status === "success" ? "bg-green-500" :
                                transaction.status === "failed" ? "bg-red-500" : "bg-yellow-500"
                              }`} />
                              <span className={`capitalize ${
                                transaction.status === "success" ? "text-green-500" :
                                transaction.status === "failed" ? "text-red-500" : "text-yellow-500"
                              }`}>
                                {transaction.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Link href={`transactions/view-transaction/${transaction.id}`} className="w-full">
                                    View
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {loading ? (
            null // Don't show anything while loading
          ) : transactions.length > 0 ? (
            <div className="flex items-center justify-between px-4 py-4 flex-wrap">
              <div className="text-sm text-gray-500 w-full text-center md:text-left md:w-auto">
                Showing 1 to 10 of {transactions.length} results
              </div>
            </div>
          ) : (
            <div className="text-red-500 text-center py-4">No transactions found!</div>
          )}
        </div>
      </div>
    </>
  );
}
