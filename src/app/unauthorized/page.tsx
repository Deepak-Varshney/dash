import KBar from "@/components/kbar";
import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { currentUser } from "@clerk/nextjs/server"
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
export const metadata: Metadata = {
    title: 'Next Shadcn Dashboard Starter',
    description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function Component() {
    const user = await currentUser();
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
        <KBar>
            <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <SidebarInset>
                    <Header />
                    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-md text-center">
                            <LockIcon className="mx-auto h-12 w-12 text-primary" />
                            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Unauthorized Access</h1>
                            <p className="mt-4 text-muted-foreground">
                                You do not have the necessary permissions to access this resource. Please contact your administrator for assistance.
                            </p>

                          { user?.imageUrl && <div className="mt-6">
                                {user?.imageUrl ? (
                                    <
                                        Image
                                        src={user.imageUrl}
                                        alt={`${user.firstName}'s profile`}
                                        className="mx-auto rounded-full border shadow"
                                        width="120"
                                        height="120"
                                        style={{ aspectRatio: "1/1", objectFit: "cover" }}
                                    />
                                ) : (
                                    <
                                        Image
                                        src="/placeholder.svg"
                                        alt="Unauthorized access illustration"
                                        className="mx-auto"
                                        width="300"
                                        height="300"
                                        style={{ aspectRatio: "300/300", objectFit: "cover" }}
                                    />
                                )}
                            </div>}
                            <h2>{user?.firstName} {user?.lastName}</h2>
                            <p className="mt-2 text-muted-foreground">
                                {user?.emailAddresses[0]?.emailAddress}
                            </p>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </KBar>
    );
}

function LockIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}
