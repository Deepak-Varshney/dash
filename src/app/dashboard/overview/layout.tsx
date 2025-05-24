// import PageContainer from '@/components/layout/page-container';
// import { Badge } from '@/components/ui/badge';
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardAction,
//   CardFooter,
// } from '@/components/ui/card';
// import { Heading } from '@/components/ui/heading';
// import { Separator } from '@/components/ui/separator';
// import { UserViewTable } from '@/components/ui/table/user-view-table';
// import { UpcomingEvents } from '@/features/overview/components/upcomint-event';
// import { columns } from '@/features/users/components/users-tables/columns';
// import { getCurrentMonthExpenses, getTicketCountByStatus, getTotalTickets, getUsers } from '@/utils/dashboard';
// import { currentUser } from '@clerk/nextjs/server';
// import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
// import { Metadata } from 'next';
// import React from 'react';


// export const metadata:Metadata = {
//   title: 'Dashboard: Overview',
// };

// export default async function OverViewLayout({
//   pie_stats,
// }: {
//   sales: React.ReactNode;
//   pie_stats: React.ReactNode;
//   bar_stats: React.ReactNode;
//   area_stats: React.ReactNode;
// }) {
//   const user = await currentUser();
//   const totalTickets = await getTotalTickets();
//   const totalTicketsAssigned = await getTicketCountByStatus("assigned");
//   const doneTickets = await getTicketCountByStatus("done");
//   const currentMonthExpense = await getCurrentMonthExpenses();
//   const users = await getUsers();

//   return (
//     <PageContainer>
//       <div className='flex max-w-full w-full flex-col space-y-4'>
//         <div className='flex flex-wrap justify-between items-center'>
//           <h2 className='text-2xl font-bold tracking-tight'>
//             Hi, {user?.firstName} 👋 Welcome back to CivicNest 
//           </h2>
//         </div>

//         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
//           {/* Cards map logic here */}
//           {[{
//             title: 'Total Tickets',
//             value: totalTickets,
//             trend: '+12.5%',
//             icon: <IconTrendingUp />,
//             footerTitle: 'Trending up this month',
//             footerDesc: 'Visitors for the last 6 months',
//           }, {
//             title: 'Assigned Tickets',
//             value: totalTicketsAssigned,
//             trend: '-20%',
//             icon: <IconTrendingDown />,
//             footerTitle: 'Down 20% this period',
//             footerDesc: 'Acquisition needs attention',
//           }, {
//             title: 'Resolved Tickets',
//             value: doneTickets,
//             trend: '+12.5%',
//             icon: <IconTrendingUp />,
//             footerTitle: 'Strong user retention',
//             footerDesc: 'Engagement exceed targets',
//           }, {
//             title: 'This Month Expenses',
//             value: currentMonthExpense,
//             trend: '+4.5%',
//             icon: <IconTrendingUp />,
//             footerTitle: 'Steady performance increase',
//             footerDesc: 'Meets growth projections',
//           }].map((card, idx) => (
//             <Card key={idx} className='hover:shadow-lg transition-shadow duration-300'>
//               <CardHeader>
//                 <CardDescription>{card.title}</CardDescription>
//                 <CardTitle className='text-2xl font-semibold'>{card.value}</CardTitle>
//                 <CardAction>
//                   <Badge variant='outline'>
//                     {card.icon} {card.trend}
//                   </Badge>
//                 </CardAction>
//               </CardHeader>
//               <CardFooter className='flex-col items-start gap-1.5 text-sm'>
//                 <div className='flex items-center gap-2 font-medium'>
//                   {card.footerTitle} {card.icon}
//                 </div>
//                 <div className='text-muted-foreground'>{card.footerDesc}</div>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//         <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
//           <div className='lg:col-span-4'>
//           <Heading title='Recent Users'  description={`${users.length} Users joined Recently`}/>
//           <Separator className='my-4'/>
//             <UserViewTable
//               columns={columns}
//               data={users}
//             />
//           </div>
//           <div className='lg:col-span-3'>{pie_stats}</div>
//           <div className='lg:col-span-7'>
//             <div className='overflow-y-auto p-4 border rounded-xl'>
//               <UpcomingEvents />
//             </div>
//           </div>
//         </div>
//       </div>
//     </PageContainer>
//   );
// }



