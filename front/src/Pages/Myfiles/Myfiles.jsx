import React, { useState } from 'react';
import Drivebar from '../../Components/Drivebar/Drivebar';
import FilterZone from './FilterZone';
import SortZone from './SortZone';

import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import SlideshowIcon from '@mui/icons-material/Slideshow';

import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';

const files = [
    { name: 'Document 1', type: 'doc', updatedAt: '2024-07-29' },
    { name: 'Spreadsheet 1', type: 'sheet', updatedAt: '2024-07-28' },
    { name: 'Presentation 1', type: 'slides', updatedAt: '2024-07-27' },
    { name: 'Document 2', type: 'doc', updatedAt: '2024-07-26' },
    { name: 'Spreadsheet 2', type: 'sheet', updatedAt: '2024-07-25' },
    { name: 'Presentation 2', type: 'slides', updatedAt: '2024-07-24' },
];

const fileIcons = {
    doc: <DescriptionIcon className="text-gray-600 text-4xl" />,
    sheet: <TableChartIcon className="text-gray-600 text-4xl" />,
    slides: <SlideshowIcon className="text-gray-600 text-4xl" />,
};

export default function Myfiles() {
    const [isFilterZoneOpen, setFilterZoneIsOpen] = useState(false);
    const [isSortZoneOpen, setSortZoneIsOpen] = useState(false);

    const [filters, setFilters] = useState({ doc: false, sheet: false, slides: false });
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const handleFilterChange = (type) => {
        setFilters(prevFilters => ({ ...prevFilters, [type]: !prevFilters[type] }));
    };

    const handleSortChange = (field, order) => {
        setSortField(field);
        setSortOrder(order);
    };

    const applyFilters = (files) => {
        return files.filter(file => {
            if (filters.doc && file.type !== 'doc') return false;
            if (filters.sheet && file.type !== 'sheet') return false;
            if (filters.slides && file.type !== 'slides') return false;
            return true;
        });
    };

    const applySort = (files) => {
        return files.sort((a, b) => {
            if (!sortField) return 0;
            if (sortOrder === 'asc') {
                return a[sortField] > b[sortField] ? 1 : -1;
            } else {
                return a[sortField] < b[sortField] ? 1 : -1;
            }
        });
    };

    const filteredFiles = applySort(applyFilters(files));

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Drivebar />
            <main className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Mes Fichiers</h2>
                <div className="flex items-center mb-4">
                    <input type="text" placeholder="Rechercher un fichier" className="w-full p-2 border rounded-lg shadow focus:outline-none focus:ring focus:border-blue-300 bg-white text-gray-700" />
                    <button onClick={() => setSortZoneIsOpen(prevState => !prevState)} className="ml-2 p-2 border rounded-lg shadow bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 flex items-center">
                        <SortIcon /> Trier
                    </button>
                    <button onClick={() => setFilterZoneIsOpen(prevState => !prevState)} className="ml-2 p-2 border rounded-lg shadow bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 flex items-center">
                        <FilterListIcon /> Filtrer
                    </button>
                </div>
                <FilterZone isOpen={isFilterZoneOpen} onClose={() => setFilterZoneIsOpen(false)} handleFilterChange={handleFilterChange} filters={filters} />
                <SortZone isOpen={isSortZoneOpen} onClose={() => setSortZoneIsOpen(false)} handleSortChange={handleSortChange} sortField={sortField} sortOrder={sortOrder} />
                <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredFiles.map((file) => (
                        <div key={file.name} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                {fileIcons[file.type]}
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-600">{file.name}</h3>
                                    <p className="text-sm text-gray-600">Modifié le {file.updatedAt}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
