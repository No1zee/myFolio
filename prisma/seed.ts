
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding (Safe Mode)...')

    // Note: We removed deleteMany to prevent data loss.
    // This script now focuses on ensuring DEFAULT data exists.

    // --- EXPERIENCE ---
    // Experience is complex to upsert. We will only create defaults if the table is empty.
    const experienceCount = await prisma.experience.count();

    if (experienceCount === 0) {
        const ags = await prisma.experience.create({
            data: {
                role: 'Head of IT & Infrastructure',
                company: 'AGS (Global Logistics)',
                location: 'Harare, Zimbabwe',
                startDate: new Date('2023-01-01'),
                endDate: null,
                isCurrent: true,
                order: 1,
                description: `Tags: Leadership, Cloud, Security
- **Infrastructure Modernization**: Led the complete digital transformation of AGS, migrating mission-critical legacy systems to a hybrid cloud architecture (Azure + On-Prem), resulting in a 40% reduction in downtime and 25% OpEx savings.
- **Zero Trust Security**: Designed and implemented a Zero Trust security framework, deploying advanced endpoint protection and improved access controls. Successfully prepared the organization for ISO 27001 compliance audit.
- **Team Leadership**: Managed and mentored a cross-functional team of 15 IT professionals. Introduced Agile workflows and CI/CD practices, increasing deployment velocity by 60%.
- **Strategic Resilience**: Established robust Disaster Recovery (DR) and Business Continuity Plans (BCP), ensuring 99.99% uptime for critical supply chain operations during regional outages.`
            },
        });

        const antigravity = await prisma.experience.create({
            data: {
                role: 'Antigravity Engineer',
                company: 'Independent Research',
                location: 'The Void',
                startDate: new Date('2024-01-01'),
                endDate: null,
                isCurrent: true,
                order: 2,
                description: `Tags: Experimental, AI Agents, Next.js
- **[CLASSIFIED]** An experimental playground for testing agentic workflows.
- Developing a proprietary "Mission Control" interface for autonomous personal data management.
- Exploring the intersection of LLMs and reactive frontend state management.`
            },
        });

        const sybyl = await prisma.experience.create({
            data: {
                role: 'IT Manager',
                company: 'Sybyl (Enterprise IT)',
                location: 'Harare, Zimbabwe',
                startDate: new Date('2021-01-01'),
                endDate: new Date('2022-12-31'),
                isCurrent: false,
                order: 3,
                description: `Tags: Operations, Networking, Hardware
- **Operational Excellence**: Directed IT operations across 4 regional branches, ensuring 99.9% network availability and seamless inter-branch connectivity via SD-WAN implementation.
- **Process Optimization**: Revamped helpdesk workflows by implementing ITIL best practices, reducing average ticket resolution time by 50% and increasing user satisfaction scores.
- **Digital Workplace**: Led the organization-wide migration to Microsoft 365, managing change management and training for 200+ users to boost remote collaboration capabilities.
- **Cost Reduction**: renegotiated vendor contracts and optimized hardware procurement, saving the company 15% on annual IT assets expenditure.`
            },
        });

        const vard = await prisma.experience.create({
            data: {
                role: 'Systems Administrator',
                company: 'Vard Engineering',
                location: 'Harare, Zimbabwe',
                startDate: new Date('2019-01-01'),
                endDate: new Date('2020-12-31'),
                isCurrent: false,
                order: 4,
                description: `Tags: Linux, Virtualization, Support
- **Server Administration**: Administered a mixed environment of Linux (RHEL/Ubuntu) and Windows servers, ensuring stability for critical engineering applications (AutoCAD, SAP).
- **Virtualization Initiative**: Led the virtualization of physical servers using VMware vSphere, ignoring hardware footprint by 60% and reducing power/cooling costs.
- **Automation**: Developed Bash and PowerShell scripts to automate routine system maintenance, backups, and user provisioning, saving 20+ man-hours weekly.
- **System Hardening**: Implemented rigorous patching schedules and security policies, mitigating vulnerability risks across the server estate.`
            },
        });
    }

    // ... SKILLS (Keep existing logic) ...
    const skillCategories = [
        { category: "Operating Systems", items: ["Microsoft 365 Administration", "Linux"] },
        { category: "Network Tools", items: ["Sophos", "Dynamics NAV", "Emirates SkyChain"] },
        { category: "Programming", items: ["Python", "VB.NET", "Java", "Visual C++", "JavaScript", "TypeScript"] },
        { category: "Software & Tools", items: ["Splunk", "Wireshark", "VMware", "Active Directory", "Docker", "Git"] },
        { category: "Security", items: ["ISO/IEC 27001", "Network Security", "Cybersecurity"] }
    ];

    for (const cat of skillCategories) {
        for (const item of cat.items) {
            // Check existence manually since name isn't unique in schema (yet) or simple check
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
    await prisma.certification.create({
        data: {
            name: "Certified Information Systems Auditor (CISA)",
            issuer: "ISACA",
            year: "2024",
            category: "Core",
            tech: "Auditing",
            color: "border-blue-500",
            order: 1
        }
    });
    await prisma.certification.create({
        data: {
            name: "Cisco Certified Network Associate (CCNA)",
            issuer: "Cisco",
            year: "2023",
            category: "Core",
            tech: "Networking",
            color: "border-teal-500",
            order: 2
        }
    });






    // ... (Services skipped for brevity) ...
    // --- SERVICES (Capabilities) ---
    const services = [
        {
            title: "Network Security Audit",
            icon: "🛡️",
            description: "Reduce downtime and security incidents with a full network security audit in under 10 days. Includes vulnerability assessment and hardening strategies.",
            features: JSON.stringify(["Vulnerability Scan", "Firewall Config", "Access Control Review"]),
            color: "from-blue-500 to-cyan-400"
        },
        {
            title: "System Optimization",
            icon: "🚀",
            description: "Tune your systems for peak performance. I identify bottlenecks and optimize hardware/software to ensure your business operates at speed.",
            features: JSON.stringify(["Performance Tuning", "Hardware Upgrades", "Software Patching"]),
            color: "from-mint-500 to-green-400"
        },
        {
            title: "Disaster Recovery",
            icon: "💾",
            description: "Ensure business continuity. I design and implement robust backup and recovery plans to protect your data from the unexpected.",
            features: JSON.stringify(["Backup Strategy", "Incident Response", "Recovery Drills"]),
            color: "from-pink-500 to-purple-400"
        },
        {
            title: "IT Infrastructure Design",
            icon: "🏗️",
            description: "Scalable, secure, and efficient IT architectures tailored to your business goals. Whether building from scratch or upgrading.",
            features: JSON.stringify(["Network Topology", "Server Setup", "Cloud Integration"]),
            color: "from-yellow-400 to-orange-400"
        }
    ];

    for (const s of services) {
        const existing = await prisma.service.findFirst({ where: { title: s.title } });
        if (existing) {
            await prisma.service.update({ where: { id: existing.id }, data: s });
        } else {
            await prisma.service.create({ data: s });
        }
    }

    const projects = [
        {
            title: "Global Logistics Cloud Migration",
            description: "**Reduced downtime by 40%**\nLed the end-to-end migration of mission-critical logistics systems to a hybrid Azure environment. Implemented redundant connectivity and automated failover, saving the company $50k/year in downtime costs.",
            tags: "Azure, Hybrid Cloud, Migration",
            imageUrl: "from-blue-500 to-cyan-400",
            category: "Infrastructure"
        },
        {
            title: "Zero Trust Security Framework",
            description: "**ISO 27001 Readiness**\nDesigned and rolled out a comprehensive Zero Trust architecture. Secured 500+ endpoints and strictly defined access controls, successfully clearing the path for ISO 27001 certification.",
            tags: "Security, Compliance, Zero Trust",
            imageUrl: "from-purple-500 to-pink-500",
            category: "Security"
        },
        {
            title: "Enterprise Network Optimization",
            description: "**99.9% Uptime Achieved**\nOverhauled the network infrastructure for Sybyl's regional branches. Deployed SD-WAN and optimized routing protocols to ensure seamless connectivity for high-volume transaction processing.",
            tags: "Networking, SD-WAN, Cisco",
            imageUrl: "from-orange-400 to-red-500",
            category: "Network"
        },
        {
            title: "Virtualization & Automation",
            description: "**60% Hardware Footprint Reduction**\nVirtualized physical server estate using VMware vSphere. Developed bespoke PowerShell automation for user provisioning and system maintenance, saving 200+ engineering hours annually.",
            tags: "VMware, Automation, PowerShell",
            imageUrl: "from-green-400 to-emerald-500",
            category: "Systems"
        },
        {
            title: "Real Time Capital Pawn System",
            description: "A comprehensive ERP system for the pawn industry digitizing loan origination, inventory management, and public auctions. Features role-based access for customers/employees and real-time bidding engines.",
            category: "FinTech Platform",
            imageUrl: "from-emerald-600 to-green-500",
            tags: "Next.js, TypeScript, Prisma, Postgres, Tailwind",
            demoUrl: "https://real-time-capital.vercel.app",
            order: 1
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
    const certifications = [
        { name: "Cisco CyberOps Associate", issuer: "Cisco", year: "2023", color: "from-blue-600 to-cyan-500", category: "Core", tech: "[\"Network Security\", \"Incident Response\"]" },
        { name: "Certified Cybersecurity Technician", issuer: "EC Council", year: "2023", color: "from-red-600 to-orange-500", category: "Core", tech: "[\"Ethical Hacking\", \"Pen Testing\"]" },
        { name: "Azure Fundamentals", issuer: "Microsoft", year: "2023", color: "from-blue-500 to-blue-300", category: "Core", tech: "[\"Cloud Computing\", \"Azure AD\"]" },
        { name: "Google Cloud Associate", issuer: "Google", year: "2024", color: "from-yellow-400 to-orange-400", category: "Core", tech: "[\"GCP\", \"Cloud Architecture\"]" },
        { name: "ISO/IEC 27001 Foundation", issuer: "Skillshare", year: "2023", color: "from-purple-500 to-indigo-500", category: "Core", tech: "[\"Compliance\", \"Risk Mgmt\"]" },
        { name: "Antigravity Engineer", issuer: "Google DeepMind", year: "2024", color: "from-pink-500 to-purple-500", category: "Experimental", tech: "[\"Agentic AI\", \"Prompt Engineering\"]" },
        { name: "Blockchain Fundamentals", issuer: "Chainlink", year: "2024", color: "from-indigo-500 to-purple-600", category: "Experimental", tech: "[\"Web3\", \"Smart Contracts\"]" },
        { name: "Certified Information Systems Auditor (CISA)", issuer: "ISACA", year: "2024", category: "Core", tech: "Auditing", color: "border-blue-500", order: 1 },
        { name: "Cisco Certified Network Associate (CCNA)", issuer: "Cisco", year: "2023", category: "Core", tech: "Networking", color: "border-teal-500", order: 2 }
    ];

    for (const cert of certifications) {
        const existing = await prisma.certification.findFirst({ where: { name: cert.name } });
        if (existing) {
            await prisma.certification.update({ where: { id: existing.id }, data: cert });
        } else {
            await prisma.certification.create({ data: cert });
        }
    }

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
