import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // This is a DESTRUCTIVE update for simplicity in this version, 
        // or a smart merge. Let's do a smart replace where we clean old auto-imported stuff?
        // Actually, the user asked to "feed CV and update page". 
        // Best approach: WIPE Experience/Skills/Certs and replace with new TRUTH from CV.
        // But let's keep Projects/Journals/Services as they are likely portfolio specific not in CV.

        // Transaction to ensure atomicity
        await prisma.$transaction(async (tx) => {
            // 1. Clear relevant tables
            // Note: In a real prod app we might archive or soft delete.
            await tx.experience.deleteMany({});
            await tx.skill.deleteMany({});
            await tx.certification.deleteMany({});

            // 2. Insert New Experience
            if (data.experience && Array.isArray(data.experience)) {
                let order = 1;
                for (const exp of data.experience) {
                    await tx.experience.create({
                        data: {
                            role: exp.role || 'Unknown Role',
                            company: exp.company || 'Unknown Company',
                            location: exp.location || 'Remote',
                            startDate: new Date(exp.startDate || new Date()), // Fallback
                            endDate: exp.endDate ? new Date(exp.endDate) : null,
                            isCurrent: !!exp.isCurrent,
                            description: exp.description || '',
                            order: order++
                        }
                    });
                }
            }

            // 3. Insert New Skills
            if (data.skills && Array.isArray(data.skills)) {
                for (const cat of data.skills) {
                    for (const item of cat.items) {
                        await tx.skill.create({
                            data: {
                                name: item,
                                category: cat.category || 'General'
                            }
                        });
                    }
                }
            }

            // 4. Insert Certifications
            if (data.certifications && Array.isArray(data.certifications)) {
                let order = 1;
                for (const cert of data.certifications) {
                    await tx.certification.create({
                        data: {
                            name: cert.name,
                            issuer: cert.issuer || 'Unknown',
                            year: String(cert.year || new Date().getFullYear()),
                            category: cert.category || 'Core',
                            color: 'border-brand-primary', // Default styling
                            tech: cert.tech || '[]',
                            order: order++
                        }
                    });
                }
            }

            // 5. Update Bio (Optional, usually stored in a Profile/About model or hardcoded)
            // If we had a Profile model, we'd update it here.

        });

        return NextResponse.json({ success: true });

    } catch (e) {
        console.error("Save Error:", e);
        return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
    }
}