import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { UserViewTable } from '@/components/ui/table/user-view-table';
import { UpcomingEvents } from '@/features/overview/components/upcomint-event';
import { columns } from '@/features/users/components/users-tables/columns';
import {
  getCurrentMonthExpenses,
  getMonthlyExpenses,
  getTicketCountByStatus,
  getTicketCountBeforeDate,
  getTotalTickets,
  getUsers,
  calculateTrend,
} from '@/utils/dashboard';
import { currentUser } from '@clerk/nextjs/server';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { Metadata } from 'next';
import React from 'react';

// export const metadata: Metadata = {
//   title: 'Dashboard: Overview',
// };

export default async function OverViewLayout({
  pie_stats,
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const user = await currentUser();

  const now = new Date();
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthNumber = now.getMonth() === 0 ? 12 : now.getMonth();
  const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

  // Current values
  const [totalTickets, totalTicketsAssigned, doneTickets, currentMonthExpense, users] = await Promise.all([
    getTotalTickets(),
    getTicketCountByStatus("assigned"),
    getTicketCountByStatus("done"),
    getCurrentMonthExpenses(),
    getUsers(),
  ]);

  // Previous values
  const [prevTotalTickets, prevAssignedTickets, prevDoneTickets, previousMonthExpense] = await Promise.all([
    getTicketCountBeforeDate(undefined, lastMonthDate),
    getTicketCountBeforeDate("assigned", lastMonthDate),
    getTicketCountBeforeDate("done", lastMonthDate),
    getMonthlyExpenses(lastMonthNumber, lastMonthYear),
  ]);

  // Trends
  const totalTicketsTrend = calculateTrend(totalTickets, prevTotalTickets);
  const assignedTicketsTrend = calculateTrend(totalTicketsAssigned, prevAssignedTickets);
  const doneTicketsTrend = calculateTrend(doneTickets, prevDoneTickets);
  const expenseTrend = calculateTrend(currentMonthExpense, previousMonthExpense);

  // Card Data
  const cards = [
    {
      title: 'Total Tickets',
      value: totalTickets,
      trend: totalTicketsTrend,
      icon: totalTicketsTrend.startsWith('-') ? <IconTrendingDown /> : <IconTrendingUp />,
      footerTitle: totalTicketsTrend.startsWith('-') ? 'Trending down' : 'Trending up',
      footerDesc: 'Compared to last month',
    },
    {
      title: 'Assigned Tickets',
      value: totalTicketsAssigned,
      trend: assignedTicketsTrend,
      icon: assignedTicketsTrend.startsWith('-') ? <IconTrendingDown /> : <IconTrendingUp />,
      footerTitle: assignedTicketsTrend.startsWith('-') ? 'Down this period' : 'Up this period',
      footerDesc: 'Ticket load fluctuation',
    },
    {
      title: 'Resolved Tickets',
      value: doneTickets,
      trend: doneTicketsTrend,
      icon: doneTicketsTrend.startsWith('-') ? <IconTrendingDown /> : <IconTrendingUp />,
      footerTitle: doneTicketsTrend.startsWith('-') ? 'Resolution drop' : 'Improved resolution',
      footerDesc: 'Compared to last month',
    },
    {
      title: 'This Month Expenses',
      value: `₹${currentMonthExpense}`,
      trend: expenseTrend,
      icon: expenseTrend.startsWith('-') ? <IconTrendingDown /> : <IconTrendingUp />,
      footerTitle: expenseTrend.startsWith('-') ? 'Expense drop' : 'Expense increase',
      footerDesc: 'Budget performance check',
    },
  ];

  return (
    <PageContainer>
      <div className='flex max-w-full w-full flex-col space-y-4'>
        <div className='flex flex-wrap justify-between items-center'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, {user?.firstName || 'there'} 👋 Welcome back to CivicNest
          </h2>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {cards.map((card, idx) => (
            <Card key={idx} className='hover:shadow-lg transition-shadow duration-300'>
              <CardHeader>
                <CardDescription>{card.title}</CardDescription>
                <CardTitle className='text-2xl font-semibold'>{card.value}</CardTitle>
                <CardAction>
                  <Badge variant='outline'>
                    {card.icon} {card.trend}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                <div className='flex items-center gap-2 font-medium'>
                  {card.footerTitle} {card.icon}
                </div>
                <div className='text-muted-foreground'>{card.footerDesc}</div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <div className='lg:col-span-4'>
            <Heading title='Recent Users' description={`${users.length} Users joined Recently`} />
            <Separator className='my-4' />
            <UserViewTable columns={columns} data={users} />
          </div>
          <div className='lg:col-span-3'>{pie_stats}</div>
          <div className='lg:col-span-7'>
            <div className='overflow-y-auto p-4 border rounded-xl'>
              <UpcomingEvents />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
