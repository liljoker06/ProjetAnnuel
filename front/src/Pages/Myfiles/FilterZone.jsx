import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './SortFilterZone.css';

export default function FilterZone({ isOpen, onClose, handleFilterChange, filters }) {
  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="filter-zone"
      unmountOnExit
    >
      <div className="bg-white p-4 rounded-lg shadow mb-4 text-gray-500">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Filtrer par type de fichier</h3>
        <div className="flex flex-col">
          <label className="flex items-center mb-2">
            <input type="checkbox" className="mr-2 custom-checkbox" checked={filters.doc} onChange={() => handleFilterChange('doc')} /> Documents
          </label>
          <label className="flex items-center mb-2">
            <input type="checkbox" className="mr-2 custom-checkbox" checked={filters.sheet} onChange={() => handleFilterChange('sheet')} /> Tableurs
          </label>
          <label className="flex items-center mb-2">
            <input type="checkbox" className="mr-2 custom-checkbox" checked={filters.slides} onChange={() => handleFilterChange('slides')} /> Présentations
          </label>
        </div>
      </div>
    </CSSTransition>
  );
}
