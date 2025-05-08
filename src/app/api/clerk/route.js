import { NextResponse } from "next/server";
import { getSupervisorsFromClerk } from "@/lib/clerkUsers";
export async function GET() {
    try {
        const supervisors = await getSupervisorsFromClerk();
        return NextResponse.json(supervisors)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}