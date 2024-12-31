import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchWithAuth } from "../utils/fetchwitAuth";

const AdminProjectedBarGraph = () => {
  const [monthlyData, setMonthlyData] = useState<{ name: string; users: number }[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetchWithAuth("https://mojoapi.crosslinkglobaltravel.com/api/transactions");
      const result = await response.json();
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyTotals = months.map((month, index) => ({
        name: month,
        users: result.users[index + 1] || 0
      }));

      setMonthlyData(monthlyTotals);
    };

    fetchUserData();
  }, []);

  return (
    <Card className="p-4 w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">Monthly User Distribution</h2>
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
          <Bar dataKey="users" fill="#1e40af" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AdminProjectedBarGraph;
