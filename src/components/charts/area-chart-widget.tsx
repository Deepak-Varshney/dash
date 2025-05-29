// components/charts/AreaChartWidget.tsx
"use client"

import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

export interface AreaChartDataItem {
  label: string
  value: number
}

interface AreaChartWidgetProps {
  title: string
  data: AreaChartDataItem[]
  color?: string
}

export function AreaChartWidget({ title, data, color = "#2563eb" }: AreaChartWidgetProps) {
  return (
    <ChartContainer className="min-h-[300px] w-full" config={{ value: { label: title } }}>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}
