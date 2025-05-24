"use client";

import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import KBar from "@/components/kbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";

export default function SuccessPage() {
  const params = useSearchParams();
  const months = params.get("months");
  const router = useRouter();

  useEffect(() => {
    if (months) {
      toast.success(`Payment successful for: ${months}`);
    }
  }, [months]);
  const defaultOpen = true

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-xl border-0">
              <CardHeader className="flex items-center gap-2 text-center">
                <CheckCircle2 className="text-green-500 h-12 w-12" />
                <CardTitle className="text-3xl font-bold text-green-600">Payment Successful</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-gray-700">
                  Thank you for your payment{months ? ` for: ${months}` : ""}.
                </p>
                <div className="flex flex-col gap-2">
                  <Button className="w-full" onClick={() => router.push("/dashboard")}>
                    Go to Dashboard
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/payments")}>
                    View Payment History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
