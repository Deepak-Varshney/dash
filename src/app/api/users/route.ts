import { NextResponse } from 'next/server'
import { createUser } from '@/app/actions/handleUser' // Import your utility

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { firstName, lastName, emailAddress, address } = body
        // Call the createUser utility
        const user = await createUser({
            firstName,
            lastName,
            emailAddress,
            address,
        })

        return NextResponse.json({ user }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating user:', error)
        return NextResponse.json(
            { error: error.message || 'Something went wrong' },
            { status: 500 }
        )
    }
}
