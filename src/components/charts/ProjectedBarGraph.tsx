import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchWithAuth } from "../utils/fetchwitAuth";

const ProjectedBarGraph = () => {
  const [monthlyData, setMonthlyData] = useState<{ name: string; actual: number }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchWithAuth("https://mojoapi.crosslinkglobaltravel.com/api/agent/dashboard");
        const result = await response.json();
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyTotals = months.map((month, index) => ({
          name: month,
          actual: result.users?.[index + 1] || 0 // Changed from transactions to users
        }));

        setMonthlyData(monthlyTotals);
      } catch (error) {
        console.error('Error fetching user data:', error); // Updated error message
        setMonthlyData([]);
      }
    };

    fetchUsers(); // Renamed function call
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
          <Bar dataKey="actual"  name="Number of Users" fill="#1e40af" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ProjectedBarGraph;
