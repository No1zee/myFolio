
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding (Safe Mode)...')

    // Note: We removed deleteMany to prevent data loss.
    // This script now focuses on ensuring DEFAULT data exists.

    // --- CLEANUP ---
    // Remove incorrect "persona" data if it exists
    await prisma.experience.deleteMany({
        where: {
            company: { in: ['AGS (Global Logistics)', 'Sybyl (Enterprise IT)', 'Vard Engineering', 'Independent Research'] }
        }
    });

    // --- EXPERIENCE ---
    const experiences = [
        {
            role: 'IT and Operations Manager',
            company: 'Advance Medical Africa',
            location: 'Harare, Zimbabwe',
            startDate: new Date('2025-02-01'),
            endDate: null,
            isCurrent: true,
            order: 1,
            description: `Tags: Operations, Infrastructure, Leadership
- **Organizational Integration**: Oversees IT infrastructure and operational processes to ensure seamless integration and efficiency across organizational departments.
- **Process Optimization**: Streamlining operational workflows to support scaling business requirements.`
        },
        {
            role: 'Technical Consultant',
            company: 'FinSys Zimbabwe',
            location: 'Harare, Zimbabwe',
            startDate: new Date('2025-02-01'),
            endDate: null,
            isCurrent: true,
            order: 2,
            description: `Tags: Analysis, Training, Optimization
- **System Analysis**: Conduct comprehensive analyses on hardware, software, and network capabilities to optimize system performance.
- **Strategic Alignment**: Collaborate with management to align technical solutions with organizational goals.
- **User Training**: Train end-users on hardware functionality and software programs, performing diagnostic tests to maintain system integrity.`
        },
        {
            role: 'Technical Consultant',
            company: 'Vernomas ICT Solutions',
            location: 'Harare, Zimbabwe',
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-12-31'),
            isCurrent: false,
            order: 3,
            description: `Tags: Hardware, Server Solutions
- **Custom Solutions**: Delivered customized hardware and server solutions, enhancing system capabilities for specific client requirements.
- **Infrastructure Improvements**: Collaborated with clients to assess needs and implemented improvements that increased operational efficiency.
- **Integration Support**: Offered technical support and guidance to facilitate the smooth integration of new technologies.`
        },
        {
            role: 'Systems Support Officer',
            company: 'Aviation Ground Services',
            location: 'Harare, Zimbabwe',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2022-12-31'),
            isCurrent: false,
            order: 4,
            description: `Tags: Network Security, DR, Policy
- **Network Overhaul**: Led a network infrastructure overhaul, achieving a **30% reduction in downtime** and enhancing security measures.
- **Disaster Recovery**: Coordinated a team of 10 to implement a disaster recovery plan that reduced potential data loss by 40%.
- **Policy Revamp**: Initiated an organization-wide audit to align with industry frameworks, utilizing Sophos and Dynamics NAV.`
        },
        {
            role: 'Systems Support Intern',
            company: 'Aviation Ground Services',
            location: 'Harare, Zimbabwe',
            startDate: new Date('2019-01-01'),
            endDate: new Date('2019-12-31'),
            isCurrent: false,
            order: 5,
            description: `Tags: Support, Maintenance
- **Operational Reliability**: Assisted in maintaining IT systems and resolving technical issues.
- **Training support**: Contributed to the creation of user guides and training materials for staff.`
        }
    ];

    for (const job of experiences) {
        const existing = await prisma.experience.findFirst({ where: { role: job.role, company: job.company } });
        if (existing) {
            await prisma.experience.update({ where: { id: existing.id }, data: job });
        } else {
            await prisma.experience.create({ data: job });
        }
    }


    // --- SKILLS ---
    const skillCategories = [
        { category: "Operating Systems", items: ["Microsoft 365 Administration", "Linux"] },
        { category: "Network Tools", items: ["Sophos", "Dynamics NAV", "Emirates SkyChain"] },
        { category: "Programming", items: ["Python", "VB.NET", "Java", "Visual C++", "JavaScript", "TypeScript"] },
        { category: "Software", items: ["Splunk", "Wireshark", "VMware", "Active Directory", "Docker", "Git"] },
        { category: "Security", items: ["ISO/IEC 27001", "Network Security", "Cybersecurity", "Compliance"] }
    ];

    for (const cat of skillCategories) {
        for (const item of cat.items) {
            const exists = await prisma.skill.findFirst({ where: { name: item } });
            if (!exists) {
                await prisma.skill.create({
                    data: {
                        name: item,
                        category: cat.category,
                    }
                })
            }
        }
    }

    // --- CERTIFICATIONS ---
    // Clear old experimental ones if needed, or just upsert
    const certifications = [
        // Flagships (Order 1-4)
        { name: "Google Cloud Associate Engineer", issuer: "Google", year: "Present", category: "Cloud", tech: "[\"GCP\", \"Cloud Architecture\"]", color: "from-yellow-400 to-orange-400", order: 1 },
        { name: "Certified Cybersecurity Technician", issuer: "EC Council", year: "Present", category: "Security", tech: "[\"Ethical Hacking\", \"Pen Testing\"]", color: "from-red-600 to-orange-500", order: 2 },
        { name: "ISO/IEC 27001 Info Security Associate", issuer: "Skillshare", year: "2024", category: "Security", tech: "[\"Compliance\", \"Risk Mgmt\"]", color: "from-purple-500 to-indigo-500", order: 3 },
        { name: "Azure Fundamentals (AZ-900)", issuer: "Microsoft", year: "2024", category: "Cloud", tech: "[\"Azure\", \"Cloud Basics\"]", color: "from-blue-500 to-blue-300", order: 4 },

        // Others
        { name: "Google IT Support", issuer: "Google", year: "2022", color: "from-blue-400 to-green-400", category: "Core", tech: "[\"IT Support\", \"Troubleshooting\"]", order: 10 },
        { name: "Google Cybersecurity Professional", issuer: "Coursera", year: "2024", color: "from-blue-600 to-blue-800", category: "Security", tech: "[\"Security\", \"Network Defense\"]", order: 11 },
        { name: "Cybersecurity Compliance and Framework", issuer: "IBM", year: "2025", color: "from-blue-800 to-indigo-900", category: "Security", tech: "[\"Compliance\", \"Frameworks\"]", order: 12 },
        { name: "Oracle Cloud Foundations Associate", issuer: "Oracle", year: "2025", color: "from-red-500 to-orange-600", category: "Cloud", tech: "[\"OCI\", \"Cloud\"]", order: 13 },
        { name: "Blockchain Fundamentals", issuer: "Chainlink", year: "2025", color: "from-indigo-500 to-purple-600", category: "Experimental", tech: "[\"Web3\", \"Smart Contracts\"]", order: 14 },

        // Keep Antigravity as a hidden/fun one
        { name: "Antigravity Engineer", issuer: "Google DeepMind", year: "2024", color: "from-pink-500 to-purple-500", category: "Experimental", tech: "[\"Agentic AI\", \"Prompt Engineering\"]", order: 99 },
    ];

    for (const cert of certifications) {
        const existing = await prisma.certification.findFirst({ where: { name: cert.name } });
        if (existing) {
            await prisma.certification.update({ where: { id: existing.id }, data: cert });
        } else {
            await prisma.certification.create({ data: cert });
        }
    }

    const projects = [
        {
            title: "Critical Infrastructure Overhaul",
            description: "**Context:** Aviation Ground Services (Harare)\n**Role:** Systems Support Officer\n**Impact:** Led a complete network infrastructure overhaul, achieving a **30% reduction in downtime**. Implemented a Disaster Recovery Plan that reduced potential data loss risk by 40% using Sophos and Dynamics NAV.",
            tags: "Infrastructure, Security, DR Plans",
            imageUrl: "from-blue-600 to-cyan-500",
            category: "Infrastructure",
            order: 1
        },
        {
            title: "Real-Time Pawn Auction Platform",
            description: "**Context:** Antigravity Project\n**Stack:** Next.js 14, Prisma, Postgres, Vercel Edge\n**Impact:** Full-stack ERP for the pawn industry digitizing loan origination. Handles **real-time bidding** with sub-second latency, showcasing high-performance web architecture.",
            tags: "Next.js, FinTech, Real-time",
            imageUrl: "from-emerald-600 to-green-500",
            category: "Web Development",
            demoUrl: "https://real-time-capital.vercel.app", // Keeping if valid, or remove if not
            order: 2
        },
        {
            title: "AI Social Media Agent",
            description: "**Context:** Antigravity Project\n**Stack:** n8n, Gemini Pro, Agentic Workflows\n**Impact:** Designed an autonomous agent capable of observing trends, planning campaigns, and generating content. Demonstrates advanced **LLM orchestration** and automation capabilities.",
            tags: "AI, Automation, LLMs",
            imageUrl: "from-purple-600 to-pink-500",
            category: "AI & Automation",
            order: 3
        },
        {
            title: "Financial Systems Optimization",
            description: "**Context:** FinSys Zimbabwe / Vernomas\n**Role:** Technical Consultant\n**Impact:** Conducted comprehensive hardware/software analysis to optimize system performance. Aligned technical solutions with organizational goals for multiple enterprise clients.",
            tags: "Consultancy, Optimization, Analysis",
            imageUrl: "from-orange-500 to-red-500",
            category: "Consultancy",
            order: 4
        }
    ];

    for (const p of projects) {
        // Cleanup old generic ones to avoid clutter if feasible, but update upsert ensures new ones appear
        // We will just upsert these specific ones.
        const existing = await prisma.project.findFirst({ where: { title: p.title } });
        if (existing) {
            await prisma.project.update({ where: { id: existing.id }, data: p });
        } else {
            await prisma.project.create({ data: p });
        }
    }

    // Optional: Clean up old generic titles if we want to be strict
    await prisma.project.deleteMany({
        where: {
            title: { in: ["Global Logistics Cloud Migration", "Zero Trust Security Framework", "Enterprise Network Optimization", "Virtualization & Automation", "Microsoft 365 Hardening", "VMware Consolidation"] }
        }
    });

    // --- CERTIFICATIONS ---
    // (Moved to top of file)

    // --- JOURNAL ---
    const journals = [
        {
            stardate: "2025.42",
            title: "Network Security Protocols",
            category: "Insights",
            content: "Reflecting on recent consulting work. The biggest vulnerability often isn't code, but process. A must-read for IT managers rolling out new security policies.",
            tags: "[\"security\", \"process\", \"consulting\"]"
        },
        {
            stardate: "2025.12",
            title: "Portfolio Systems Online",
            category: "Tech",
            content: "Successfully deployed the new portfolio interface. The constellation storage matrix is functioning within expected parameters. For fellow devs: this stack uses Next.js 15, Prisma, and SQLite.",
            tags: "[\"nextjs\", \"prisma\", \"deployment\"]"
        }
    ];

    for (const j of journals) {
        const existing = await prisma.journalEntry.findFirst({ where: { title: j.title } });
        if (existing) {
            await prisma.journalEntry.update({ where: { id: existing.id }, data: j });
        } else {
            await prisma.journalEntry.create({ data: j });
        }
    }


    // --- KNOWLEDGE BASE (Chatbot) ---
    // Keep as create if not unique, or just single entry check
    const kEntry = await prisma.knowledgeEntry.findFirst({ where: { topic: 'greeting' } });
    if (!kEntry) {
        await prisma.knowledgeEntry.create({
            data: {
                topic: 'greeting',
                keywords: JSON.stringify(["hi", "hello", "hey", "start"]),
                responses: JSON.stringify([
                    "Hello! I am Edward's automated assistant (Dynamic Mode v8.1).",
                    "Greetings! Ready to showcase Edward's work. Type *Projects* or *Skills* to start."
                ])
            }
        });
    }

    console.log('Seeding finished (Safe Mode).')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
