import { Card } from "../ui/card";

interface MonthData {
  month: string;
  projected: number;
  actual: number;
}

// Function to get the last 6 months
const getLastSixMonths = () => {
  const months = [];
  const date = new Date();
  for (let i = 0; i < 6; i++) {
    const month = new Date(date.getFullYear(), date.getMonth() - i, 1);
    months.push(month.toLocaleString('default', { month: 'long' }));
  }
  return months.reverse();
};

// Assuming you have a users array from your API response
const users = [
  // ... your user data here ...
];

const lastSixMonths = getLastSixMonths();
const data: MonthData[] = lastSixMonths.map((month) => {
  const projected = 0; // Set your projected value if needed
  const monthIndex = new Date(month).getMonth(); // Get the month index
  const year = new Date(month).getFullYear(); // Get the year

  const actualUsers = users.filter(user => {
    const userDate = new Date(user.created_at);
    const userMonth = userDate.getUTCMonth(); // Use UTC month
    const userYear = userDate.getUTCFullYear(); // Use UTC year

    // Log the comparison for debugging
    console.log(`Comparing: User Month: ${userMonth}, User Year: ${userYear} with Month: ${monthIndex}, Year: ${year}`);

    return userMonth === monthIndex && userYear === year;
  });

  // Log the users for the current month
  console.log(`Users for ${month}:`, actualUsers);

  const actual = actualUsers.length;

  return { month, projected, actual };
});

export default function NewUsersChart() {
  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.projected, d.actual))
  );
  const gridLines = Array.from({ length: 6 }, (_, i) =>
    Math.round((maxValue / 5) * i)
  );

  return (
    <Card className="w-full p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">New Users</h2>
      <div className="relative h-[300px]">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {gridLines.reverse().map((value, i) => (
            <div key={i} className="flex items-center w-full">
              <span className="text-xs text-gray-500 w-8">{value}</span>
              <div className="flex-1 border-b border-gray-100" />
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="absolute inset-0 pt-6 flex items-end justify-around">
          {data.map((item, index) => (
            <div key={index} className="h-full flex flex-col items-center w-16">
              <div className="relative w-full h-full flex flex-col justify-end">
                {/* Projected bar */}
                <div
                  className="w-full bg-blue-200 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ffffff20_10px,#ffffff20_20px)] top-0"
                  style={{
                    height: `${(item.projected / maxValue) * 50}%`,
                    maxHeight: "240px",
                  }}
                  role="graphics-symbol"
                  aria-label={`Projected users for ${item.month}: ${item.projected}`}
                />
                {/* Actual bar */}
                <div
                  className="w-full bg-primary mt-1 mb-0"
                  style={{
                    height: `${(item.actual / maxValue) * 50}%`,
                    maxHeight: "240px",
                  }}
                  role="graphics-symbol"
                  aria-label={`Actual users for ${item.month}: ${item.actual}`}
                />
              </div>
              <span className="mt-2 text-sm text-gray-500">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-200 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#ffffff40_2px,#ffffff40_4px)]" />
          <span className="text-sm text-gray-600">Projected Users</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary" />
          <span className="text-sm text-gray-600">Actual Users</span>
        </div>
      </div>
    </Card>
  );
}
