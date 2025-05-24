"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";


const civicPlans = [
  {
    name: "Free Trial",
    monthly: "Free for 7 days",
    yearly: "Free for 7 days",
    description: "Try CivicNest free for 7 days with limited access.",
    features: [
      "Up to 20 Residents",
      "Event Management",
      "Maintenance Tracking",
      "Limited Support",
    ],
  },
  {
    name: "Starter",
    monthly: "₹499/mo",
    yearly: "₹4,999/yr",
    description: "Ideal for small communities just getting started.",
    features: [
      "Up to 50 Residents",
      "Maintenance Tracking",
      "Event Management",
      "Basic Support",
    ],
  },
  {
    name: "Community",
    monthly: "₹1,499/mo",
    yearly: "₹14,999/yr",
    description: "Perfect for growing societies and gated communities.",
    features: [
      "Up to 500 Residents",
      "Kanban Task Board",
      "Document Uploads",
      "Analytics Dashboard",
      "Priority Support",
    ],
  },
  {
    name: "Enterprise",
    monthly: "Custom",
    yearly: "Custom",
    description: "Tailored for large housing projects and developers.",
    features: [
      "Unlimited Residents",
      "SSO & Custom Roles",
      "Visitor Detection Module",
      "Dedicated Onboarding",
      "24/7 Dedicated Support",
    ],
  },
];

export default function PlansPage() {
  return (

    <div className="p-6 w-full h-[calc(100vh-36px)] mx-auto">
      <h1 className="text-3xl font-bold mb-2">CivicNest Plans</h1>
      <p className="text-muted-foreground mb-6">
        Choose a subscription that suits your society’s needs.
      </p>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
          <TabsTrigger value="yearly">Yearly Billing</TabsTrigger>
        </TabsList>

        {["monthly", "yearly"].map((billing) => (
          <TabsContent key={billing} value={billing}>
            {/* <ScrollArea className="h-[calc(100vh-200px)] pr-4">
             */}
            <ScrollArea className="h-[calc(100vh-250px)] pr-4">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {civicPlans.map((plan) => (
                  <Card key={plan.name} className="flex flex-col justify-between">
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold mb-4">
                        {billing === "monthly" ? plan.monthly : plan.yearly}
                      </div>
                      <ul className="text-sm space-y-1 mb-6">
                        {plan.features.map((feature) => (
                          <li key={feature}>• {feature}</li>
                        ))}
                      </ul>
                      <Button className="w-full">Choose {plan.name}</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

    </div>

  );
}
