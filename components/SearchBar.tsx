
import React from 'react';
import { SearchIcon } from './icons';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-brand-text-secondary" />
        </div>
        <input
          type="text"
          placeholder="Search for apps or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-brand-secondary border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
};

export default SearchBar;
