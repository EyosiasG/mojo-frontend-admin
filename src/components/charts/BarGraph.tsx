import React from "react";
import { Card } from "../ui/card";

const BarGraph = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Transactions</h2>
      </div>
      <div className="h-[300px] flex items-end gap-2">
        {/* Placeholder for bar chart */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-primary/90 w-full rounded-t"
            style={{
              height: `${Math.random() * 100}%`,
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
