import connectDB from "@/lib/mongodb"
import { NextResponse } from "next/server";
import Expense from "../../../../models/expense";
export async function GET(request,{params}){
    try {
        const {expenseId} = params;
        // connoect to db
        await connectDB();
        // get Product model
        const expense = await Expense.findOne({_id:expenseId});
        return NextResponse.json({
            message:"Expense fetched successfully",
            data:expense
        },{
            status:200
        })
    } catch (error) {
        return NextResponse.json(
        {
            message:"Failed to fetch a Expense",
            error:error
        },{
            status:500
        })
    }
}
export async function PUT(request,{params:{id}}){
    try {
        // get the data from the request 
        const {name, phone, gender} = await request.json()
        const newCustomer = {
            name,
            phone,
            gender
        };
        
        // connoect to db
        await connectDB();
        await CustomerModel.findByIdAndUpdate(expenseId,newCustomer);
        return NextResponse.json({
            message:"Customer Updated successfully",
            data:newCustomer
        },{
            status:201
        })
    } catch (error) {
        return NextResponse.json(
        {
            message:"Failed to update a Customer",
            error:error
        },{
            status:500
        })
    }
}