import React from 'react'
import Drivebar from '../../Components/Drivebar/Drivebar'
import Dashboard_history from './Dashboard_history'
import Dashboard_status from './Dashboard_status'

import ProgressBar from "@ramonak/react-progress-bar";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import StorageIcon from '@mui/icons-material/Storage';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import BusinessIcon from '@mui/icons-material/Business';



export default function Dashboard() {
    ChartJS.register(ArcElement, Tooltip, Legend);

    const StorageChart = () => {
        const data = {
            labels: ['Libre', 'Utilisé'],
            datasets: [
                {
                    label: 'Stockage en Go',
                    data: [5, 10],
                    backgroundColor: ['#36A2EB', '#FF6384'],
                },
            ],
        };

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: false,
                },
            },
        };

        return <Pie data={data} options={options} />;
    };

    const abonnement = "Pro";
    const stockage = "15 GB";
    const user_name = "John Doe";
    const company = "Vitruve Cloud";


    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Drivebar />

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="grid grid-cols-3 gap-6">
                    {/* Up Next Section */}
                    <section className="col-span-2">

                        <div className="bg-white p-6 shadow rounded-lg mb-6">
                            <h2 className="text-lg font-bold mb-4 text-gray-700">Bonjour, {user_name}</h2>
                            <p className="text-sm text-gray-600">Bienvue sur votre tableau de bord.</p>
                        </div>

                        <div className="bg-white p-6 shadow rounded-lg mb-6">
                            <h2 className="text-lg font-bold mb-4 text-gray-700"><CardMembershipIcon /> Votre Abonnement</h2>
                            <div className="flex items-center mb-3 gap-20">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                        <p className="text-sm text-gray-600"><CardMembershipIcon /></p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-600">{abonnement}</h3>
                                        <p className="text-sm text-gray-600">{stockage}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                        <p className="text-sm text-gray-600"><BusinessIcon /></p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-600">{company}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 shadow rounded-lg mb-6">
                            <h2 className="text-lg font-bold text-gray-700"><StorageIcon /> Votre Stockage</h2>
                            <div className="flex items-center justify-between">
                                <StorageChart />
                            </div>
                            <span className="text-sm text-gray-600">10 GB utilisés sur 15 GB</span>
                            <ProgressBar completed={66} bgColor="#3b82f6" height="20px" />
                        </div>

                        {/* Statistique fichiers */}
                        <div className="bg-white p-6 shadow rounded-lg">
                            <h2 className="text-lg font-bold mb-4 text-gray-700"><FolderIcon /> Contenu de votre drive</h2>
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-500"><InsertDriveFileIcon /> Nombre de fichiers </h3>
                                <p className="text-sm text-gray-600">3 recommended links</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold">Team Planning</h3>
                                <p className="text-sm text-gray-600">4 recommended links</p>
                            </div>
                        </div>
                    </section>

                    {/* Historique */}
                    <section className="col-span-1">
                        <Dashboard_history />

                        <Dashboard_status />
                    </section>

                </div>
            </main>
        </div>
    );
}
