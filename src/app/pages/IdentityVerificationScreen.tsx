import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, UploadCloud, ChevronUp, FileImage, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState, useRef } from 'react';

export function IdentityVerificationScreen() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState("Driver's License");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const documents = [
        "Driver's License",
        "National Identity Number (NIN)",
        "International Passport",
        "Voter's Card"
    ];

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-brand pb-8">
            {/* Header */}
            <div className="bg-gray-50 px-6 pt-safe-top pb-4 flex items-center shrink-0 sticky top-0 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100"
                >
                    <ArrowLeft className="w-5 h-5 text-brand" />
                </button>
                <div className="flex-1 text-center mr-10">
                    <span className="text-xl font-bold text-brand">Become a Verified User</span>
                </div>
            </div>

            <div className="flex-1 px-6 pt-4">
                <p className="text-gray-600 mb-8 leading-relaxed">
                    For security, please upload a valid government issued ID to verify your account.
                </p>

                {/* Document Type Selector */}
                <div className="mb-6">
                    <label className="text-sm font-bold text-brand mb-2 block">
                        Select Document Type
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full h-14 bg-white rounded-xl px-4 flex items-center justify-between border border-transparent shadow-sm focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                        >
                            <span className="text-brand font-medium">{selectedDoc}</span>
                            {isOpen ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>

                        {isOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                {documents.map((doc) => (
                                    <button
                                        key={doc}
                                        onClick={() => {
                                            setSelectedDoc(doc);
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-brand font-medium transition-colors"
                                    >
                                        {doc}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload Area */}
                <div
                    onClick={handleUploadClick}
                    className={`bg-white rounded-2xl p-8 border-2 border-dashed ${selectedFile ? 'border-brand bg-brand/5' : 'border-gray-100 hover:border-brand/30'} flex flex-col items-center justify-center text-center h-64 transition-colors cursor-pointer group relative`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleFileChange}
                    />

                    {selectedFile ? (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm relative">
                                <FileImage className="w-8 h-8 text-brand" />
                                <button
                                    onClick={handleRemoveFile}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                            <h3 className="text-brand font-bold mb-1 truncate max-w-[250px]">{selectedFile.name}</h3>
                            <p className="text-brand/60 text-sm">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <span className="mt-4 text-xs font-semibold text-brand bg-white px-3 py-1.5 rounded-full shadow-sm">
                                Tap to change
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-brand transition-colors" />
                            </div>
                            <h3 className="text-brand font-bold mb-2">Upload Document</h3>
                            <p className="text-gray-400 text-sm max-w-[200px]">
                                Tap to select a file. JPG or PNG supported
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Submit Action */}
            <div className="px-6 mt-auto">
                <Button
                    onClick={() => navigate('/verification-pending')}
                    disabled={!selectedFile}
                    className={`w-full h-14 rounded-xl font-bold text-base shadow-lg transition-all ${selectedFile ? 'bg-brand hover:brightness-90 text-white shadow-brand/10' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
                >
                    Submit for Verification
                </Button>
            </div>
        </div>
    );
}
