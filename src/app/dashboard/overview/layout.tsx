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
// import {
//   getCurrentMonthExpenses,
//   getMonthlyExpenses,
//   getTicketCountWithStatus,
//   getTicketCountBeforeDate,
//   getTotalTickets,
//   getUsers,
//   calculateTrend,
// } from '@/utils/dashboard';
// import { currentUser } from '@clerk/nextjs/server';
// import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
// import { Metadata } from 'next';
// import React from 'react';
// import { BaseChartWidget } from "@/components/charts/bar-chart-widget"; // Import Chart Widget

// // Fetch data for charts (same as DashboardPage)
// import {
//   getTicketCountByCategory,
//   getTicketCountByStatus,
//   getTicketsCreatedOverTime,
//   getTicketCountByAssignee,
//   getTicketCountBySubcategory,
//   getOverdueTicketCount,
// } from "@/analytics/ticketUtils";

// import {
//   getExpenseAmountByCategory,
//   getExpensesOverTime,
//   getExpenseAmountByUser,
// } from "@/analytics/expenseUtils";

// import {
//   getEventCountByType,
//   getEventsOverTime,
//   getEventCountByOrganizer,
// } from "@/analytics/eventUtils";

// export const metadata: Metadata = {
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

//   const now = new Date();
//   const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//   const lastMonthNumber = now.getMonth() === 0 ? 12 : now.getMonth();
//   const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

//   // Current values
//   const [totalTickets, totalTicketsAssigned, doneTickets, currentMonthExpense, users] = await Promise.all([
//     getTotalTickets(),
//     getTicketCountWithStatus("assigned"),
//     getTicketCountWithStatus("done"),
//     getCurrentMonthExpenses(),
//     getUsers(),
//   ]);

//   // Previous values
//   const [prevTotalTickets, prevAssignedTickets, prevDoneTickets, previousMonthExpense] = await Promise.all([
//     getTicketCountBeforeDate(undefined, lastMonthDate),
//     getTicketCountBeforeDate("assigned", lastMonthDate),
//     getTicketCountBeforeDate("done", lastMonthDate),
//     getMonthlyExpenses(lastMonthNumber, lastMonthYear),
//   ]);

//   // Trends
//   const totalTicketsTrend = calculateTrend(totalTickets, prevTotalTickets);
//   const assignedTicketsTrend = calculateTrend(totalTicketsAssigned, prevAssignedTickets);
//   const doneTicketsTrend = calculateTrend(doneTickets, prevDoneTickets);
//   const expenseTrend = calculateTrend(currentMonthExpense, previousMonthExpense);

//   // Fetch chart data
//   const [
//     ticketByCategory,
//     ticketByStatus,
//     ticketOverTime,
//     ticketByAssignee,
//     ticketBySubcategory,
//     overdueTickets,
//     expenseByCategory,
//     expenseOverTime,
//     expenseByUser,
//     eventByType,
//     eventOverTime,
//     eventByOrganizer,
//   ] = await Promise.all([
//     getTicketCountByCategory(),
//     getTicketCountByStatus(),
//     getTicketsCreatedOverTime(),
//     getTicketCountByAssignee(),
//     getTicketCountBySubcategory(),
//     getOverdueTicketCount(),
//     getExpenseAmountByCategory(),
//     getExpensesOverTime(),
//     getExpenseAmountByUser(),
//     getEventCountByType(),
//     getEventsOverTime(),
//     getEventCountByOrganizer(),
//   ]);

//   const formatData = (arr: any[], labelKey: string, valueKey: string) =>
//     arr.map((item) => ({ label: item[labelKey], value: item[valueKey] }));

//   // Card Data
//   const cards = [
//     {
//       title: 'Total Tickets',
//       value: totalTickets,
//       trend: totalTicketsTrend,
//       icon: totalTicketsTrend.startsWith('-') ? <IconTrendingDown /> : <IconTrendingUp />,
//       footerTitle: totalTicketsTrend.startsWith('-') ? 'Trending down' : 'Trending up',
//       footerDesc: 'Compared to last month',
//     },
//     {
//       title: 'Assigned Tickets',
//       value: totalTicketsAssigned,
//       trend: assignedTicketsTrend,
//       icon: assignedTicketsTrend.startsWith('-') ? <IconTrendingDown /> : <IconTrendingUp />,
//       footerTitle: assignedTicketsTrend.startsWith('-') ? 'Down this period' : 'Up this period',
//       footerDesc: 'Ticket load fluctuation',
//     },
//     {
//       title: 'Resolved Tickets',
//       value: doneTickets,
//       trend: doneTicketsTrend,
//       icon: doneTicketsTrend.startsWith('-') ? <IconTrendingDown /> : <IconTrendingUp />,
//       footerTitle: doneTicketsTrend.startsWith('-') ? 'Resolution drop' : 'Improved resolution',
//       footerDesc: 'Compared to last month',
//     },
//     {
//       title: 'This Month Expenses',
//       value: `₹${currentMonthExpense}`,
//       trend: expenseTrend,
//       icon: expenseTrend.startsWith('-') ? <IconTrendingDown /> : <IconTrendingUp />,
//       footerTitle: expenseTrend.startsWith('-') ? 'Expense drop' : 'Expense increase',
//       footerDesc: 'Budget performance check',
//     },
//   ];

