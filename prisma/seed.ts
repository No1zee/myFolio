
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
            title: "Global Logistics Cloud Migration",
            description: "**Environment:** 50+ Servers, 12 Custom Apps\n**Role:** Lead Architect\n**Result:** Migrated legacy logistics systems to Hybrid Azure. Implemented redundant connectivity (ExpressRoute + VPN) and auto-failover, resulting in **30% reduction in downtime** and zero data loss during regional outages.",
            tags: "Azure, Hybrid Cloud, Migration",
            imageUrl: "from-blue-500 to-cyan-400",
            category: "Infrastructure"
        },
        {
            title: "Zero Trust Security Framework",
            description: "**Scope:** 500+ Endpoints, 200 Users\n**Role:** Security Lead\n**Result:** Deployed comprehensive Zero Trust guidelines. Passed ISO 27001 audit with **zero major non-conformities**. Successfully thwarted 3 ransomware attempts via new EDR protocols.",
            tags: "Security, Compliance, Zero Trust",
            imageUrl: "from-purple-500 to-pink-500",
            category: "Security"
        },
        {
            title: "Enterprise Network Optimization",
            description: "**Scale:** 4 Regional Sites, SD-WAN\n**Role:** Ops Manager\n**Result:** Overhauled network for Sybyl's branches. Optimized routing for SAP/VoIP traffic, achieving **99.99% network availability** and reducing inter-branch latency by 40ms.",
            tags: "Networking, SD-WAN, Cisco",
            imageUrl: "from-orange-400 to-red-500",
            category: "Network"
        },
        {
            title: "Virtualization & Automation",
            description: "**Stack:** VMware vSphere, PowerShell\n**Result:** Virtualized 60% of physical estate. Automated user provisioning saves **20+ hours/week**. Reduced server energy footprint by ~45%.",
            tags: "VMware, Automation, PowerShell",
            imageUrl: "from-green-400 to-emerald-500",
            category: "Systems"
        },
        {
            title: "Real Time Capital Pawn System",
            description: "**Stack:** Next.js 14, Prisma, Postgres\n**Result:** Full-stack ERP for the pawn industry. Digitized loan origination and public auctions. Handles **real-time bidding** with sub-second latency via Vercel Edge functions.",
            category: "FinTech Platform",
            imageUrl: "from-emerald-600 to-green-500",
            tags: "Next.js, TypeScript, PostgreSQL",
            demoUrl: "https://real-time-capital.vercel.app",
            order: 1
        },
        // NEW COMPACT CARDS
        {
            title: "Microsoft 365 Hardening",
            description: "**Result:** Secured tenants for 150-seat SME. Enforced MFA, conditional access policies, and Intune device management.",
            category: "Security",
            imageUrl: "from-blue-600 to-indigo-600",
            tags: "M365, Intune, Security",
            demoUrl: "",
            order: 2
        },
        {
            title: "VMware Consolidation",
            description: "**Result:** Consolidating 3 legacy clusters into a unified high-availability HCI cluster. Reduced licensing costs by 20%.",
            category: "Infrastructure",
            imageUrl: "from-gray-600 to-gray-500",
            tags: "VMware, HCI, Storage",
            demoUrl: "",
            order: 3
        }
    ];

    for (const p of projects) {
        const existing = await prisma.project.findFirst({ where: { title: p.title } });
        if (existing) {
            await prisma.project.update({ where: { id: existing.id }, data: p });
        } else {
            await prisma.project.create({ data: p });
        }
    }

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
