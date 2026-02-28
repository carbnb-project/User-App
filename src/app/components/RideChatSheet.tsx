import React, { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, Phone, MoreVertical, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'driver';
    time: string;
}

interface RideChatSheetProps {
    isOpen: boolean;
    onClose: () => void;
    driverName: string;
    driverImage: string;
    onCall?: () => void;
}

export function RideChatSheet({ isOpen, onClose, driverName, driverImage, onCall }: RideChatSheetProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "I'm on my way!", sender: 'driver', time: '12:42 PM' },
        { id: '2', text: "Okay, I'm waiting at the entrance.", sender: 'user', time: '12:43 PM' },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const message: Message = {
            id: Date.now().toString(),
            text: newMessage,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, message]);
        setNewMessage('');

        // Simulate driver reply
        setTimeout(() => {
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                text: "Got it! See you soon.",
                sender: 'driver',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-[32px] flex flex-col bg-white [&>button]:hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-[32px]">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-gray-100">
                            <AvatarImage src={driverImage} className="object-cover" />
                            <AvatarFallback>{driverName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-brand text-base">{driverName}</h3>
                            <p className="text-xs text-green-600 font-medium">Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-brand hover:bg-gray-50 active:scale-95 transition-all"
                            onClick={onCall}
                        >
                            <Phone className="w-5 h-5" />
                        </Button>
                        <SheetClose className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </SheetClose>
                    </div>
                </div>

                {/* Messages Options */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    <div className="text-center">
                        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Today, 12:42 PM</span>
                    </div>

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] ${msg.sender === 'user'
                                    ? 'bg-brand text-white rounded-tr-sm'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm shadow-sm'
                                    }`}
                            >
                                <p>{msg.text}</p>
                                <span
                                    className={`text-[10px] mt-1 block text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                                        }`}
                                >
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 pb-8">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="flex items-center gap-3"
                    >
                        <div className="flex-1 relative">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="pr-12 h-12 rounded-full border-gray-200 bg-gray-50 focus-visible:ring-brand"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1 text-gray-400 hover:text-brand"
                            >
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="w-12 h-12 rounded-full bg-brand hover:bg-brand/90 text-white shrink-0 shadow-lg shadow-brand/20"
                        >
                            <Send className="w-5 h-5 ml-0.5" />
                        </Button>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
}
