// components/charts/PieChartWidget.tsx
"use client"

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts"
import { ChartContainer, ChartLegend, ChartTooltipContent } from "@/components/ui/chart"

export interface PieChartDataItem {
    label: string
    value: number
}

interface PieChartWidgetProps {
    title: string
    data: PieChartDataItem[]
    colors?: string[]
}

const DEFAULT_COLORS = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
    "#f97316",
]

export function PieChartWidget({
    title,
    data,
    colors = DEFAULT_COLORS,
}: PieChartWidgetProps) {
    return (
        <ChartContainer className="min-h-[300px] w-full" config={{ value: { label: title } }}>
            <div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#2563eb"
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </ChartContainer>
    )
}
