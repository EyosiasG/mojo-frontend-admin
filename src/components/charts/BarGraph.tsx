import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchWithAuth } from "../utils/fetchwitAuth";

const BarGraph = () => {
  const [monthlyData, setMonthlyData] = useState<{ name: string; value: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetchWithAuth("https://mojoapi.crosslinkglobaltravel.com/api/transfers");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (!result.data || !Array.isArray(result.data)) {
          throw new Error('Invalid data format received from server');
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyTotals = months.map(month => ({
          name: month,
          value: 0
        }));

        result.data.forEach(transaction => {
          const month = new Date(transaction.created_at).getMonth();
          monthlyTotals[month].value += parseFloat(transaction.amount) || 0;
        });

        setMonthlyData(monthlyTotals);
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
          <Bar 
            dataKey="value" 
            fill="#1e40af"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default BarGraph;
