
import React from 'react';
import type { AppInfo } from '../types';
import AppCard from './AppCard';

interface AppGridProps {
  apps: AppInfo[];
  onAppSelect: (app: AppInfo) => void;
}

const AppGrid: React.FC<AppGridProps> = ({ apps, onAppSelect }) => {
  if (apps.length === 0) {
    return <div className="text-center text-brand-text-secondary">No apps found.</div>;
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {apps.map((app, index) => (
        <AppCard key={`${app.name}-${index}`} app={app} onSelect={() => onAppSelect(app)} />
      ))}
    </div>
  );
};

export default AppGrid;
