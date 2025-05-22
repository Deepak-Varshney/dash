// // app/actions/payments.ts
// "use server";


// import connectDB from "@/lib/mongodb";
// import payment from "@/models/payment";
// import { currentUser } from "@clerk/nextjs/server";

// // Mark selected months as paid
// export async function markMonthsAsPaid(months: string[]) {
//     const user = await currentUser();
//     const id = user?.id;
//     if (!id) throw new Error("Not authenticated");

//     await connectDB();

//     await payment.updateMany(
//         { id, month: { $in: months } },
//         { $set: { status: "paid", paidAt: new Date() } }
//     );

//     return { success: true };
// }

// // Fetch due payments (or all payments if needed)
// export async function getUserPayments() {
//     const user = await currentUser();
//     const id = user?.id;
//     if (!id) throw new Error("Not authenticated");

//     await connectDB();

//     const payments = await payment.find({ id }).sort({ month: 1 });

//     return payments.map((p) => ({
//         month: p.month,
//         status: p.status,
//         amount: p.amount,
//         paidAt: p.paidAt,
//     }));
// }


// export async function getCategorizedPayments() {
//     const user = await currentUser();
//     const userId = user?.id;
//     if (!userId) throw new Error("Not authenticated");

//     await connectDB();

//     const payments = await payment.find({ userId }).sort({ month: 1 });

//     const categorized = {
//         upcoming: [] as any[],
//         due: [] as any[],
//         advance: [] as any[],
//     };

//     const now = new Date();
//     for (const p of payments) {
//         const [year, m] = p.month.split("-").map(Number);
//         const paymentDate = new Date(year, m - 1, 15); // 15th of that month
//         const oneWeekLater = new Date(paymentDate);
//         oneWeekLater.setDate(oneWeekLater.getDate() + 7);

//         if (p.status === "paid") continue;

//         if (now < paymentDate) {
//             categorized.advance.push(p);
//         } else if (now >= paymentDate && now <= oneWeekLater) {
//             categorized.upcoming.push(p);
//         } else {
//             categorized.due.push(p);
//         }
//     }

//     return categorized;
// }

// export async function getPaymentHistory() {
//     const user = await currentUser();
//     const userId = user?.id;
//     if (!userId) throw new Error("Not authenticated");

//     await connectDB();
//     const history = await payment.find({ userId, status: "paid" }).sort({ month: -1 });

//     return history;
// }

// export async function generatePayments() {
//     const user = await currentUser();
//     const userId = user?.id;
//     if (!userId) throw new Error("Not authenticated");

//     await connectDB();

//     const months = Array.from({ length: 12 }, (_, i) => {
//         const d = new Date();
//         d.setMonth(d.getMonth() + i);
//         return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
//     });

//     const existing = await payment.find({ userId, month: { $in: months } });
//     const existingMonths = new Set(existing.map((p) => p.month));

//     const newPayments = months
//         .filter((m) => !existingMonths.has(m))
//         .map((month) => ({
//             userId,
//             month,
//             amount: 1000,
//             status: "pending",
//         }));

//     if (newPayments.length > 0) {
//         await payment.insertMany(newPayments);
//     }
// }


// app/actions/payments.ts
"use server";

import connectDB from "@/lib/mongodb";
import payment from "@/models/payment";
import { currentUser } from "@clerk/nextjs/server";

// Mark selected months as paid
export async function markMonthsAsPaid(months: string[]) {
    const user = await currentUser();
    const id = user?.id;
    if (!id) throw new Error("Not authenticated");

    await connectDB();

    await payment.updateMany(
        { userId: id, month: { $in: months } },
        { $set: { status: "paid", paidAt: new Date() } }
    );

    return { success: true };
}

// Fetch due payments (or all payments if needed)
export async function getUserPayments() {
    const user = await currentUser();
    const id = user?.id;
    if (!id) throw new Error("Not authenticated");

    await connectDB();

    const payments = await payment.find({ userId: id }).sort({ month: 1 }).lean();

    return payments.map((p) => ({
        month: p.month,
        status: p.status,
        amount: p.amount,
        paidAt: p.paidAt,
    }));
}

export async function getCategorizedPayments() {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) throw new Error("Not authenticated");

    await connectDB();

    const payments = await payment.find({ userId }).sort({ month: 1 }).lean();

    const categorized = {
        upcoming: [] as any[],
        due: [] as any[],
        advance: [] as any[],
    };
    const now = new Date();
    const today = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    for (const p of payments) {
        if (p.status === "paid") continue;

        const [year, month] = p.month.split("-").map(Number);

        if (year === currentYear && month === currentMonth) {
            if (today <= 7) {
                categorized.upcoming.push(p); // 1st to 7th
            } else {
                categorized.due.push(p); // 8th onwards
            }
        } else if (year > currentYear || (year === currentYear && month > currentMonth)) {
            categorized.advance.push(p); // any future month
        }
    }


    return categorized;
}

export async function getPaymentHistory() {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) throw new Error("Not authenticated");

    await connectDB();
    const history = await payment.find({ userId, status: "paid" }).sort({ month: -1 }).lean();

    return history.map((p) => ({
        month: p.month,
        status: p.status,
        amount: p.amount,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
    }));
}

export async function generatePayments() {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) throw new Error("Not authenticated");

    await connectDB();

    const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() + i);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    });

    const existing = await payment.find({ userId, month: { $in: months } }).lean();
    const existingMonths = new Set(existing.map((p) => p.month));

    const newPayments = months
        .filter((m) => !existingMonths.has(m))
        .map((month) => ({
            userId,
            month,
            amount: 1000,
            status: "pending",
        }));

    if (newPayments.length > 0) {
        await payment.insertMany(newPayments);
    }
}

export async function createTestPayment(month: string) {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) throw new Error("Not authenticated");

    await connectDB();

    await payment.create({
        userId,
        month,
        amount: 1000,
        status: "pending",
    });

    return { success: true };
}
