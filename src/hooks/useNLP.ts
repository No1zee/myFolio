import nlp from 'compromise';

// --- TYPES ---
export interface NLPResponse {
    intent: 'greeting' | 'projects' | 'skills' | 'contact' | 'about' | 'unknown' | 'joke' | 'praise';
    entities: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    originalText: string;
}

// --- CONFIGURATION ---
// Extend compromise with custom lexicon for our portfolio domain
nlp.plugin({
    words: {
        // PROJECTS
        'finsys': 'Project',
        'securenet': 'Project',
        'dashboard': 'Project',
        'portfolio': 'Project',
        'work': 'Project',
        'projects': 'Project',
        'built': 'Project',
        'created': 'Project',

        // SKILLS
        'react': 'Skill',
        'python': 'Skill',
        'javascript': 'Skill',
        'typescript': 'Skill',
        'nextjs': 'Skill',
        'node': 'Skill',
        'sql': 'Skill',
        'linux': 'Skill',
        'cloud': 'Skill',
        'azure': 'Skill',
        'gcp': 'Skill',
        'aws': 'Skill',
        'security': 'Skill',
        'firewall': 'Skill',
        'coding': 'Skill',
        'stack': 'Skill',
        'tech': 'Skill',

        // CONTACT
        'email': 'Contact',
        'phone': 'Contact',
        'call': 'Contact',
        'hire': 'Contact',
        'resume': 'Contact',
        'cv': 'Contact',
        'contact': 'Contact',
        'reach': 'Contact',

        // ABOUT
        'who': 'About',
        'edward': 'About',
        'author': 'About',
        'developer': 'About',
        'you': 'About',
        'yourself': 'About',
        'experience': 'About',
        'history': 'About',
    }
});

export const useNLP = () => {

    const processText = (text: string): NLPResponse => {
        const doc = nlp(text);
        const lower = text.toLowerCase();

        // 1. EXTRACT ENTITIES (Based on our custom lexicon + built-ins)
        // @ts-ignore - 'topics' is available in compromise
        const entities = doc.match('#Project').out('array').concat(
            doc.match('#Skill').out('array'),
            doc.match('#Contact').out('array'),
            doc.match('#About').out('array')
        );

        // 2. DETERMINE INTENT (Rule-based Hierarchy)

        // GREETING
        if (doc.has('(hello|hi|hey|greetings|morning|afternoon)')) {
            return { intent: 'greeting', entities, sentiment: 'neutral', originalText: text };
        }

        // PRAISE (Small Talk involved)
        if (doc.has('(cool|awesome|great|nice|love|like|good job)')) {
            return { intent: 'praise', entities, sentiment: 'positive', originalText: text };
        }

        // CONTACT
        if (doc.has('#Contact') || doc.has('(email|hire|job|work with|touch)')) {
            return { intent: 'contact', entities, sentiment: 'neutral', originalText: text };
        }

        // PROJECTS
        if (doc.has('#Project') || doc.has('(show|see|look at) (work|projects|portfolio|what you made)')) {
            return { intent: 'projects', entities, sentiment: 'neutral', originalText: text };
        }

        // SKILLS
        if (doc.has('#Skill') || doc.has('(stack|tech|technology|languages|frameworks|can you code|know)')) {
            return { intent: 'skills', entities, sentiment: 'neutral', originalText: text };
        }

        // ABOUT
        if (doc.has('#About') || doc.has('(who are you|tell me about|experience|background|bio)')) {
            return { intent: 'about', entities, sentiment: 'neutral', originalText: text };
        }

        // JOKE (Easter Egg)
        if (doc.has('(joke|funny|laugh)')) {
            return { intent: 'joke', entities, sentiment: 'positive', originalText: text };
        }

        // FALLBACK
        return { intent: 'unknown', entities, sentiment: 'neutral', originalText: text };
    };

    return { processText };
};
