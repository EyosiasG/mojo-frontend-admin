"use client"
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
async function fetchTotalTransactions() {
    try {
      const response = await fetchWithAuth("https://mojoapi.grandafricamarket.com/api/transactions");
      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
  
      // Check if data is an array
      if (!Array.isArray(result.data)) {
        throw new Error("Expected an array of transactions");
      }
  
      // Sum the amounts, converting them to numbers
      return result.data.reduce((total, transaction) => {
        const amount = parseFloat(transaction.amount) || 0; // Convert to number
        return total + amount; // Sum the amounts
      }, 0); // Initial total is 0
    } catch (error) {
      console.error("Error fetching total transactions:", error);
      return 0; // Return 0 or handle the error as needed
    }
  }

export default fetchTotalTransactions; // Export the function

const [totalTransactions, setTotalTransactions] = useState(0); // State to hold total transactions
const [date, setDate] = useState(new Date()); // State for date

useEffect(() => {
  const getTotal = async () => {
    const total = await fetchTotalTransactions();
    setTotalTransactions(total); // Update state with total
    setDate(new Date()); // Set date on client side
  };
  getTotal();
}, []); // Fetch total and set date on component mount