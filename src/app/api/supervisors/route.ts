import { getSupervisors } from "@/utils/dashboard";
import { NextResponse } from "next/server";


export async function GET(){
    const supervisors = await getSupervisors();
    if (!supervisors || supervisors.length === 0) {
        return NextResponse.json({
            error: "No supervisors found"
        }, { status: 404 });
    }
    // Return the supervisors in JSON format
    return NextResponse.json(supervisors, { status: 200 });
}

