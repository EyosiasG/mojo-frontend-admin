import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { fetchWithAuth } from "../utils/fetchwitAuth";

const ProjectedBarGraph = () => {
  const [monthlyData, setMonthlyData] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetchWithAuth("https://mojoapi.grandafricamarket.com/api/users");
      const result = await response.json();
      console.log("API Response:", result);
      const users = result.users;
      console.log("Users: ", users);

      const monthlyTotals = Array(12).fill(0);
      users.forEach(user => {
        if (user.created_at) {
          const month = new Date(user.created_at).getMonth();
          console.log("Month: ", month);
          monthlyTotals[month] += 1;
        }
      });

      console.log("Monthly Totals:", monthlyTotals);
      setMonthlyData(monthlyTotals);
    };

    fetchUsers();
  }, []);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Users</h2>
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

export default ProjectedBarGraph;
