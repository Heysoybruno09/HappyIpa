
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { AppInfo, ScanResult, User } from './types';
import { generateInitialApps, generateScanResult } from './services/geminiService';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import AppGrid from './components/AppGrid';
import AppDetailModal from './components/AppDetailModal';
import AuthModal from './components/AuthModal';
import UploadModal from './components/UploadModal';
import FloatingActionButton from './components/FloatingActionButton';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<AppInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  
  // New State
  const [user, setUser] = useState<User | null>(null);
  const [authModal, setAuthModal] = useState<{isOpen: boolean, mode: 'login' | 'signup'}>({ isOpen: false, mode: 'login' });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);


  useEffect(() => {
    const fetchApps = async () => {
      try {
        setIsLoading(true);
        const generatedApps = await generateInitialApps();
        setApps(generatedApps);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch initial apps:', err);
        setError('Failed to load app data. Please check your API key and try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleAppSelect = useCallback((app: AppInfo) => {
    setSelectedApp(app);
    setScanResult(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedApp(null);
  }, []);
  
  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleLogout = () => {
    setUser(null);
  };
  
  const handleAppUploaded = (newApp: AppInfo) => {
    setApps(prevApps => [newApp, ...prevApps]);
    setUploadModalOpen(false);
  };

  const handleScan = async () => {
    if (!selectedApp) return;

    setIsScanning(true);
    setScanResult(null);
    try {
      const result = await generateScanResult(selectedApp.name);
      setScanResult(result);
    } catch (err) {
      console.error('Failed to perform scan:', err);
      setScanResult({
        status: 'Error',
        details: [
            { check: 'API Communication', result: 'Failed', details: 'Could not retrieve scan results from the AI service.' }
        ]
      });
    } finally {
      setIsScanning(false);
    }
  };

  const filteredApps = useMemo(() => {
    return apps.filter(app =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [apps, searchTerm]);

  return (
    <div className="min-h-screen bg-brand-primary text-brand-text font-sans">
      <Header 
        user={user}
        onLoginClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
        onSignupClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
        onLogoutClick={handleLogout}
      />
      <main className="container mx-auto px-4 py-8">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : error ? (
            <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">{error}</div>
        ) : (
          <AppGrid apps={filteredApps} onAppSelect={handleAppSelect} />
        )}
      </main>
      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={handleCloseModal}
          onScan={handleScan}
          isScanning={isScanning}
          scanResult={scanResult}
        />
      )}
      {authModal.isOpen && (
        <AuthModal 
          mode={authModal.mode}
          onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
      {uploadModalOpen && (
        <UploadModal
            onClose={() => setUploadModalOpen(false)}
            onAppUploaded={handleAppUploaded}
        />
      )}
      {user && <FloatingActionButton onClick={() => setUploadModalOpen(true)} />}
    </div>
  );
};

export default App;
