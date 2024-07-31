import React from 'react';
import Drivebar from '../../Components/Drivebar/Drivebar';
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
    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Drivebar />
            <main className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Mes Fichiers</h2>
                <div className="flex items-center mb-4">

                    <input type="text" placeholder="Rechercher un fichier" className="w-full p-2 border rounded-lg shadow focus:outline-none focus:ring focus:border-blue-300 bg-white text-gray-700" />
                    <button onClick={() => console.log('Trier les fichiers')} className="ml-2 p-2 border rounded-lg shadow bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 flex items-center">
                        <SortIcon /> Trier
                    </button>
                    <button onClick={() => console.log('Filtrer les fichiers')} className="ml-2 p-2 border rounded-lg shadow bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 flex items-center">
                        <FilterListIcon /> Filtrer
                    </button>
                </div>

                <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {files.map((file) => (
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