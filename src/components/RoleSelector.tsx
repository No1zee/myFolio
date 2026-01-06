
"use client";

import React from 'react';
import { motion } from 'framer-motion';

type Role = 'Visitor' | 'CTO' | 'Founder' | 'IT Manager' | 'Developer';

interface RoleSelectorProps {
    currentRole: Role;
    onSelect: (role: Role) => void;
}

const roles: Role[] = ['Visitor', 'CTO', 'Founder', 'IT Manager'];

const RoleSelector = ({ currentRole, onSelect }: RoleSelectorProps) => {
    return (
        <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
            <span className="text-sm font-mono text-gray-500 py-1.5 self-center mr-2">I am a:</span>
            {roles.map((role) => (
                <button
                    key={role}
                    onClick={() => onSelect(role)}
                    className={`
                        text-xs font-bold px-3 py-1.5 rounded-full border transition-all duration-300
                        ${currentRole === role
                            ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                            : 'bg-transparent border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'}
                    `}
                >
                    {role}
                </button>
            ))}
        </div>
    );
};

export default RoleSelector;
