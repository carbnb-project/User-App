import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Hourglass } from 'lucide-react';
import { Button } from '../components/ui/button';

export function VerificationPendingScreen() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-brand pb-8">
            {/* Header */}
            <div className="bg-gray-50 px-6 pt-safe-top pb-4 flex items-center shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100"
                >
                    <ArrowLeft className="w-5 h-5 text-brand" />
                </button>
                <div className="flex-1 text-center mr-10">
                    <span className="text-xl font-bold text-brand">Identity Verification</span>
                </div>
            </div>

            <div className="flex-1 px-6 flex flex-col items-center justify-center text-center">
                <div className="bg-white rounded-3xl p-8 shadow-sm w-full max-w-sm flex flex-col items-center">
                    <div className="w-16 h-16 mb-6">
                        <Hourglass className="w-full h-full text-brand" strokeWidth={1.5} />
                    </div>

                    <h2 className="text-lg font-bold text-brand mb-4">
                        Verification in Progress
                    </h2>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        Thanks for submitting your document. We're now verifying your identity and will notify you as soon as it's complete. This usually takes a few minutes.
                    </p>

                    <Button
                        onClick={() => navigate('/home')}
                        className="w-full bg-brand hover:brightness-90 text-white h-12 rounded-xl font-bold text-sm shadow-md"
                    >
                        Go to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
