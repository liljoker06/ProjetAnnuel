import React from 'react'
import { Link, NavLink } from 'react-router-dom'

import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import Setting from '@mui/icons-material/Settings';
import Account from '@mui/icons-material/AccountCircle';

export default function Drivebar() {
    return (
        <aside className="w-64 bg-white p-6 shadow">
            <div className="mb-8 flex flex-col items-center">
                <NavLink to="/"><div className="logo mr-3 h-10 w-10"></div></NavLink>
                <h1 className="text-2xl font-bold text-gray-700">Vitruve Cloud</h1>
            </div>
            <nav>
                <ul>
                    <li className="mb-4">
                        <Link to="/dashboard" className="flex items-center text-gray-700 hover:text-black">
                            <DashboardIcon />
                            <span className="ml-2">Dashboard</span>
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link to="/myfiles" className="flex items-center text-gray-700 hover:text-black">
                            <FolderIcon />
                            <span className="ml-2">Mes Fichiers</span>
                        </Link>
                    </li>
                    <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />
                    <li className="mb-4">
                        <Link to="#" className="flex items-center text-gray-700 hover:text-black">
                            <Setting />
                            <span className="ml-2">Paramètres</span>
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link to="#" className="flex items-center text-gray-700 hover:text-black">
                            <Account />
                            <span className="ml-2">Mon Compte</span>
                        </Link>
                    </li>
                    
                </ul>
            </nav>
        </aside>
    )
}
