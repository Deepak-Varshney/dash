import { NextResponse } from "next/server";
import { getMonthlyExpensesData } from "../../../utils/handleExpense";

export async function GET(){
    const result = await getMonthlyExpensesData(2025);
    return NextResponse.json({
        result
    })
}