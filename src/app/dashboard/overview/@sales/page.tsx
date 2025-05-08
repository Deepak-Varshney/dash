import { delay } from '@/constants/mock-api';
import { RecentUsers } from '@/features/overview/components/recent-user';

export default async function Sales() {
  await delay(3000);
  return <RecentUsers />;
}
