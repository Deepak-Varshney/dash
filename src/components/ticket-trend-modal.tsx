// components/TicketTrendModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Category = {
  name: string;
  count: number;
};

type TicketTrendModalProps = {
  open: boolean;
  onClose: (open: boolean) => void;
  trendData: {
    current: number;
    previous: number;
    trend: string;
    categories: Category[];
  };
};

export function TicketTrendModal({ open, onClose, trendData }: TicketTrendModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Ticket Trend Breakdown</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          <p>
            <strong>This Month:</strong> {trendData.current} tickets
          </p>
          <p>
            <strong>Last Month:</strong> {trendData.previous} tickets
          </p>
          <p>
            <strong>Change:</strong> {trendData.trend}
          </p>

          <h4 className="mt-4 font-semibold">Top Categories:</h4>
          <ul className="list-disc ml-5">
            {trendData.categories.map((cat) => (
              <li key={cat.name}>
                {cat.name}: {cat.count} tickets
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