//   return (
//     <PageContainer>
//       <div className='flex max-w-full w-full flex-col space-y-4'>
//         <div className='flex flex-wrap justify-between items-center'>
//           <h2 className='text-2xl font-bold tracking-tight'>
//             Hi, {user?.firstName || 'there'} 👋 Welcome back to CivicNest
//           </h2>
//         </div>

//         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
//           {cards.map((card, idx) => (
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

//         {/* Charts Grid */}
//         <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4'>
//           <div className="bg-primary- p-4 rounded-lg">
//             <h3 className="font-semibold mb-2">Tickets by Category</h3>
//             <BaseChartWidget
//               title="Tickets by Category"
//               data={formatData(ticketByCategory, "category", "count")}
//               type="bar"
//             />
//           </div>
//           <div className="bg-primary- p-4 rounded-lg">
//             <h3 className="font-semibold mb-2">Tickets Created Over Time</h3>
//             <BaseChartWidget
//               title="Tickets Created Over Time"
//               data={formatData(ticketOverTime, "date", "count")}
//               type="line"
//             />
//           </div>
//           <div className="bg-primary- p-4 rounded-lg">
//             <h3 className="font-semibold mb-2">Overdue Tickets</h3>
//             <BaseChartWidget
//               title="Overdue Tickets"
//               data={[{ label: "Overdue", value: overdueTickets.overdue }]}
//               type="bar"
//             />
//           </div>
//           {/* Expenses */}
//           <div className="bg-primary- p-4 rounded-lg">
//             <h3 className="font-semibold mb-2">Expenses by Category</h3>
//             <BaseChartWidget
//               title="Expenses by Category"
//               data={formatData(expenseByCategory, "category", "totalAmount")}
//               type="bar"
//             />
//           </div>
//           <div className="bg-primary- p-4 rounded-lg">
//             <h3 className="font-semibold mb-2">Expenses Over Time</h3>
//             <BaseChartWidget
//               title="Expenses Over Time"
//               data={formatData(expenseOverTime, "date", "totalAmount")}
//               type="line"
//             />
//           </div>
//           {/* Events */}
//           <div className="bg-primary- p-4 rounded-lg">
//             <h3 className="font-semibold mb-2">Events by Type</h3>
//             <BaseChartWidget
//               title="Events by Type"
//               data={formatData(eventByType, "type", "count")}
//               type="bar"
//             />
//           </div>
//         </div>

//         <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
//           <div className='lg:col-span-4'>
//             <Heading title='Recent Users' description={`${users.length} Users joined Recently`} />
//             <Separator className='my-4' />
//             <UserViewTable columns={columns} data={users} />
//           </div>
//           <div className='lg:col-span-3'>{pie_stats}</div>
//           <div className='lg:col-span-7'>
//             <div className='overflow-y-auto p-4 border rounded-xl'>
//               {/* <UpcomingEvents /> */}
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
  getTicketCountWithStatus,
  getTotalTickets,
  getUsers,
  calculateTrend,
  getTicketsByMonth,
  getUpcomingEvents,
  getUsersByRole,
} from '@/utils/dashboard';
import { currentUser } from '@clerk/nextjs/server';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { Metadata } from 'next';
import React from 'react';
import { BaseChartWidget } from "@/components/charts/bar-chart-widget";

import {
  getTicketCountByCategory,
  getTicketCountByStatus,
} from "@/analytics/ticketUtils";

import {
  getExpenseAmountByCategory,
  getExpensesOverTime,
} from "@/analytics/expenseUtils";
import { PieGraph } from '@/components/charts/pie-graph';
import { getMonthlyExpensesData } from '@/utils/handleExpense';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard: Overview',
};

