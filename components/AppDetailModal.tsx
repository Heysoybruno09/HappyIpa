
import React, { useState, useEffect } from 'react';
import type { AppInfo, ScanResult, ScanDetail } from '../types';
import { CloseIcon, ShieldCheckIcon, ShieldExclamationIcon, DocumentMagnifyingGlassIcon, ArrowDownTrayIcon } from './icons';
import Spinner from './Spinner';

interface AppDetailModalProps {
  app: AppInfo;
  onClose: () => void;
  onScan: () => void;
  isScanning: boolean;
  scanResult: ScanResult | null;
}

const scanSteps = [
    "Initializing scan engine...",
    "Verifying IPA signature...",
    "Analyzing app permissions...",
    "Scanning for known malware...",
    "Performing heuristic analysis...",
    "Checking for network vulnerabilities...",
    "Generating final report...",
];

const ScanStatusIndicator: React.FC<{ status: 'Clean' | 'Warning' | 'Error' }> = ({ status }) => {
    const statusConfig = {
        Clean: {
            icon: <ShieldCheckIcon className="h-8 w-8 text-brand-success" />,
            text: "Status: Clean",
            textColor: "text-brand-success",
        },
        Warning: {
            icon: <ShieldExclamationIcon className="h-8 w-8 text-brand-warning" />,
            text: "Status: Warning",
            textColor: "text-brand-warning",
        },
        Error: {
            icon: <ShieldExclamationIcon className="h-8 w-8 text-red-500" />,
            text: "Status: Error",
            textColor: "text-red-500",
        },
    };
    const config = statusConfig[status];
    return (
        <div className="flex items-center space-x-3 bg-brand-primary p-4 rounded-lg">
            {config.icon}
            <span className={`text-xl font-bold ${config.textColor}`}>{config.text}</span>
        </div>
    );
};

const ScanDetailRow: React.FC<{ detail: ScanDetail }> = ({ detail }) => {
    const resultConfig = {
        Passed: { icon: <ShieldCheckIcon className="h-5 w-5 text-green-400 flex-shrink-0" /> },
        Warning: { icon: <ShieldExclamationIcon className="h-5 w-5 text-yellow-400 flex-shrink-0" /> },
        Failed: { icon: <ShieldExclamationIcon className="h-5 w-5 text-red-500 flex-shrink-0" /> },
        'Not applicable': { icon: <div className="h-5 w-5 text-gray-500 flex-shrink-0">-</div> },
    };
    
    return (
        <li className="flex items-start space-x-3 py-2 border-b border-gray-800 last:border-b-0">
            {resultConfig[detail.result].icon}
            <div>
                <p className="font-semibold text-brand-text">{detail.check}: <span className="font-normal text-brand-text-secondary">{detail.result}</span></p>
                <p className="text-sm text-gray-400">{detail.details}</p>
            </div>
        </li>
    );
};


const AppDetailModal: React.FC<AppDetailModalProps> = ({ app, onClose, onScan, isScanning, scanResult }) => {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
        setScanProgress(0);
        interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= scanSteps.length -1) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 700);
    }
    return () => clearInterval(interval);
  }, [isScanning]);
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-brand-secondary rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform scale-95 hover:scale-100 transition-transform duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-brand-accent">{app.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                <img src={`${app.iconUrl}?grayscale&random=${app.name}`} alt={app.name} className="w-28 h-28 rounded-2xl border-2 border-gray-600 flex-shrink-0" />
                <div className="text-sm text-brand-text-secondary">
                    <p className="mb-2"><strong className="text-brand-text">Version:</strong> {app.version}</p>
                    <p className="mb-2"><strong className="text-brand-text">Category:</strong> {app.category}</p>
                    <p>{app.description}</p>
                </div>
            </div>

            <div className="bg-brand-primary p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-white">Security Scan</h3>
                {!isScanning && !scanResult && (
                    <div className="text-center">
                        <p className="mb-4 text-brand-text-secondary">Run a comprehensive, AI-powered security scan on the IPA file before downloading.</p>
                        <button onClick={onScan} className="bg-brand-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-500 transition-all duration-300 flex items-center justify-center mx-auto space-x-2">
                           <DocumentMagnifyingGlassIcon className="h-5 w-5"/>
                           <span>Scan IPA</span>
                        </button>
                    </div>
                )}

                {isScanning && (
                    <div>
                        <div className="flex justify-center items-center space-x-3 mb-2">
                           <Spinner/>
                           <p className="text-brand-accent animate-pulse">{scanSteps[scanProgress]}</p>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-brand-accent h-2.5 rounded-full transition-all duration-500" style={{ width: `${((scanProgress + 1) / scanSteps.length) * 100}%` }}></div>
                        </div>
                    </div>
                )}

                {scanResult && (
                    <div className="space-y-4">
                        <ScanStatusIndicator status={scanResult.status} />
                        <div>
                            <h4 className="font-semibold mb-2 text-brand-text">Scan Details:</h4>
                            <ul className="space-y-2">
                                {scanResult.details.map((detail, index) => (
                                    <ScanDetailRow key={index} detail={detail} />
                                ))}
                            </ul>
                        </div>
                         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <button onClick={onScan} className="w-full sm:w-auto bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-all duration-300 flex items-center justify-center space-x-2">
                                <DocumentMagnifyingGlassIcon className="h-5 w-5"/>
                                <span>Scan Again</span>
                            </button>
                             <button className="w-full sm:w-auto bg-brand-success text-black font-bold py-2 px-6 rounded-lg hover:bg-green-300 transition-all duration-300 flex items-center justify-center space-x-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                                disabled={scanResult.status !== 'Clean'}>
                               <ArrowDownTrayIcon className="h-5 w-5"/>
                               <span>Download IPA</span>
                            </button>
                        </div>
                        {scanResult.status !== 'Clean' && <p className="text-xs text-center text-brand-warning mt-2">Download is disabled for apps with warnings.</p>}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetailModal;
