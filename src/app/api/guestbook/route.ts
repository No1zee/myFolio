import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const entries = await prisma.guestbookEntry.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        return NextResponse.json(entries);
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name, message } = await req.json();

        // Validation
        if (!name || !message) {
            return NextResponse.json({ error: "Name and message required" }, { status: 400 });
        }

        const entry = await prisma.guestbookEntry.create({
            data: {
                name,
                message
            }
        });

        return NextResponse.json(entry);
    } catch (error) {
        return NextResponse.json({ error: "Failed to sign guestbook" }, { status: 500 });
    }
}
