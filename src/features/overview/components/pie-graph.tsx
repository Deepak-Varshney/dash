// 'use client';
// import * as React from 'react';
// import { IconTrendingUp } from '@tabler/icons-react';
// import { Label, Pie, PieChart } from 'recharts';

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card';
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent
// } from '@/components/ui/chart';

// const dummyData = [
//   { name: 'Open', value: 100, id: 'Open' },
//   { name: 'Assigned', value: 150, id: 'Assigned' },
//   { name: 'Extended', value: 2, id: 'Extended' },
//   { name: 'Done', value: 800, id: 'Done' }
// ];




// export function PieGraph() {
//   const [data, setData] = React.useState([]);
//   React.useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch('/api/dashboard');
//         const json = await res.json();
//         setData(json);
//       } catch (err) {
//         console.error('Failed to fetch ticket data:', err);
//       }
//     };
//     fetchData();
//   },[])

//   const totalTickets = React.useMemo(() => {
//     return dummyData.reduce((acc, curr) => acc + curr.value, 0);
//   }, []);
// console.log(data)
//   return (
//     <Card className='@container/card'>
//       <CardHeader>
//         <CardTitle>Pie Chart - Tickets</CardTitle>
//         <CardDescription>
//           <span className='hidden @[540px]/card:block'>
//             Status distribution of tickets
//           </span>
//           <span className='@[540px]/card:hidden'>Tickets breakdown</span>
//         </CardDescription>
//       </CardHeader>
//       <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
//         <ChartContainer config={{}} className='mx-auto aspect-square h-[250px]'>
//           <PieChart>
//             <defs>
//               {dummyData.map((item, index) => (
//                 <linearGradient
//                   key={item.id}
//                   id={`fill${item.id}`}
//                   x1="0"
//                   y1="0"
//                   x2="0"
//                   y2="1"
//                 >
//                   <stop
//                     offset="0%"
//                     stopColor="var(--primary)"
//                     stopOpacity={1 - index * 0.15}
//                   />
//                   <stop
//                     offset="100%"
//                     stopColor="var(--primary)"
//                     stopOpacity={0.8 - index * 0.15}
//                   />
//                 </linearGradient>
//               ))}
//             </defs>
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Pie
//               data={dummyData.map((item) => ({
//                 ...item,
//                 fill: `url(#fill${item.id})`
//               }))}
//               dataKey="value"
//               nameKey="name"
//               innerRadius={60}
//               strokeWidth={2}
//               stroke="var(--background)"
//             >
//               <Label
//                 content={({ viewBox }) => {
//                   if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
//                     return (
//                       <text
//                         x={viewBox.cx}
//                         y={viewBox.cy}
//                         textAnchor="middle"
//                         dominantBaseline="middle"
//                       >
//                         <tspan
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           className="fill-foreground text-3xl font-bold"
//                         >
//                           {totalTickets}
//                         </tspan>
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) + 24}
//                           className="fill-muted-foreground text-sm"
//                         >
//                           Total Tickets
//                         </tspan>
//                       </text>
//                     );
//                   }
//                 }}
//               />
//             </Pie>
//           </PieChart>

//         </ChartContainer>
//       </CardContent>
//       <CardFooter className='flex-col gap-2 text-sm'>
//         <div className='flex items-center gap-2 leading-none font-medium'>
//           Open leads with{' '}
//           {((dummyData[0].value / totalTickets) * 100).toFixed(1)}%{' '}
//           <IconTrendingUp className='h-4 w-4' />
//         </div>
//         <div className='text-muted-foreground leading-none'>
//           Based on current ticket statuses
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }


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

type TicketStatusData = { name: string; value: number; id: string };

export function PieGraph() {
  const [data, setData] = React.useState<TicketStatusData[]>([]);
  const totalTickets = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.value, 0),
    [data]
  );

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch ticket data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Pie Chart - Tickets</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Status distribution of tickets
          </span>
          <span className='@[540px]/card:hidden'>Tickets breakdown</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer config={{}} className='mx-auto aspect-square h-[250px]'>
          <PieChart>
            <defs>
              {data.map((item, index) => (
                <linearGradient
                  key={item.id}
                  id={`fill${item.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity={1 - index * 0.15}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
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
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={2}
              stroke="var(--background)"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTickets}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Total Tickets
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
        {data[0] && (
          <div className='flex items-center gap-2 leading-none font-medium'>
            {data[0].name} leads with{' '}
            {((data[0].value / totalTickets) * 100).toFixed(1)}%{' '}
            <IconTrendingUp className='h-4 w-4' />
          </div>
        )}
        <div className='text-muted-foreground leading-none'>
          Based on current ticket statuses
        </div>
      </CardFooter>
    </Card>
  );
}
