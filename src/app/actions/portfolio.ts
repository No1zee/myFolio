
"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getExperiences() {
    return await prisma.experience.findMany({
        orderBy: {
            order: 'asc',
        },
    });
}

export async function getSkills() {
    const skills = await prisma.skill.findMany({
        orderBy: {
            order: 'asc',
        },
    });

    // Group by category to match existing frontend structure
    const groupedSkills = skills.reduce((acc, skill) => {
        const category = skill.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(skill.name);
        return acc;
    }, {} as Record<string, string[]>);

    return Object.entries(groupedSkills).map(([category, items]) => ({
        category,
        items,
    }));
}

export async function getServices() {
    return await prisma.service.findMany({ orderBy: { order: 'asc' } });
}

export async function getProjects() { // achievements
    return await prisma.project.findMany({ orderBy: { order: 'asc' } });
}

export async function getCertifications() {
    return await prisma.certification.findMany({ orderBy: { order: 'asc' } });
}

export async function getJournalEntries() {
    return await prisma.journalEntry.findMany({ orderBy: { date: 'desc' } });
}


// --- MUTATIONS ---

import { revalidatePath } from "next/cache";

export async function createExperience(data: FormData) {
    const role = data.get("role") as string;
    const company = data.get("company") as string;
    const location = data.get("location") as string;
    const startDate = new Date(data.get("startDate") as string);
    const endDateRaw = data.get("endDate") as string;
    const endDate = endDateRaw ? new Date(endDateRaw) : null;
    const description = data.get("description") as string;
    const isCurrent = data.get("isCurrent") === "on";

    await prisma.experience.create({
        data: {
            role,
            company,
            location,
            startDate,
            endDate,
            description,
            isCurrent
        }
    });

    revalidatePath("/");
    revalidatePath("/admin/experience");
}

export async function deleteExperience(id: string) {
    await prisma.experience.delete({
        where: { id }
    });

    revalidatePath("/admin/experience");
}

export async function updateExperience(id: string, data: FormData) {
    const role = data.get("role") as string;
    const company = data.get("company") as string;
    const location = data.get("location") as string;
    const startDate = new Date(data.get("startDate") as string);
    const endDateRaw = data.get("endDate") as string;
    const endDate = endDateRaw ? new Date(endDateRaw) : null;
    const description = data.get("description") as string;
    const isCurrent = data.get("isCurrent") === "on";

    await prisma.experience.update({
        where: { id },
        data: {
            role,
            company,
            location,
            startDate,
            endDate,
            description,
            isCurrent
        }
    });

    revalidatePath("/");
    revalidatePath("/admin/experience");
}

// --- SERVICES ---
export async function createService(data: FormData) {
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const icon = data.get("icon") as string;
    const color = data.get("color") as string;
    const features = data.get("features") as string; // JSON

    await prisma.service.create({
        data: { title, description, icon, color, features }
    });
    revalidatePath("/admin");
    revalidatePath("/");
}

export async function updateService(id: string, data: FormData) {
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const icon = data.get("icon") as string;
    const color = data.get("color") as string;
    const features = data.get("features") as string;

    await prisma.service.update({
        where: { id },
        data: { title, description, icon, color, features }
    });
    revalidatePath("/admin");
    revalidatePath("/");
}

export async function deleteService(id: string) {
    await prisma.service.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/");
}

// --- PROJECTS (Achievements) ---
export async function createProject(data: FormData) {
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const tags = data.get("tags") as string;
    const category = data.get("category") as string;
    const imageUrl = data.get("imageUrl") as string;

    await prisma.project.create({
        data: { title, description, tags, category, imageUrl }
    });
    revalidatePath("/admin");
    revalidatePath("/");
}

export async function updateProject(id: string, data: FormData) {
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const tags = data.get("tags") as string;
    const category = data.get("category") as string;
    const imageUrl = data.get("imageUrl") as string;

    await prisma.project.update({
        where: { id },
        data: { title, description, tags, category, imageUrl }
    });
    revalidatePath("/admin");
    revalidatePath("/");
}

export async function deleteProject(id: string) {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/");
}

// --- CERTIFICATIONS ---
export async function createCertification(data: FormData) {
    const name = data.get("name") as string;
    const issuer = data.get("issuer") as string;
    const year = data.get("year") as string;
    const category = data.get("category") as string;
    const color = data.get("color") as string;
    const tech = data.get("tech") as string; // JSON

    await prisma.certification.create({
        data: { name, issuer, year, category, color, tech }
    });
    revalidatePath("/admin");
    revalidatePath("/");
}

export async function updateCertification(id: string, data: FormData) {
    const name = data.get("name") as string;
    const issuer = data.get("issuer") as string;
    const year = data.get("year") as string;
    const category = data.get("category") as string;
    const color = data.get("color") as string;
    const tech = data.get("tech") as string;

    await prisma.certification.update({
        where: { id },
        data: { name, issuer, year, category, color, tech }
    });
    revalidatePath("/admin");
    revalidatePath("/");
}

export async function deleteCertification(id: string) {
    await prisma.certification.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/");
}

// --- JOURNAL ---
export async function createJournalEntry(data: FormData) {
    const title = data.get("title") as string;
    const content = data.get("content") as string;
    const category = data.get("category") as string;
    const stardate = data.get("stardate") as string;
    const tags = data.get("tags") as string; // JSON

    await prisma.journalEntry.create({
        data: { title, content, category, stardate, tags }
    });
    revalidatePath("/admin");
    revalidatePath("/");
}

export async function updateJournalEntry(id: string, data: FormData) {
    const title = data.get("title") as string;
    const content = data.get("content") as string;
    const category = data.get("category") as string;
    const stardate = data.get("stardate") as string;
    const tags = data.get("tags") as string;

    await prisma.journalEntry.update({
        where: { id },
        data: { title, content, category, stardate, tags }
    });
    revalidatePath("/admin");
    revalidatePath("/");
}

export async function deleteJournalEntry(id: string) {
    await prisma.journalEntry.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/");
}


