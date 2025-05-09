import { NextResponse } from 'next/server';
import { getTicketCountByStatus } from '@/utils/dashboard';


const STATUSES = ['open', 'assigned', 'extended', 'done'];

export async function GET() {
  try {
    const data = await Promise.all(
      STATUSES.map(async (status) => {
        const count = await getTicketCountByStatus(status);
        return { name: status, value: count, id: status };
      })
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ticket counts' }, { status: 500 });
  }
}
