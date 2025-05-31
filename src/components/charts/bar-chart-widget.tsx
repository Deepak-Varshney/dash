// // "use client"

// // import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
// // import {
// //   ChartContainer,
// //   ChartLegend,
// //   ChartLegendContent,
// //   ChartTooltip,
// //   ChartTooltipContent,
// // } from "@/components/ui/chart"


// // export type BarChartWidgetProps = {
// //   title?: string
// //   data: BarChartDataItem[]
// //   color?: string // default fallback
// //   barKey?: string // used internally for <Bar />
// //   xLabel?: string // label for X-Axis
// // }

// // export function BarChartWidget({
// //   title,
// //   data,
// //   color = "#2563eb",
// //   barKey = "value",
// //   xLabel = "label",
// // }: BarChartWidgetProps) {
// //   const chartData = data.map((item) => ({
// //     [xLabel]: item.label,
// //     [barKey]: item.value,
// //   }))

// //   const config = {
// //     [barKey]: {
// //       label: title ?? "Count",
// //       color,
// //     },
// //   }

// //   return (
// //     <div className="space-y-2 w-full">
// //       {title && <h3 className="text-lg font-medium">{title}</h3>}
// //       <ChartContainer config={config} className="min-h-[300px] w-full">
// //         <BarChart accessibilityLayer data={chartData}>
// //           <CartesianGrid vertical={false} />
// //           <XAxis
// //             dataKey={xLabel}
// //             tickLine={false}
// //             tickMargin={10}
// //             axisLine={false}
// //           />
// //           <ChartTooltip content={<ChartTooltipContent />} />
// //           <ChartLegend content={<ChartLegendContent />} />
// //           <Bar dataKey={barKey} fill={color} radius={4} />
// //         </BarChart>
// //       </ChartContainer>
// //     </div>
// //   )
// // }


// // components/charts/BarChartWidget.tsx
// "use client"

// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   Tooltip,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
// } from "recharts"
// import {
//   ChartContainer,
//   ChartLegend,
//   ChartTooltipContent,
// } from "@/components/ui/chart"

// export interface ChartDataItem {
//   label: string
//   value: number
// }

// interface BarChartWidgetProps {
//   title: string
//   data: ChartDataItem[]
//   color?: string
// }

// export function BarChartWidget({ title, data, color = "#2563eb" }: BarChartWidgetProps) {
//   const chartConfig = {
//     value: {
//       label: title,
//       color,
//     },
//   }

//   return (
//     <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//           <CartesianGrid vertical={false} />
//           <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
//           <YAxis allowDecimals={false} />
//           <Tooltip content={<ChartTooltipContent />} />
//           <ChartLegend />
//           <Bar dataKey="value" fill={color} radius={4} />
//         </BarChart>
//       </ResponsiveContainer>
//     </ChartContainer>
//   )
// }

// interface PieChartWidgetProps {
//   title: string
//   data: ChartDataItem[]
//   colors?: string[]
// }

// export function PieChartWidget({ title, data, colors = ["#2563eb", "#60a5fa", "#1e3a8a", "#3b82f6"] }: PieChartWidgetProps) {
//   return (
//     <ChartContainer
//       config={{}}
//       className="min-h-[200px] w-full"
//       title={title}
//     >
//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie
//             data={data}
//             dataKey="value"
//             nameKey="label"
//             cx="50%"
//             cy="50%"
//             outerRadius={80}
//             label
//           >
//             {data.map((_, index) => (
//               <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//             ))}
//           </Pie>
//           <Tooltip content={<ChartTooltipContent />} />
//         </PieChart>
//       </ResponsiveContainer>
//     </ChartContainer>
//   )
// }

// interface LineChartWidgetProps {
//   title: string
//   data: ChartDataItem[]
//   color?: string
// }

// export function LineChartWidget({ title, data, color = "#2563eb" }: LineChartWidgetProps) {
//   const chartConfig = {
//     value: {
//       label: title,
//       color,
//     },
//   }

//   return (
//     <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
//           <YAxis allowDecimals={false} />
//           <Tooltip content={<ChartTooltipContent />} />
//           <ChartLegend />
//           <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3 }} />
//         </LineChart>
//       </ResponsiveContainer>
//     </ChartContainer>
//   )
// }


// // components/charts/BaseChartWidget.tsx
// "use client"

// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   Tooltip,
//   LineChart,
//   Line,
// } from "recharts"
// import { ChartContainer, ChartLegend, ChartTooltipContent } from "@/components/ui/chart"

// export interface ChartDataItem {
//   label: string
//   value: number
// }

// interface BaseChartWidgetProps {
//   title: string
//   data: ChartDataItem[]
//   color?: string
//   type?: "bar" | "line"
// }

// export function BaseChartWidget({ title, data, color = "#2563eb", type = "bar" }: BaseChartWidgetProps) {
//   const chartConfig = {
//     value: {
//       label: title,
//       color,
//     },
//   }

//   const formattedData = data.map((item) => ({
//     ...item,
//     value: item.value,
//   }))

//   const ChartComponent = type === "line" ? LineChart : BarChart
//   const DataComponent = type === "line" ? (
//     <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3 }} />
//   ) : (
//     <Bar dataKey="value" fill={color} radius={4} />
//   )

//   return (
//     <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
//       <ResponsiveContainer width="100%" height={300}>
//         <ChartComponent data={formattedData}>
//           <CartesianGrid vertical={false} />
//           <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
//           <YAxis allowDecimals={false} />
//           <Tooltip content={<ChartTooltipContent />} />
//           <ChartLegend />
//           {DataComponent}
//         </ChartComponent>
//       </ResponsiveContainer>
//     </ChartContainer>
//   )
// }


"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { ChartContainer, ChartLegend, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export interface ChartDataItem {
  label: string;
  value: number;
}

interface BaseChartWidgetProps {
  title: string;
  data: ChartDataItem[];
  color?: string; // You can keep this as an optional prop for overriding default colors
  type?: "bar" | "line";
}

export function BaseChartWidget({
  title,
  data,
  color = 'var(--primary)', // Default to primary color from your custom properties
  type = "bar",
}: BaseChartWidgetProps) {
  const chartConfig = {
    value: {
      label: title,
      color,
    },
  };

  const formattedData = data.map((item) => ({
    ...item,
    value: item.value,
  }));

  const ChartComponent = type === "line" ? LineChart : BarChart;
  const DataComponent = type === "line" ? (
    <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3 }} />
  ) : (
    <Bar dataKey="value" fill={color} radius={4} />
  );

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer config={chartConfig} className="bg-transparent min-h-[200px] w-full">
          <ResponsiveContainer width="100%" className={"bg-transparent"} height={300}>
            <ChartComponent data={formattedData}>
              <CartesianGrid vertical={false} stroke="transparent" />
              <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis allowDecimals={false} />
              <Tooltip content={<ChartTooltipContent />} />
              <ChartLegend />
              {DataComponent}
            </ChartComponent>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
