'use client';
import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

type PieGraphData = {
  name: string;
  value: number;
  id: string;
};

type PieGraphProps = {
  title: string;
  description?: string;
  data: PieGraphData[];
  centerLabel?: string;
};

export function PieGraph({
  title,
  description,
  data,
  centerLabel = 'Total'
}: PieGraphProps) {
  const total = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.value, 0),
    [data]
  );

  const sortedData = React.useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data]
  );

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription>
            <span className='hidden @[540px]/card:block'>{description}</span>
            <span className='@[540px]/card:hidden'>Breakdown</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer config={{}} className='mx-auto aspect-square h-[250px]'>
          <PieChart>
            <defs>
              {data.map((item, index) => (
                <linearGradient
                  key={item.id}
                  id={`fill${item.id}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='0%'
                    stopColor='var(--primary)'
                    stopOpacity={1 - index * 0.15}
                  />
                  <stop
                    offset='100%'
                    stopColor='var(--primary)'
                    stopOpacity={0.8 - index * 0.15}
                  />
                </linearGradient>
              ))}
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data.map((item) => ({
                ...item,
                fill: `url(#fill${item.id})`
              }))}
              dataKey='value'
              nameKey='name'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          {centerLabel}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        {sortedData[0] && (
          <div className='flex items-center gap-2 leading-none font-medium'>
            {sortedData[0].name} leads with{' '}
            {((sortedData[0].value / total) * 100).toFixed(1)}%{' '}
            <IconTrendingUp className='h-4 w-4' />
          </div>
        )}
        <div className='text-muted-foreground leading-none'>
          Based on provided data
        </div>
      </CardFooter>
    </Card>
  );
}
