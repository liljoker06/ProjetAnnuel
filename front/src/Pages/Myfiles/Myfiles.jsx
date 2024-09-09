import React, { useState, useEffect, useCallback} from 'react';
import { useDropzone } from 'react-dropzone';
import { checkStorageLimit, uploadFile, getUserFiles} from '../../Functions/CallApi/CallStorage'; 
import { getUserInfoByToken } from '../../Functions/CallApi/CallUser'; 
import Cookies from 'js-cookie';

import './Myfiles.css';
import Drivebar from '../../Components/Drivebar/Drivebar';
import FilterZone from './FilterZone';
import SortZone from './SortZone';

import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import ImageIcon from '@mui/icons-material/Image';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import UploadIcon from '@mui/icons-material/Upload';

const fileIcons = {
    doc: <DescriptionIcon className="text-gray-600 text-4xl" />,
    sheet: <TableChartIcon className="text-gray-600 text-4xl" />,
    slides: <SlideshowIcon className="text-gray-600 text-4xl" />,
    image: <ImageIcon className="text-gray-600 text-4xl" />,
};

export default function Myfiles() {
    const [isFilterZoneOpen, setFilterZoneIsOpen] = useState(false);
    const [isSortZoneOpen, setSortZoneIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [files, setFiles] = useState([]); // Initialiser les fichiers vides (données non statiques)

    const [filters, setFilters] = useState({ doc: false, sheet: false, slides: false, image: false });
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [userId, setUserId] = useState(null); // Stocker l'ID utilisateur

    // Récupérer l'ID de l'utilisateur à partir du token et charger les fichiers dynamiquement
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            getUserInfoByToken(token)
                .then((data) => {
                    if (data && data.userInfo) {
                        setUserId(data.userInfo.user_id);
                        getUserFiles(data.userInfo.user_id); 
                    }
                })
                .catch((error) => {
                    console.error('Erreur lors de la récupération des informations utilisateur:', error);
                });
        }
    }, []);


    // Gestion de l'upload des fichiers
    const handleDrop = useCallback(async (acceptedFiles) => {
        // Vérifier si l'utilisateur est authentifié
        if (!userId) {
            alert("Utilisateur non authentifié");
            return;
        }
    
        const file = acceptedFiles[0]; 

        console.log('voici le fichier',file);
    
        if (!file) {
            alert("Aucun fichier sélectionné");
            return;
        }
    
        try {
            // Vérifier la limite de stockage
            await checkStorageLimit(file.size);
    
            // Envoi du fichier
            await uploadFile(file); 
    
            alert('Fichier téléchargé avec succès');
    
            // Récupérer les fichiers de l'utilisateur après l'upload
            const updatedFiles = await getUserFiles(userId);
            setFiles(updatedFiles);  // Mise à jour des fichiers après upload
        } catch (error) {
            alert(`Erreur: ${error.message}`);
        }
    
        console.log(acceptedFiles);
    }, [userId, checkStorageLimit, uploadFile, getUserFiles]);
    

    
    

    const handleFilterChange = (type) => {
        setFilters(prevFilters => ({ ...prevFilters, [type]: !prevFilters[type] }));
    };

    const handleSortChange = (field, order) => {
        setSortField(field);
        setSortOrder(order);
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    const applyFilters = (files) => {
        const noFiltersApplied = !filters.doc && !filters.sheet && !filters.slides && !filters.image;
        if (noFiltersApplied) {
            return files;
        }
        return files.filter(file => {
            if (filters.doc && file.type === 'doc') return true;
            if (filters.sheet && file.type === 'sheet') return true;
            if (filters.slides && file.type === 'slides') return true;
            if (filters.image && file.type === 'image') return true;
            return false;
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

    const searchFiles = (files, query) => {
        return files.filter(file => file.name.toLowerCase().includes(query.toLowerCase()));
    };

    const resetFiltersAndSort = () => {
        setFilters({ doc: false, sheet: false, slides: false, image: false });
        setSortField('');
        setSortOrder('');
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop });

    // Mettre à jour les fichiers filtrés et triés dynamiquement lorsque la recherche, les filtres ou le tri changent
    useEffect(() => {
        let updatedFiles = searchFiles(files, searchQuery);
        updatedFiles = applyFilters(updatedFiles);
        updatedFiles = applySort(updatedFiles);
        setFilteredFiles(updatedFiles);
    }, [files, filters, sortField, sortOrder, searchQuery]);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Drivebar />

            <main className="flex-1 p-6">

                {/* Zone de recherche */}
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Mes Fichiers</h2>
                <div className="flex items-center mb-4">
                    <input onChange={handleSearch} type="text" placeholder="Rechercher un fichier" className="w-full p-2 border rounded-lg shadow focus:outline-none focus:ring focus:border-blue-300 bg-white text-gray-700" />
                    <button onClick={() => setSortZoneIsOpen(prevState => !prevState)} className="ml-2 p-2 border rounded-lg shadow bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 flex items-center">
                        <SortIcon /> Trier
                    </button>
                    <button onClick={() => setFilterZoneIsOpen(prevState => !prevState)} className="ml-2 p-2 border rounded-lg shadow bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 flex items-center">
                        <FilterListIcon /> Filtrer
                    </button>
                    {   // Montrer le bouton de réinitialisation si un filtre ou un tri est appliqué
                        (filters.doc || filters.sheet || filters.slides || filters.image || sortField || sortOrder) &&
                        <button onClick={resetFiltersAndSort} className="ml-2 p-2 border rounded-lg shadow bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300">Réinitialiser</button>
                    }
                </div>
                <FilterZone isOpen={isFilterZoneOpen} onClose={() => setFilterZoneIsOpen(false)} handleFilterChange={handleFilterChange} filters={filters} />
                <SortZone isOpen={isSortZoneOpen} onClose={() => setSortZoneIsOpen(false)} handleSortChange={handleSortChange} sortField={sortField} sortOrder={sortOrder} />
                <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

                {/* Zone de dépôt de fichiers */}
                <div 
                    {...getRootProps()} 
                    className={`p-10 border-2 border-dashed border-gray-400 rounded-lg text-center mb-4 text-gray-700 ${isDragActive ? 'drag-active' : 'bg-white'}`}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p><UploadIcon /> Déposez les fichiers ici...</p>
                    ) : (
                        <p><UploadIcon /> Glissez et déposez des fichiers ici, ou cliquez pour sélectionner des fichiers</p>
                    )}
                </div>

                {/* Liste des fichiers */}
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
