import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchWithAuth } from "../utils/fetchwitAuth";

const AdminBarGraph = () => {
  const [monthlyData, setMonthlyData] = useState<{ name: string; value: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetchWithAuth("https://mojoapi.crosslinkglobaltravel.com/api/admin/dashboard");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.status !== "success" || !result.transactions) {
          throw new Error('Invalid data format received from server');
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyTotals = months.map((month, index) => ({
          name: month,
          value: Math.round((result.transactions[(index + 1).toString()] || 0) * 10) / 10
        }));

        setMonthlyData(monthlyTotals);
      } catch (err) {
        console.error('Error fetching transaction data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chart data');
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Card className="p-4 w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">Monthly Transaction Summary</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={monthlyData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `$${value}`} />
          <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
          <Legend />
          <Bar 
            dataKey="value" 
            fill="#1e40af"
            name="Amount of Monthly Transactions"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AdminBarGraph;
