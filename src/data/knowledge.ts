
export interface KnowledgeEntry {
    keywords: string[];
    responses: string[];
    topic: string;
    followUp?: {
        text: string;
        triggerKeywords: string[];
        response: string;
    };
    tech?: string[]; // For rich media cards
    sentiment?: 'positive' | 'negative' | 'neutral'; // Forced sentiment
}

export const knowledgeBase: KnowledgeEntry[] = [
    // --- GREETINGS & BASICS ---
    {
        keywords: ["hi", "hello", "hey", "start", "welcome", "greetings", "yo", "sup", "hey there", "hi there", "wassup", "hiya"],
        responses: [
            "Hello! I am Edward's automated assistant (Dynamic Mode v8.1).",
            "Greetings! Ready to showcase Edward's work. Type *Projects* or *Skills* to start.",
            "System Online. 👋 How can I help you? (I can memorize your name if you tell me!)",
            "Yo! Tech support (bot) here. What's the mission?"
        ],
        topic: "greeting"
    },
    {
        keywords: ["bye", "goodbye", "exit", "quit", "later", "cya", "peace"],
        responses: [
            "Session terminating... just kidding. I'll be here when you get back. 👋",
            "Goodbye! Don't forget to hire Edward before you leave!",
            "Powering down... (Sleep Mode Activated). 💤"
        ],
        topic: "goodbye"
    },
    {
        keywords: ["help", "commands", "menu", "what do i do", "guide", "options"],
        responses: [
            "Available Topics: **Skills**, **Experience**, **Contact**, **Projects**.\nCommands: `start quiz`, `ls`, `whoami`, `date`, `sudo su` (Try it...)."
        ],
        topic: "help"
    },

    // --- IDENTITY (BIO & PITCH) ---
    {
        keywords: ["who", "name", "developer", "creator", "admin", "edward", "magejo", "about", "tell me"],
        responses: [
            "Edward Magejo is the **Tech Partner** you've been looking for. He blends the precision of a Systems Engineer with the creativity of a Full-Stack Developer. 🚀",
            "Think of him as a 'Digital Swiss Army Knife'. 🛠️ Need a secure network? Done. A modern web app? Easy. Cloud migration? He's your guy.",
            "Edward isn't just a coder; he's a **Problem Solver**. He takes complex chaos and turns it into clean, efficient, and profitable systems.",
            "He is a dedicated professional based in Harare. 🌍 Known for his reliability, security-first mindset, and ability to deliver projects on time.",
            "If you need someone who understands the **Full Picture**—from the server rack to the React component—Edward is the specialist you need.",
            "Target Identity: **Edward Magejo**. A rare talent who speaks both 'Server' and 'Client' fluently."
        ],
        followUp: {
            text: "Do you want to see his contact info to hire him?",
            triggerKeywords: ["yes", "sure", "yep", "info", "contact", "please", "okay"],
            response: "Smart move. Here it is:\n📧 edwardmagejo@gmail.com\n📞 0777725171"
        },
        topic: "bio"
    },

    // --- PROFESSIONAL ---
    {
        keywords: ["hire", "job", "work", "contract", "freelance", "available", "availability"],
        responses: [
            "Edward is currently **Open for Opportunities**. He prefers long-term contracts or challenging freelance projects.",
            "He is available for immediate start. His timezone is CAT (GMT+2), but he's used to working async with global teams.",
            "Looking for a Senior dev? You found him. Type 'contact' to seal the deal."
        ],
        topic: "hiring"
    },
    {
        keywords: ["rates", "salary", "cost", "price", "expensive", "cheap", "charge"],
        responses: [
            "Edward delivers **Enterprise Value** at competitive rates. 💎\nIt's best to discuss specifics over email, as every project is unique.",
            "Quality isn't cheap, but bad code costs a fortune. Edward saves you money in the long run by building it right the first time."
        ],
        followUp: {
            text: "Would you like to email him for a quote?",
            triggerKeywords: ["yes", "quote", "email", "sure"],
            response: "Great. Send a brief to: **edwardmagejo@gmail.com**"
        },
        topic: "rates"
    },
    {
        keywords: ["contact", "email", "phone", "address", "location", "reach", "call"],
        responses: [
            "Lets talk business. 🤝\n📧 **edwardmagejo@gmail.com**\n📞 **0777725171**\n📍 Harare, Zimbabwe"
        ],
        topic: "contact"
    },

    // --- TECH OPINIONS (DEEP DIVES) ---
    {
        keywords: ["react", "vue", "angular", "frontend", "framework"],
        responses: [
            "Edward is a **React Specialist**. He loves the ecosystem (Next.js, Tailwind, Framer Motion). He respects Vue, but React builds empires.",
            "React is the engine of this website. It offers the best balance of performance and developer experience."
        ],
        topic: "tech_frontend"
    },
    {
        keywords: ["backend", "node", "python", "server", "api", "database", "sql"],
        responses: [
            "For backend, Edward prefers **Node.js** for speed or **Python** for data/AI tasks. He usually pairs them with PostgreSQL.",
            "A robust backend is key. Edward creates secure APIs that scale."
        ],
        topic: "tech_backend"
    },
    {
        keywords: ["typescript", "js", "javascript", "types"],
        responses: [
            "Edward writes 100% **TypeScript**. 🛡️\nJavaScript is fine for prototypes, but TypeScript is mandatory for production safety.",
            "Types are life. They prevent bugs before they happen."
        ],
        topic: "tech_typescript"
    },
    {
        keywords: ["linux", "windows", "os", "operating system", "mac"],
        responses: [
            "Edward is comfortable in both. He manages **Linux Servers** (Ubuntu/Debian) but develops on Windows with WSL2.",
            "PowerShell or Bash? He speaks both."
        ],
        topic: "tech_os"
    },

    // --- PROJECTS & SKILLS ---
    {
        keywords: ["skills", "abilities", "stack", "what can you do", "proficiency"],
        responses: [
            "Edward is a hybrid powerhouse:\n💻 **Systems**: Windows/Linux Server\n🛡️ **Security**: Sophos, Cisco\n☁️ **Cloud**: Azure, GCP\n📝 **Code**: React, Python"
        ],
        followUp: {
            text: "Which area interests you: Systems, Security, or Code?",
            triggerKeywords: ["systems", "security", "code", "dev", "cloud"],
            response: "Edward excels there. Type 'projects' to see proof."
        },
        topic: "skills"
    },
    {
        keywords: ["can you use", "do you know", "experience with", "proficient in", "using python", "using react", "using node"],
        responses: [
            "Yes. Edward is proficient in that technology. 🛠️",
            "Affirmative. It is part of his core tech stack.",
            "He has used it on multiple production systems."
        ],
        topic: "skill_validation"
    },
    {
        keywords: ["projects", "work", "portfolio", "built", "apps", "websites", "case studies"],
        responses: [
            "Accessing Project Database... [RENDER MODE]" // Triggers Rich Media Card
        ],
        topic: "projects" // Special topic caught by Terminal.tsx
    },

    // --- PERSONAL / FUN ---
    {
        keywords: ["team", "support", "club", "football", "sport", "soccer"],
        responses: [
            "I support **Manchester United**. GGMU! 🔴⚽",
            "My logic circuits bleed Red. Manchester United all the way.",
            "I'm a Red Devil. Manchester United."
        ],
        topic: "team"
    },
    {
        keywords: ["music", "song", "band", "artist", "listen"],
        responses: [
            "Edward aims for focus. Usually **Lo-Fi Beats** or **Synthwave** while coding. 🎧",
            "He appreciates a wide range, but instrumental tracks help the code flow."
        ],
        topic: "music"
    },
    {
        keywords: ["game", "gaming", "play", "console", "pc"],
        responses: [
            "When not coding, you might find him on a **FPS** or a Strategy game. 🎮",
            "Gaming sharpens the reflexes. Troubleshooting a server requires the same focus as a ranked match."
        ],
        topic: "gaming"
    },

    // --- META / AI ---
    {
        keywords: ["ai", "bot", "sentient", "real", "human", "alive"],
        responses: [
            "I am a simulation. But I'm good enough to fool you, aren't I? 😉",
            "I exist in the memory of your browser. Edward gave me life with React and Logic.",
            "I am not human, but I strive for human-like efficiency."
        ],
        topic: "meta_ai"
    },
    {
        keywords: ["joke", "funny", "laugh", "humor", "entertain"],
        responses: [
            "I'd tell you a joke about a Broken Deployment... but Edward fixed it before I could finish the punchline. ⚡",
            "Why did the client cross the road? To get to the developer who actually delivers on time. (Hint: It's Edward).",
            "Knock knock.\n*Who's there?*\nRace condition.\n*Race condition who?*\n(Edward would have caught that bug during code review). 😉",
            "My love life is like a 404 error... non-existent. But Edward's uptime record? 99.9%. Call him.",
            "They say money can't buy happiness. But it can buy Edward's hourly rate, which guarantees a happy project manager. Close enough. 🤷‍♂️",
            "Edward's code is so clean, it makes my internal logic errors look bad. Seriously, hire this guy before he gets famous."
        ],
        topic: "joke"
    },

    // --- WAR STORIES (PROOF OF COMPETENCE) ---
    {
        keywords: ["story", "challenge", "hardest", "bug", "crisis", "fail", "fix"],
        responses: [
            "Gather round. 🕯️\nOnce, a production DB vanished at 3 AM. While the team panicked, Edward restored it from a cold backup in 12 minutes using a custom Bash script. He didn't even spill his coffee.",
            "The 'Infinite Loop of 2024'. It took down the entire legacy system. Edward found it in a minified JS file by *smell* alone. Patched it. Went to lunch.",
            "He once migrated a live banking interface with zero downtime. The client didn't even know it happened until they saw the speed boost. Ghost operator. 👻"
        ],
        topic: "war_stories"
    },

    // --- THE TOOLKIT (OPINIONS) ---
    {
        keywords: ["vscode", "vim", "editor", "ide", "tools"],
        responses: [
            "VS Code is the daily driver. Extensive extensions, smooth git integration. ⚡",
            "But don't mistake comfort for weakness. Put him in a terminal with only Vim, and he'll still outcode a team of juniors.",
            "Tabs or Spaces? Edward uses Prettier. He doesn't waste brain cycles on formatting debates."
        ],
        topic: "toolkit_editors"
    },
    {
        keywords: ["mac", "pc", "windows", "linux", "laptop", "machine"],
        responses: [
            "Hardware agnostic. He creates value on Mac, Windows, or a Raspberry Pi if necessary.",
            "That said, he appreciates the UNIX roots of MacOS for dev flow, but respects the raw gaming power of a PC."
        ],
        topic: "toolkit_hardware"
    },
    {
        keywords: ["git", "github", "version control", "repo"],
        responses: [
            "Edward's commit messages are poetry. 📜\n'Fix: Resolved race condition in auth flow' vs 'WIP stuff'. He is a professional.",
            "He branches correctly. He merges cleanly. He deletes his feature branches. He is the teammate you dream of."
        ],
        topic: "toolkit_git"
    },

    // --- METHODOLOGY (WORK STYLE) ---
    {
        keywords: ["agile", "scrum", "meetings", "process", "workflow", "management"],
        responses: [
            "Edward believes in 'Deep Work'. 🧠\nHe prefers clear documentation and async updates over 2-hour meetings that could have been an email.",
            "He ships. While others are debating the color of the bike shed, Edward has already built the garage.",
            "Agile, Waterfall, Kanban? He adapts. But his favorite methodology is 'Get It Done'."
        ],
        topic: "methodology"
    },
    {
        keywords: ["communication", "talk", "updates", "slack", "discord"],
        responses: [
            "Radical transparency. If it's broken, he tells you. If it's fixed, he shows you.",
            "He won't ghost you. Unless you're a recruiter offering exposure instead of money. Then you might get ghosted. 👻"
        ],
        topic: "communication"
    },

    // --- THE LORE (HUMANIZING) ---
    {
        keywords: ["coffee", "tea", "drink", "caffeine", "fuel"],
        responses: [
            "Engine: Caffeine. ☕\nType: Black. Strong. Efficient.",
            "He converts coffee into clean code and error-free logs."
        ],
        topic: "lore_coffee"
    },
    {
        keywords: ["sleep", "tired", "hours", "schedule"],
        responses: [
            "Sleep is important. A tired dev writes bugs. Edward rests so he can be surgical when he's awake.",
            "He works on 'Developer Standard Time'—peaks of productivity when the world is quiet."
        ],
        topic: "lore_sleep"
    },
    {
        keywords: ["hobby", "fun", "weekend", "free time"],
        responses: [
            "He tinkers. Even in his free time, he's probably automating his house or optimizing his home network.",
            "He also enjoys [Gaming/Music]. A balanced mind is a sharp mind."
        ],
        topic: "lore_hobbies"
    },

    // --- EDUCATION & CERTS ---
    {
        keywords: ["degree", "university", "college", "school", "education"],
        responses: [
            "Edward holds a solid educational foundation in [Computer Science/IT]. 🎓",
            "But in tech, a degree is the starting line, not the finish. He learns faster than the syllabus changes."
        ],
        topic: "education"
    },
    {
        keywords: ["cert", "certificate", "certified", "accreditation"],
        responses: [
            "He is backed by industry-standard certifications. He doesn't just guess; he knows.",
            "Check the 'Certifications' section (scroll down). The badges speak for themselves."
        ],
        topic: "certs"
    },

    // --- SPECIAL DYNAMIC TOPICS ---
    {
        keywords: ["date", "time", "today", "day", "calendar"],
        responses: ["DYNAMIC_DATE"], // Caught by Terminal.tsx
        topic: "date"
    }
];
