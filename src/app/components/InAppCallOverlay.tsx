import React, { useState, useEffect } from 'react';
import { Phone, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

interface InAppCallOverlayProps {
    isOpen: boolean;
    onEndCall: () => void;
    driverName: string;
    driverImage: string;
}

export function InAppCallOverlay({ isOpen, onEndCall, driverName, driverImage }: InAppCallOverlayProps) {
    const [callStatus, setCallStatus] = useState<'calling' | 'connected'>('calling');
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);
    const [callDuration, setCallDuration] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setCallStatus('calling');
            setCallDuration(0);

            // Simulate connection after 3 seconds
            const connectTimer = setTimeout(() => {
                setCallStatus('connected');
            }, 3000);

            return () => clearTimeout(connectTimer);
        }
    }, [isOpen]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isOpen && callStatus === 'connected') {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, callStatus]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-sm flex flex-col items-center justify-between py-12 animate-in fade-in zoom-in-95 duration-300">

            {/* Driver Info */}
            <div className="flex flex-col items-center mt-12 animate-in slide-in-from-top-10 duration-700">
                <div className="relative mb-6">
                    <Avatar className="w-32 h-32 border-4 border-white/10 shadow-2xl ring-4 ring-brand/20">
                        <AvatarImage src={driverImage} className="object-cover" />
                        <AvatarFallback className="text-4xl bg-brand text-white">{driverName[0]}</AvatarFallback>
                    </Avatar>
                    {callStatus === 'calling' && (
                        <div className="absolute inset-0 rounded-full border-4 border-brand animate-ping opacity-20"></div>
                    )}
                </div>

                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{driverName}</h2>
                <p className="text-brand-light/80 text-lg font-medium animate-pulse">
                    {callStatus === 'calling' ? 'Calling...' : formatDuration(callDuration)}
                </p>
            </div>

            {/* Call Controls */}
            <div className="w-full max-w-xs grid grid-cols-3 gap-6 mb-12 animate-in slide-in-from-bottom-10 duration-700">

                {/* Mute Button */}
                <div className="flex flex-col items-center gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        className={`w-16 h-16 rounded-full border-none transition-all ${isMuted ? 'bg-white text-brand' : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                        onClick={() => setIsMuted(!isMuted)}
                    >
                        {isMuted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                    </Button>
                    <span className="text-xs text-white/60 font-medium">Mute</span>
                </div>

                {/* End Call Button */}
                <div className="flex flex-col items-center gap-2">
                    <Button
                        size="icon"
                        className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 border-4 border-red-500/30 text-white shadow-lg shadow-red-500/20 active:scale-95 transition-transform"
                        onClick={onEndCall}
                    >
                        <Phone className="w-8 h-8 rotate-[135deg]" />
                    </Button>
                    <span className="text-xs text-white/60 font-medium">End</span>
                </div>

                {/* Speaker Button */}
                <div className="flex flex-col items-center gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        className={`w-16 h-16 rounded-full border-none transition-all ${isSpeakerOn ? 'bg-white text-brand' : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                        onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    >
                        {isSpeakerOn ? <Volume2 className="w-7 h-7" /> : <VolumeX className="w-7 h-7" />}
                    </Button>
                    <span className="text-xs text-white/60 font-medium">Speaker</span>
                </div>

            </div>
        </div>
    );
}