export default async function OverViewLayout({
}: {
  }) {
  const user = await currentUser();
  function formatNumber(value: number): string {
    if (value >= 1e9) return (value / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (value >= 1e3) return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return value.toString();
  }


  const now = new Date();
  const lastMonthNumber = now.getMonth() === 0 ? 12 : now.getMonth();
  const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
  const currentYear = new Date().getFullYear(); // Get current year

  // Current values
  const [totalTickets, doneTickets, currentMonthExpense, users, monthlyExpenseData] = await Promise.all([
    getTotalTickets(),
    getTicketCountWithStatus("done"),
    getCurrentMonthExpenses(),
    getUsers(),
    getMonthlyExpensesData(2025)
  ]);
  // Previous values
  const [previousMonthExpense] = await Promise.all([
    getMonthlyExpenses(lastMonthNumber, lastMonthYear),
  ]);
  // Trends
  const upcomingEvents = await getUpcomingEvents();
  const currentMonthData = await getTicketsByMonth();
  const currentMonthTickets = currentMonthData.find(
    (item) => item.year === currentYear && item.month === currentMonth
  )?.count || 0;

  // Get tickets for the previous month
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1; // Handle January edge case
  const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear; // Handle January edge case
  const previousMonthData = await getTicketsByMonth();
  const previousMonthTickets = previousMonthData.find(
    (item) => item.year === previousYear && item.month === previousMonth
  )?.count || 0;

  // Calculate the trend for total tickets (current month vs. previous month)
  const trend = calculateTrend(currentMonthTickets, previousMonthTickets);

  // Calculate the trend for resolved (done) tickets
  const previousMonthDoneTicketsData = await getTicketsByMonth("done");
  const previousMonthDoneTickets = previousMonthDoneTicketsData.find(
    (item) => item.year === previousYear && item.month === previousMonth
  )?.count || 0;

  const doneTicketsTrend = calculateTrend(doneTickets, previousMonthDoneTickets);

  const expenseTrend = calculateTrend(currentMonthExpense, previousMonthExpense);

  // Fetch chart data
  const [
    ticketByCategory,
    usersByRole,
    ticketByStatus,
    expenseByCategory,
  ] = await Promise.all([
    getTicketCountByCategory(),
    getUsersByRole(),
    getTicketCountByStatus(),
    getExpenseAmountByCategory(),
  ]);

  const formatData = (arr: any[], labelKey: string, valueKey: string) =>
    arr.map((item) => ({ label: item[labelKey], value: item[valueKey] }));

  const cards = [
    {
      title: 'This Month Expenses',
      value: `₹${formatNumber(currentMonthExpense)}`,
      trend: expenseTrend,
      link: 'expense',
    },
    {
      title: 'Total Tickets',
      value: totalTickets,
      trend: trend,
      link: 'ticket',
    },
    {
      title: 'Resolved Tickets',
      value: doneTickets,
      trend: doneTicketsTrend,
      link: 'ticket',
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents?.length || 0,
      trend: null,
      link: 'event',
    },
  ];
  return (
    <PageContainer>
      <div className='flex max-w-full w-full flex-col space-y-4'>
        <div className='flex flex-wrap justify-between items-center'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi {user?.firstName || 'there'}, Welcome back to CivicNest 👋
          </h2>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {cards.map((card, idx) => {
            const trendValue = parseFloat(card.trend ?? "0");
            const isTrendDown = trendValue < 0;
            const Icon = isTrendDown ? IconTrendingDown : IconTrendingUp;
            const footerTitle = isTrendDown
              ? card.title.includes("Expense") ? "Expense drop" : "Trending down"
              : card.title.includes("Expense") ? "Expense increase" : "Trending up";
            const footerDesc = card.title.includes("Expense")
              ? "Budget performance check"
              : "Compared to last month";

            return (
              <Card key={idx} className='cursor-pointer hover:shadow-lg transition-shadow duration-300'>
                <Link href={`/dashboard/${card.link}`}>
                  <CardHeader>
                    <CardDescription>{card.title}</CardDescription>
                    <CardTitle className='text-2xl font-semibold'>{card.value}</CardTitle>
                    <CardAction>
                      {card.trend && <Badge variant='outline'>
                        <Icon className="mr-1 h-4 w-4" /> {card.trend}
                      </Badge>}
                    </CardAction>
                  </CardHeader>
                  <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                    <div className='flex items-center gap-2 font-medium'>
                      {footerTitle} <Icon className="h-4 w-4" />
                    </div>
                    <div className='text-muted-foreground'>{footerDesc}</div>
                  </CardFooter>
                </Link>
              </Card>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <div className="p-4 rounded-lg">
            <PieGraph
              title="Monthly Expenses"
              description="Expenses by category"
              data={monthlyExpenseData}
              centerLabel="INR"
            />
          </div>
          <div className="p-4 rounded-lg">
            <PieGraph
              title="Tickets Status Breakdown"
              description="Current ticket status distribution"
              data={ticketByStatus.map(({ count, status }) => ({
                id: status,
                name: (
                  {
                    done: 'Resolved',
                    assigned: 'Assigned',
                    open: 'Open'
                  } as Record<string, string>
                )[status] ?? status,
                value: count
              }))}
              centerLabel="Tickets"
            />
          </div>
          <div className="p-4 rounded-lg">
            <BaseChartWidget
              title="Expenses by Category"
              data={formatData(expenseByCategory, "category", "totalAmount")}
              type="bar"
            />
          </div>
          <div className="p-4 rounded-lg">
            <BaseChartWidget
              title="Tickets by Category"
              data={formatData(ticketByCategory, "category", "count")}
              type="bar"
            />
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <div className='lg:col-span-4'>
            <Heading title='Recent Users' description={`${users.length} Users joined Recently`} />
            <Separator className='my-4' />
            <UserViewTable columns={columns} data={users} />
          </div>
          <div className='lg:col-span-3'>
            <PieGraph
              title="User Roles Distribution"
              description="Visual breakdown of users by role"
              data={usersByRole}
              centerLabel="Users"
            />
          </div>
          <div className='lg:col-span-7'>
            <div className='overflow-y-auto p-4 border rounded-xl'>
              <UpcomingEvents data={upcomingEvents} />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}