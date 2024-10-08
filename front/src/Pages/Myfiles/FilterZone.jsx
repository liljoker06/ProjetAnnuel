import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './SortFilterZone.css';

import FilterListIcon from '@mui/icons-material/FilterList';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import ImageIcon from '@mui/icons-material/Image';

export default function FilterZone({ isOpen, onClose, handleFilterChange, filters }) {
    return (
        <CSSTransition
            in={isOpen}
            timeout={300}
            classNames="filter-zone"
            unmountOnExit
        >
            <div className="bg-white p-4 rounded-lg shadow mb-4 text-gray-500">
                <h3 className="text-lg font-semibold mb-4 text-gray-700"><FilterListIcon /> Filtrer par type de fichier</h3>
                <div className="flex flex-col">
                    <label className="flex items-center mb-2">
                        <input type="checkbox" className="mr-2 custom-checkbox" checked={filters.doc} onChange={() => handleFilterChange('doc')} /><DescriptionIcon /> - Documents
                    </label>
                    <label className="flex items-center mb-2">
                        <input type="checkbox" className="mr-2 custom-checkbox" checked={filters.sheet} onChange={() => handleFilterChange('sheet')} /><TableChartIcon /> - Tableau
                    </label>
                    <label className="flex items-center mb-2">
                        <input type="checkbox" className="mr-2 custom-checkbox" checked={filters.slides} onChange={() => handleFilterChange('slides')} /><SlideshowIcon /> - Présentations
                    </label>
                    <label className="flex items-center mb-2">
                        <input type="checkbox" className="mr-2 custom-checkbox" checked={filters.image} onChange={() => handleFilterChange('image')} /><ImageIcon /> - Images
                    </label>
                </div>
            </div>
        </CSSTransition>
    );
}
