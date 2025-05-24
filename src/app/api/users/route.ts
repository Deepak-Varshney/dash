import { NextResponse } from 'next/server'
import { createUser, updateUser } from '@/app/actions/handleUser' // Adjust path if needed

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const {
            userId,         // If this is present, we treat it as an update
            firstName,
            lastName,
            emailAddress,
            address,
        } = body

        if (userId) {
            // Updating an existing user
            const updatedUser = await updateUser({
                userId,
                firstName,
                lastName,
                emailAddress,
                address,
            })

            return NextResponse.json({ user: updatedUser }, { status: 200 })
        } else {
            // Creating a new user
            const createdUser = await createUser({
                firstName,
                lastName,
                emailAddress,
                address,
            })

            return NextResponse.json({ user: createdUser }, { status: 201 })
        }
    } catch (error: any) {
        console.error('Error in /api/users:', error)
        return NextResponse.json(
            { error: error.message || 'Something went wrong' },
            { status: 500 }
        )
    }
}
