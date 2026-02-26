"use client";

import { useState } from "react";

export interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    items: FAQItem[];
}

export default function FAQ({ items }: FAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0); // Opcional: open primeiro por default

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                    <div
                        key={index}
                        className={`glass-panel overflow-hidden transition-all duration-300 border ${isOpen ? 'border-emerald-500/30 shadow-[0_4px_20px_0_rgba(16,185,129,0.05)]' : 'border-card-border hover:border-emerald-500/20'
                            }`}
                    >
                        <button
                            onClick={() => toggleItem(index)}
                            className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-[2rem]"
                            aria-expanded={isOpen}
                        >
                            <h3 className={`text-lg font-semibold transition-colors duration-200 ${isOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground/90 group-hover:text-foreground'}`}>
                                {item.question}
                            </h3>
                            <div className={`flex-shrink-0 ml-4 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-emerald-500/10 text-emerald-600 rotate-180' : 'bg-foreground/5 text-foreground/50'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                            </div>
                        </button>

                        <div
                            className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="p-5 sm:p-6 pt-0 text-foreground/70 leading-relaxed border-t border-card-border/50 mx-6">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
