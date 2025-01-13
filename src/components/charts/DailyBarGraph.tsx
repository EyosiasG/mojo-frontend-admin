import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchWithAuth } from "../utils/fetchwitAuth";
import { transactionsApi } from "@/api/transactions";

const DailyBarGraph = () => {
  const [dailyData, setDailyData] = useState<{ name: string; value: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const result = await transactionsApi.getAllTransactions();
        
        // Calculate date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Filter and group transactions by day
        const dailyTotals = result.data
          .filter((transaction: any) => new Date(transaction.created_at) >= sevenDaysAgo)
          .reduce((acc: { [key: string]: number }, transaction) => {
            const date = new Date(transaction.created_at);
            const dayKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            acc[dayKey] = (acc[dayKey] || 0) + Number(transaction.amount);
            return acc;
          }, {});

        // Create array of last 7 days (including days with no transactions)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }).reverse();

        // Convert to array format needed for the chart, including zero values for days with no transactions
        const chartData = last7Days.map(date => ({
          name: date,
          value: Number((dailyTotals[date] || 0).toFixed(2))
        }));

        setDailyData(chartData);
      } catch (err) {
        console.error('Error fetching transaction data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chart data');
      }
    };

    fetchTransactions();
  }, []);

  if (error) {
    return <Card className="p-4 w-full text-center text-red-500">{error}</Card>;
  }

  return (
    <Card className="p-4 w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">Daily Transactions</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={dailyData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="value" 
            name="Amount of Daily Transactions"
            fill="#1e40af"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default DailyBarGraph;
