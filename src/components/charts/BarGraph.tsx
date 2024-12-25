import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { fetchWithAuth } from "../utils/fetchwitAuth";

const BarGraph = () => {
  const [monthlyData, setMonthlyData] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetchWithAuth("https://mojoapi.grandafricamarket.com/api/transactions");
      const result = await response.json();
      const transactions = result.data;

      const monthlyTotals = Array(12).fill(0);
      transactions.forEach(transaction => {
        const month = new Date(transaction.created_at).getMonth();
        monthlyTotals[month] += parseFloat(transaction.amount);
      });

      setMonthlyData(monthlyTotals);
    };

    fetchTransactions();
  }, []);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Transactions</h2>
      </div>
      <div className="h-[300px] flex items-end gap-2">
        {/* Placeholder for bar chart */}
        {monthlyData.map((amount, i) => (
          <div
            key={i}
            className="bg-primary/90 w-full rounded-t"
            style={{
              height: `${(amount / Math.max(...monthlyData)) * 100}%`,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
        <span>Oct</span>
        <span>Nov</span>
        <span>Dec</span>
      </div>
    </Card>
  );
};

export default BarGraph;
