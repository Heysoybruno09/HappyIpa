
import React from 'react';
import type { AppInfo } from '../types';

interface AppCardProps {
  app: AppInfo;
  onSelect: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onSelect }) => {
  return (
    <div 
        onClick={onSelect}
        className="relative bg-brand-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-brand-accent/30 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center p-4 text-center group"
    >
      {app.isUploaded && (
          <div className="absolute top-2 right-2 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded-full">
              Uploaded
          </div>
      )}
      <img 
        src={`${app.iconUrl}?grayscale&random=${app.name}`} 
        alt={`${app.name} icon`} 
        className="w-24 h-24 rounded-2xl mb-4 border-2 border-gray-700 group-hover:border-brand-accent transition-colors"
      />
      <h3 className="text-md font-semibold text-brand-text truncate w-full">{app.name}</h3>
      <p className="text-xs text-brand-text-secondary">{app.category}</p>
    </div>
  );
};

export default AppCard;
