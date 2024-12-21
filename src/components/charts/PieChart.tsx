import React from "react";
import { Card } from "../ui/card";

const PieChart = () => {
  return (
    <Card className="p-6 flex-1">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold px-2">Your Pie Chart</h2>
      </div>
      <div className="mt-4 flex aspect-square items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-48 w-48 -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="20"
            className="text-primary"
            strokeDasharray={`${63 * 2.51} ${100 * 2.51}`}
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="20"
            className="text-primary/60"
            strokeDasharray={`${25 * 2.51} ${100 * 2.51}`}
            strokeDashoffset={`${-63 * 2.51}`}
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="20"
            className="text-primary/30"
            strokeDasharray={`${25 * 2.51} ${100 * 2.51}`}
            strokeDashoffset={`${-88 * 2.51}`}
          />
        </svg>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm text-gray-600">63%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary/60" />
          <span className="text-sm text-gray-600">25%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary/30" />
          <span className="text-sm text-gray-600">25%</span>
        </div>
      </div>
    </Card>
  );
};

export default PieChart;
