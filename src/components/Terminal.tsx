"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
// import { useNLP } from '@/hooks/useNLP'; // Removed local NLP

// --- TYPES ---
interface Message {
    id: string;
    text: string;
    sender: 'user' | 'system' | 'error';
    timestamp: number;
    component?: React.ReactNode; // NEW: Rich Media Support
}

interface QuizQuestion {
    id: string;
    question: string;
    answerKeywords: string[];
    correctResponse: string;
    wrongResponse: string;
}

// --- TYPEWRITER COMPONENT ---
const Typewriter = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hasStartedRef = useRef(false);

    useEffect(() => {
        // Reset state on text change
        setDisplayedText("");
        hasStartedRef.current = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        let index = 0;

        const typeChar = () => {
            if (index < text.length) {
                // Use functional update correctly, but since we reset, we can strictly control it by index if needed.
                // However, append is safer for 'typing' feel.
                // To prevent double-invocation overlap, we trust the clean-up above.

                const char = text.charAt(index);
                setDisplayedText((prev) => prev + char);
                index++;

                let delay = 30; // Slightly slower for better effect
                if (char === '.' || char === '?' || char === '!') delay = 400;
                if (char === ',') delay = 150;

                timeoutRef.current = setTimeout(typeChar, delay);
            } else {
                if (onComplete) onComplete();
            }
        };

        timeoutRef.current = setTimeout(typeChar, 100);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

    return <span>{displayedText}</span>;
};

// --- DATA: QUIZ BANK ---
const quizBank: QuizQuestion[] = [
    {
        id: 'q1',
        question: "Trivia Time! 🤓\nWhich React hook is used to handle side effects?",
        answerKeywords: ['effect', 'useeffect'],
        correctResponse: "Correct! `useEffect` is the magic handler. +10 Points.",
        wrongResponse: "Incorrect. The answer was `useEffect`. Better luck next time."
    },
    {
        id: 'q2',
        question: "Security Check: 🔒\nWhat protocol secures data in transit over the web?",
        answerKeywords: ['https', 'ssl', 'tls'],
        correctResponse: "Access Granted. HTTPS/TLS is standard.",
        wrongResponse: "Risk Detected. The answer is HTTPS. Don't browse without it."
    },
    {
        id: 'q3',
        question: "Cloud Ops: ☁️\nWhat is the command to list files in Linux?",
        answerKeywords: ['ls', 'list'],
        correctResponse: "You know your shell. `ls` is correct.",
        wrongResponse: "Permission Denied. The command is `ls`."
    }
];

const getRandomResponse = (responses: string[]) => {
    return responses[Math.floor(Math.random() * responses.length)];
};

const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

export default function Terminal() {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<Message[]>([]); // Start empty to allow hydration-safe init
    const [isLoading, setIsLoading] = useState(false);
    const [isBooting, setIsBooting] = useState(false); // NEW: Boot State
    const [lastTopic, setLastTopic] = useState<any>(null);
    const [userName, setUserName] = useState<string | null>(null);

    // --- CONVERSATION STATE ---
    const [activeMode, setActiveMode] = useState<'default' | 'quiz' | 'follow_up'>('default');
    const [quizQuestion, setQuizQuestion] = useState<QuizQuestion | null>(null);
    const [expectedFollowUp, setExpectedFollowUp] = useState<any>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);

    // --- MEMORY SYSTEM & BOOT SEQUENCE ---
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const bootSequence = async () => {
            // Only play boot sequence if it hasn't played this session
            const hasBooted = sessionStorage.getItem('has_booted_v1');
            if (!hasBooted) {
                setIsBooting(true);
                const steps = [
                    { text: "> POWER ON...", delay: 800 },
                    { text: "> CHECKING MEMORY... OK [16GB]", delay: 600 },
                    { text: "> LOADING KERNEL... OK", delay: 600 },
                    { text: "> MOUNTING FS... OK", delay: 600 },
                    { text: "> CONNECTING TO NEURAL NET... OK", delay: 800 }
                ];

                for (const step of steps) {
                    addMessage(step.text, 'system');
                    await new Promise(r => setTimeout(r, step.delay));
                }
                sessionStorage.setItem('has_booted_v1', 'true');
                setIsBooting(false);
            }

            // Hydrate Memory
            const savedName = localStorage.getItem('user_profile_name');
            if (savedName) {
                setUserName(savedName);
                addMessage(`Welcome back, ${savedName}. Systems optimized for you. 🔋`, 'system');
            } else {
                addMessage(`Initializing v8.0 (Bio-Digital Interface)... ${getTimeGreeting()}.`, 'system');
                addMessage("Who am I speaking with? (Type 'My name is...')", 'system');
            }
        };

        bootSequence();
    }, []);

    const addMessage = (text: string, sender: 'user' | 'system' | 'error') => {
        setHistory(prev => [...prev, { id: Date.now().toString() + Math.random().toString(), text, sender, timestamp: Date.now() }]);
    };

    // --- API INTEGRATION ---
    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (!input.trim() || isLoading) return;

            const userMessage = input.trim();
            const lowerMsg = userMessage.toLowerCase();
            setInput("");
            addMessage(`> ${userMessage}`, 'user');

            // --- 1. LOCAL COMMANDS (Priority) ---
            if (activeMode === 'quiz' && quizQuestion) {
                setIsLoading(true);
                setTimeout(() => {
                    const isCorrect = quizQuestion.answerKeywords.some(k => lowerMsg.includes(k));
                    if (isCorrect) addMessage(quizQuestion.correctResponse, 'system');
                    else addMessage(quizQuestion.wrongResponse, 'error');
                    setActiveMode('default');
                    setQuizQuestion(null);
                    setIsLoading(false);
                }, 600);
                return;
            }

            if (lowerMsg === 'clear') { setHistory([{ id: Date.now().toString(), text: "Console cleared.", sender: 'system', timestamp: Date.now() }]); return; }
            if (lowerMsg === 'ls') { addMessage("drwxr-xr-x  projects/\n-rw-r--r--  contact.txt", 'system'); return; }
            if (lowerMsg === 'date') { addMessage(new Date().toString(), 'system'); return; }
            if (lowerMsg === 'start quiz') {
                const randomQ = quizBank[Math.floor(Math.random() * quizBank.length)];
                setQuizQuestion(randomQ);
                setActiveMode('quiz');
                setTimeout(() => addMessage(randomQ.question, 'system'), 200);
                return;
            }

            // Guestbook
            if (lowerMsg === 'guestbook') {
                setIsLoading(true);
                fetch('/api/guestbook').then(r => r.json()).then(d => {
                    const msg = Array.isArray(d) && d.length ? "DATA:\n" + d.map((e: any) => `[${new Date(e.createdAt).toLocaleDateString()}] ${e.name}: ${e.message}`).join('\n') : "Guestbook empty.";
                    addMessage(msg, 'system');
                }).catch(() => addMessage("DB Error.", 'error')).finally(() => setIsLoading(false));
                return;
            }
            if (lowerMsg.startsWith('sign ')) {
                const msg = userMessage.substring(5).trim();
                setIsLoading(true);
                fetch('/api/guestbook', { method: 'POST', body: JSON.stringify({ name: userName || "Anon", message: msg }) })
                    .then(r => r.ok ? addMessage("Signature saved.", 'system') : addMessage("Save failed.", 'error'))
                    .finally(() => setIsLoading(false));
                return;
            }

            // --- 2. GOOGLE GEMINI API ---
            setIsLoading(true);

            try {
                // Check for client-side key override (optional)
                const storedKey = localStorage.getItem('gemini_api_key');

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: userMessage,
                        apiKey: storedKey // Optional: User can provide their own key if env var is missing
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    addMessage(data.response, 'system');
                } else {
                    addMessage(`Error: ${data.error || "Communication breakdown."}`, 'error');
                    if (data.error && data.error.includes("API Key")) {
                        addMessage("TIP: Create a .env file with GOOGLE_API_KEY=... or set it via `localStorage.setItem('gemini_api_key', 'YOUR_KEY')` in dev console.", 'system');
                    }
                }
            } catch (error) {
                addMessage("System Malfunction. Unable to reach neural net.", 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [history, isLoading]);

    return (
        <div className="w-full max-w-lg mx-auto bg-black/90 rounded-xl overflow-hidden shadow-2xl border border-gray-700 font-mono text-sm md:text-base h-[400px] flex flex-col relative z-20">
            {/* Header */}
            <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-gray-400 text-xs">ai-agent@magejo-systems: {userName ? `~/${userName}` : "~"} {activeMode !== 'default' ? `[${activeMode.toUpperCase()}]` : ''}</span>
            </div>

            {/* Body */}
            <div ref={containerRef} className="p-4 flex-1 overflow-y-auto custom-scrollbar text-left" onClick={() => document.getElementById('hero-terminal-input')?.focus()}>
                <div className="space-y-3">
                    {history.map((msg, i) => (
                        <div key={msg.id} className={`${msg.sender === 'user' ? "text-white font-bold mt-4" : msg.sender === 'error' ? "text-red-400" : "text-green-400"} whitespace-pre-wrap leading-relaxed`}>
                            {msg.sender === 'system' && i === history.length - 1 && !isLoading ? (
                                <Typewriter text={msg.text} />
                            ) : (
                                <span>{msg.text}</span>
                            )}
                            {msg.component && <div className="mt-2">{msg.component}</div>}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="text-pink animate-pulse">Thinking...</div>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="p-3 bg-gray-900 border-t border-gray-700 flex items-center shrink-0">
                <span className="text-pink mr-2 animate-pulse">{userName ? `${userName}$` : "$"}</span>
                <input
                    id="hero-terminal-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading || isBooting}
                    className="bg-transparent border-none outline-none flex-1 focus:ring-0 text-white placeholder-gray-600 disabled:opacity-50"
                    placeholder={isBooting ? "INITIALIZING..." : isLoading ? "Processing..." : activeMode === 'quiz' ? "Enter Answer..." : "Interact..."}
                    autoComplete="off"
                />
            </div>
        </div>
    );
};
