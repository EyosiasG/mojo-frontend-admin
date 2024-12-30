import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchWithAuth } from "../utils/fetchwitAuth";

const AdminProjectedBarGraph = () => {
  const [monthlyData, setMonthlyData] = useState<{ name: string; actual: number }[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetchWithAuth("https://mojoapi.crosslinkglobaltravel.com/api/transactions");
      const result = await response.json();
      const transactions = result.data;

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyTotals = months.map(month => ({
        name: month,
        actual: 0
      }));

      transactions.forEach(transaction => {
        const month = new Date(transaction.created_at).getMonth();
        monthlyTotals[month].actual += parseFloat(transaction.amount);
      });

      setMonthlyData(monthlyTotals);
    };

    fetchTransactions();
  }, []);

  return (
    <Card className="p-4 w-full">
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
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="actual" fill="#1e40af" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AdminProjectedBarGraph;
