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
  getTicketCountBeforeDate,
  getTotalTickets,
  getUsers,
  calculateTrend,
} from '@/utils/dashboard';
import { currentUser } from '@clerk/nextjs/server';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { Metadata } from 'next';
import React from 'react';
import { BaseChartWidget } from "@/components/charts/bar-chart-widget"; // Import Chart Widget

// Fetch data for charts (same as DashboardPage)
import {
  getTicketCountByCategory,
  getTicketCountByStatus,
  getTicketsCreatedOverTime,
  getTicketCountByAssignee,
  getTicketCountBySubcategory,
  getOverdueTicketCount,
} from "@/analytics/ticketUtils";

import {
  getExpenseAmountByCategory,
  getExpensesOverTime,
  getExpenseAmountByUser,
} from "@/analytics/expenseUtils";

import {
  getEventCountByType,
  getEventsOverTime,
  getEventCountByOrganizer,
} from "@/analytics/eventUtils";

export const metadata: Metadata = {
  title: 'Dashboard: Overview',
};

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
    getTicketCountWithStatus("assigned"),
    getTicketCountWithStatus("done"),
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

  // Fetch chart data
  const [
    ticketByCategory,
    ticketByStatus,
    ticketOverTime,
    ticketByAssignee,
    ticketBySubcategory,
    overdueTickets,
    expenseByCategory,
    expenseOverTime,
    expenseByUser,
    eventByType,
    eventOverTime,
    eventByOrganizer,
  ] = await Promise.all([
    getTicketCountByCategory(),
    getTicketCountByStatus(),
    getTicketsCreatedOverTime(),
    getTicketCountByAssignee(),
    getTicketCountBySubcategory(),
    getOverdueTicketCount(),
    getExpenseAmountByCategory(),
    getExpensesOverTime(),
    getExpenseAmountByUser(),
    getEventCountByType(),
    getEventsOverTime(),
    getEventCountByOrganizer(),
  ]);

  const formatData = (arr: any[], labelKey: string, valueKey: string) =>
    arr.map((item) => ({ label: item[labelKey], value: item[valueKey] }));

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

        {/* Charts Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4'>
          <div className="bg-primary- p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Tickets by Category</h3>
            <BaseChartWidget
              title="Tickets by Category"
              data={formatData(ticketByCategory, "category", "count")}
              type="bar"
            />
          </div>
          <div className="bg-primary- p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Tickets Created Over Time</h3>
            <BaseChartWidget
              title="Tickets Created Over Time"
              data={formatData(ticketOverTime, "date", "count")}
              type="line"
            />
          </div>
          <div className="bg-primary- p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Overdue Tickets</h3>
            <BaseChartWidget
              title="Overdue Tickets"
              data={[{ label: "Overdue", value: overdueTickets.overdue }]}
              type="bar"
            />
          </div>
          {/* Expenses */}
          <div className="bg-primary- p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Expenses by Category</h3>
            <BaseChartWidget
              title="Expenses by Category"
              data={formatData(expenseByCategory, "category", "totalAmount")}
              type="bar"
            />
          </div>
          <div className="bg-primary- p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Expenses Over Time</h3>
            <BaseChartWidget
              title="Expenses Over Time"
              data={formatData(expenseOverTime, "date", "totalAmount")}
              type="line"
            />
          </div>
          {/* Events */}
          <div className="bg-primary- p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Events by Type</h3>
            <BaseChartWidget
              title="Events by Type"
              data={formatData(eventByType, "type", "count")}
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
