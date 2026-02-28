import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Bell,
    Car,
    Ticket,
    Settings,
    Wallet,
    CheckCheck,
    ChevronRight,
    Search
} from 'lucide-react';
import { mockNotifications, Notification } from '../../data/mockData';
import { cn } from '../components/ui/utils';

export function NotificationsScreen() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'ride':
                return {
                    icon: Car,
                    bg: 'bg-blue-50',
                    color: 'text-blue-500'
                };
            case 'promo':
                return {
                    icon: Ticket,
                    bg: 'bg-orange-50',
                    color: 'text-orange-500'
                };
            case 'wallet':
                return {
                    icon: Wallet,
                    bg: 'bg-emerald-50',
                    color: 'text-emerald-500'
                };
            case 'system':
            default:
                return {
                    icon: Settings,
                    bg: 'bg-slate-50',
                    color: 'text-slate-500'
                };
        }
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const clearAll = () => {
        if (window.confirm('Clear all notifications?')) {
            setNotifications([]);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-10">
            {/* Header */}
            <div className="bg-white px-6 pt-14 pb-6 shadow-sm sticky top-0 z-20">
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 -ml-2 flex items-center justify-center text-slate-400 active:scale-90 transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-black">Notifications</h1>
                    <button
                        onClick={markAllRead}
                        className="p-2 text-brand hover:bg-brand/5 rounded-xl transition-all active:scale-95"
                    >
                        <CheckCheck size={20} />
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {notifications.length > 0 ? (
                    <div className="space-y-3">
                        {notifications.map((item) => {
                            const config = getIcon(item.type);
                            const Icon = config.icon;

                            return (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "w-full bg-white rounded-3xl p-5 flex items-start gap-4 shadow-sm border border-transparent transition-all active:scale-[0.99]",
                                        !item.isRead && "border-brand/10 bg-brand/[0.02]"
                                    )}
                                >
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", config.bg, config.color)}>
                                        <Icon size={24} />
                                    </div>

                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <p className={cn("text-base font-bold text-slate-900 truncate", !item.isRead && "text-brand")}>
                                                {item.title}
                                            </p>
                                            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                                {item.time}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    {!item.isRead && (
                                        <div className="w-2 h-2 rounded-full bg-brand mt-2" />
                                    )}
                                </div>
                            );
                        })}

                        <button
                            onClick={clearAll}
                            className="w-full py-4 text-center text-slate-400 text-sm font-bold active:scale-95 transition-all"
                        >
                            Clear All Notifications
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-slate-200/50 mb-8 border border-slate-50">
                            <Bell className="text-slate-200" size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">No Notifications</h3>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed">
                            You're all caught up! When you have new updates, they'll appear here.
                        </p>
                        <button
                            onClick={() => navigate('/home')}
                            className="mt-10 px-8 py-4 bg-brand text-white rounded-2xl font-bold shadow-lg shadow-brand/20 active:scale-95 transition-all"
                        >
                            Back to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
