
import { create } from 'zustand';

export type UserRole = 'Visitor' | 'CTO' | 'Founder' | 'IT Manager' | 'Developer';

interface MissionState {
    role: UserRole;
    setRole: (role: UserRole) => void;

    tasks: {
        identified: boolean;
        viewedProject: boolean;
        readLog: boolean;
        contacted: boolean;
    };
    completeTask: (task: keyof MissionState['tasks']) => void;

    diagnosticsMode: boolean;
    toggleDiagnostics: () => void;
    setDiagnostics: (mode: boolean) => void;
}

export const useMissionStore = create<MissionState>((set) => ({
    role: 'Visitor',
    setRole: (role) => set((state) => ({
        role,
        tasks: { ...state.tasks, identified: true } // Auto-complete identification task
    })),

    tasks: {
        identified: false,
        viewedProject: false,
        readLog: false,
        contacted: false,
    },
    completeTask: (task) => set((state) => ({
        tasks: { ...state.tasks, [task]: true }
    })),

    diagnosticsMode: false,
    toggleDiagnostics: () => set((state) => ({ diagnosticsMode: !state.diagnosticsMode })),
    setDiagnostics: (mode) => set({ diagnosticsMode: mode }),
}));
