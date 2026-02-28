import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Phone, Mail, HelpCircle, ChevronRight } from 'lucide-react';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
    const supportOptions = [
        {
            icon: MessageSquare,
            title: 'Chat with us',
            description: 'Typical response time: 5 minutes',
            color: 'bg-emerald-50 text-emerald-600',
            action: () => alert('Connecting to live chat support...\n\nTicket created: TKT-2024-884\n(Assigned to Sarah Admin)')
        },
        {
            icon: Phone,
            title: 'Call Support',
            description: 'Available 24/7 for urgent issues',
            color: 'bg-blue-50 text-blue-600',
            action: () => alert('Calling RideNaira Support: +234 800-RIDENAIRA\n\nTicket reference: TKT-2024-885')
        },
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Send us a message anytime',
            color: 'bg-purple-50 text-purple-600',
            action: () => alert('Opening email composer to support@ridenaira.com\n\nSubject: [TKT-2024-886] Support Request')
        },
        {
            icon: HelpCircle,
            title: 'FAQ & Help Center',
            description: 'Find answers to common questions',
            color: 'bg-amber-50 text-amber-600',
            action: () => alert('Opening Help Center... (Demo)')
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-[32px] p-6 pb-12 max-w-md mx-auto shadow-2xl"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full" />
                        </div>

                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">How can we help?</h2>
                                <p className="text-sm text-slate-500 font-medium mt-1">Our support team is always here for you.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 active:scale-95 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {supportOptions.map((option, idx) => {
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={idx}
                                        onClick={option.action}
                                        className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 active:scale-[0.98] transition-all group shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center`}>
                                                <Icon size={24} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-base font-bold text-slate-900">{option.title}</p>
                                                <p className="text-xs text-slate-400 font-medium">{option.description}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-slate-300 group-hover:text-slate-400" size={20} />
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Version 1.0.4 (BETA)</p>
                            <p className="text-[10px] text-slate-300 font-medium px-8">RideNaira is committed to your safety and satisfaction. Please report any issues immediately.</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
