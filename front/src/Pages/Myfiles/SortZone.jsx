import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './SortFilterZone.css';

import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function SortZone({ isOpen, onClose, handleSortChange, sortField, sortOrder }) {
    return (
        <CSSTransition
            in={isOpen}
            timeout={300}
            classNames="filter-zone"
            unmountOnExit
        >
            <div className="bg-white p-4 rounded-lg shadow mb-4 text-gray-500">
                <h3 className="text-lg font-semibold mb-4 text-gray-700"><SortIcon /> Trier par</h3>
                <div className="flex flex-row gap-20">
                    <div className="flex flex-col">
                        <label className="flex items-center mb-2">
                            <input type="radio" name="sort" className="mr-2 custom-radio" checked={sortField === 'name'} onChange={() => handleSortChange('name', sortOrder)} /> Nom
                        </label>
                        <label className="flex items-center mb-2">
                            <input type="radio" name="sort" className="mr-2 custom-radio" checked={sortField === 'updatedAt'} onChange={() => handleSortChange('updatedAt', sortOrder)} /> Date de modification
                        </label>
                        <label className="flex items-center mb-2">
                            <input type="radio" name="sort" className="mr-2 custom-radio" checked={sortField === 'type'} onChange={() => handleSortChange('type', sortOrder)} /> Type de fichier
                        </label>
                    </div>

                    <div className="flex flex-col">
                        <label className="flex items-center mb-2">
                            <input type="radio" name="by" className="mr-2 custom-radio" checked={sortOrder === 'asc'} onChange={() => handleSortChange(sortField, 'asc')} /> Croissant <ArrowUpwardIcon />
                        </label>
                        <label className="flex items-center mb-2">
                            <input type="radio" name="by" className="mr-2 custom-radio" checked={sortOrder === 'desc'} onChange={() => handleSortChange(sortField, 'desc')} /> Décroissant <ArrowDownwardIcon />
                        </label>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}
