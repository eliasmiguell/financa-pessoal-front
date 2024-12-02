"use client";
"use client";

import { useEffect, useState } from "react";
import { DollarSign } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { ChartContainer, ChartConfig } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export default function ChartOverview() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  if (!isClient) {
    return null;
  }

  return (
    <Card className="w-full md:w-1/2 mt-4 p-4 md:max-w-[600px]">
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className="text-lg sm:text-xl text-gray-800">
            OverView Vendas
          </CardTitle>
          <DollarSign className="ml-auto w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false}>
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </CartesianGrid>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}



// import { DollarSign } from 'lucide-react';
// import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
// import { ChartContainer, ChartConfig } from '../ui/chart';
// import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

//  function ChartOverview() {
//   const chartData = [
//     { month: "January", desktop: 186, mobile: 80 },
//     { month: "February", desktop: 305, mobile: 200 },
//     { month: "March", desktop: 237, mobile: 120 },
//     { month: "April", desktop: 73, mobile: 190 },
//     { month: "May", desktop: 209, mobile: 130 },
//     { month: "June", desktop: 214, mobile: 140 },
//   ]
 
 
//   const chartConfig = {
//     desktop: {
//       label: "Desktop",
//       color: "#2563eb",
//     },
//     mobile: {
//       label: "Mobile",
//       color: "#60a5fa",
//     },
//   } satisfies ChartConfig

//   return(
//     <Card className='w-full md:w-1/2 mt-4 p-4 md:max-w-[600px]'>
//       <CardHeader>
//         <div className='flex items-center justify-center'>
//           <CardTitle className='text-lg sm:text-xl text-gray-800'>
//             OverView Vendas
//           </CardTitle>
//           <DollarSign className='ml-auto w-4 h-4'/>
//         </div>
//       </CardHeader>
//       <CardContent>
//       <ChartContainer config={chartConfig} className='min-h-[200px] w-full'>
//         <BarChart data={chartData}>
//           <CartesianGrid vertical={false}>
//             <XAxis
//             dataKey="month"
//             tickLine={false}
//             tickMargin={10}
//             axisLine={false}
//             tickFormatter={(value) => value.slice(0, 3)}
//             />
//             <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}/>
//             <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
//           </CartesianGrid>

//         </BarChart>

//       </ChartContainer>
//       </CardContent>

//     </Card>
//   )
// }

// export default ChartOverview;
