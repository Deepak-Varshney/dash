import { NextResponse } from "next/server";
import { getMonthlyExpensesData } from "../../../utils/handleExpense";
import { getData } from "@/analytics/paymentUtils";

export async function GET(){
    const result = await getData();
    return NextResponse.json({
        result
    })
}