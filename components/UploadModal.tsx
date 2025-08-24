
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { generateVirusTotalScanResult } from '../services/geminiService';
import type { VirusTotalScanResult, AppInfo, VirusTotalScanDetail } from '../types';
import { CloseIcon, DocumentMagnifyingGlassIcon, ArrowUpTrayIcon, ArrowPathIcon, PaperAirplaneIcon, ShieldCheckIcon, ShieldExclamationIcon } from './icons';
import Spinner from './Spinner';

interface UploadModalProps {
    onClose: () => void;
    onAppUploaded: (app: AppInfo) => void;
}

const ScanDetailRow: React.FC<{ detail: VirusTotalScanDetail }> = ({ detail }) => {
    const isClean = detail.result === 'clean';
    return (
        <li className={`flex items-center justify-between py-2 px-3 rounded-md ${isClean ? 'bg-gray-800/50' : 'bg-red-900/50'}`}>
            <span className="font-mono text-sm text-brand-text">{detail.engine}</span>
            {isClean ? (
                <span className="text-xs font-semibold text-green-400">Clean</span>
            ) : (
                <span className="text-xs font-semibold text-red-400 truncate">{detail.threat_name}</span>
            )}
        </li>
    );
};


const UploadModal: React.FC<UploadModalProps> = ({ onClose, onAppUploaded }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<VirusTotalScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setScanResult(null);
            setError(null);
            setIsSubmitted(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/octet-stream': ['.ipa'] },
        maxFiles: 1,
    });

    const handleScan = async () => {
        if (!file) return;

        setIsScanning(true);
        setScanResult(null);
        setError(null);
        try {
            const result = await generateVirusTotalScanResult(file.name);
            setScanResult(result);
        } catch (err) {
            console.error('Scan failed:', err);
            setError('The AI-powered scan failed. Please try again.');
        } finally {
            setIsScanning(false);
        }
    };
    
    const handleApprove = () => {
        if (!file) return;
        const newApp: AppInfo = {
            name: file.name.replace('.ipa', ''),
            version: '1.0.0 (Uploaded)',
            description: 'User uploaded application.',
            category: 'Utilities',
            iconUrl: 'https://picsum.photos/200',
            isUploaded: true,
        };
        onAppUploaded(newApp);
    }
    
    const handleSubmitForReview = () => {
        setIsSubmitted(true);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-brand-accent">Upload & Scan IPA</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {!scanResult && (
                         <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-brand-accent bg-brand-accent/10' : 'border-gray-600 hover:border-gray-500'}`}>
                            <input {...getInputProps()} />
                            <ArrowUpTrayIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                            {file ? (
                                <>
                                  <p className="text-brand-text">File selected: <span className="font-semibold text-brand-accent">{file.name}</span></p>
                                  <p className="text-xs text-gray-400">Drag a new file here, or click to re-select.</p>
                                </>
                            ) : (
                                <p className="text-brand-text-secondary">Drag & drop your .ipa file here, or click to select a file.</p>
                            )}
                        </div>
                    )}

                    {file && !scanResult && !isScanning && (
                        <div className="text-center mt-6">
                            <button onClick={handleScan} className="bg-brand-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-500 transition-all duration-300 flex items-center justify-center mx-auto space-x-2">
                                <DocumentMagnifyingGlassIcon className="h-5 w-5"/>
                                <span>Scan {file.name}</span>
                            </button>
                        </div>
                    )}
                    
                    {error && <p className="text-center mt-4 text-red-400 bg-red-900/30 p-3 rounded-lg">{error}</p>}
                    
                    {isScanning && (
                        <div className="text-center mt-6">
                            <Spinner />
                            <p className="mt-2 text-brand-accent animate-pulse">Scanning with AI... This may take a moment.</p>
                        </div>
                    )}
                    
                    {scanResult && (
                        <div className="space-y-4 mt-4">
                            <div className={`p-4 rounded-lg flex items-center space-x-4 ${scanResult.status === 'Clean' ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                                {scanResult.status === 'Clean' ? <ShieldCheckIcon className="h-10 w-10 text-brand-success"/> : <ShieldExclamationIcon className="h-10 w-10 text-red-400"/>}
                                <div>
                                    <h3 className={`text-lg font-bold ${scanResult.status === 'Clean' ? 'text-brand-success' : 'text-red-400'}`}>
                                        Scan Complete: {scanResult.status}
                                    </h3>
                                    <p className="text-sm text-brand-text-secondary">{scanResult.positives} / {scanResult.total} engines detected threats.</p>
                                </div>
                            </div>
                            
                             <div className="bg-brand-primary p-3 rounded-lg max-h-60 overflow-y-auto">
                                <ul className="space-y-1">
                                    {scanResult.details.map((detail) => (
                                        <ScanDetailRow key={detail.engine} detail={detail} />
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="flex items-center justify-center gap-4 pt-4">
                               <button onClick={() => { setFile(null); setScanResult(null); }} className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-all flex items-center space-x-2">
                                    <ArrowPathIcon className="h-5 w-5" />
                                    <span>Scan Another</span>
                                </button>

                                {scanResult.status === 'Clean' ? (
                                     <button onClick={handleApprove} className="bg-brand-success text-black font-bold py-2 px-6 rounded-lg hover:bg-green-300 transition-all flex items-center space-x-2">
                                        <ShieldCheckIcon className="h-5 w-5" />
                                        <span>Approve & Add</span>
                                    </button>
                                ) : (
                                    isSubmitted ? (
                                        <p className="text-brand-success">Submitted for review!</p>
                                    ) : (
                                        <button onClick={handleSubmitForReview} className="bg-brand-warning text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-300 transition-all flex items-center space-x-2">
                                            <PaperAirplaneIcon className="h-5 w-5" />
                                            <span>Submit for Review</span>
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
