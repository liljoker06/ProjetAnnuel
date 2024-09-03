import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import Drivebar from '../../Components/Drivebar/Drivebar';
import Dashboard_history from './Dashboard_history';
import Dashboard_status from './Dashboard_status';

import ProgressBar from "@ramonak/react-progress-bar";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import StorageIcon from '@mui/icons-material/Storage';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import BusinessIcon from '@mui/icons-material/Business';

import { getUserInfoByToken } from '../../Functions/CallApi/CallUser';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user_name, setUserName] = useState(null);
    const [user_email, setUserEmail] = useState(null);
    const [abonnement, setAbonnement] = useState(null);
    const [stockage, setStockage] = useState(null);
    const [stockageUsed, setStockageUsed] = useState(null);
    const [numberFiles, setNumberFiles] = useState(null);
    const [company, setCompany] = useState(null);
    const [userData, setUserData] = useState(null); // Ajout d'un état pour stocker les données utilisateur

    // Vérification de la connexion
    useEffect(() => {
        const token = Cookies.get('token');
        console.log('Token:', token);
        if (!token) {
            console.log('No token found, redirecting to login');
            navigate('/login');
        } else {
            getUserInfoByToken(token).then((data) => {
                console.log('User data:', data);
                const userInfo = data.userInfo;
                setUserName(`${userInfo.user_fname} ${userInfo.user_lname}`);
                setCompany(userInfo.user_company);
                setUserEmail(userInfo.user_email);
                setAbonnement(userInfo.user_subscription);
                setStockage(userInfo.user_storageTotal);
                setStockageUsed(userInfo.user_storageUsed);
                setNumberFiles(userInfo.user_files);
                setUserData(data); // Stocker les données utilisateur dans l'état

                if (!data) {
                    console.log('No user data found, redirecting to login');
                    // navigate('/login');
                }
            }).catch((error) => {
                console.error('Error fetching user data:', error);
                navigate('/login');
            });
        }
    }, [navigate]);

    const persentageUsed = (stockageUsed / stockage) * 100;

    ChartJS.register(ArcElement, Tooltip, Legend);

    const StorageChart = () => {
        const data = {
            labels: ['Libre', 'Utilisé'],
            datasets: [
                {
                    label: 'Stockage en Go',
                    data: [stockage - stockageUsed, stockageUsed],
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

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Drivebar />

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="grid grid-cols-3 gap-6">
                    {/* Up Next Section */}
                    <section className="col-span-2">
                        {/* Informations utilisateur */}
                        <div className="bg-white p-6 shadow rounded-lg mb-6">
                            <h2 className="text-lg font-bold text-gray-700">Bonjour, {user_name} - {company}</h2>
                            <h3 className="font-bold mb-4 text-gray-700">({user_email})</h3>
                            <p className="text-sm text-gray-600">Bienvenue sur votre tableau de bord.</p>
                            <pre>{JSON.stringify(userData, null, 2)}</pre> {/* Affichage des données utilisateur */}
                        </div>

                        {/* Abonnement */}
                        <div className="bg-white p-6 shadow rounded-lg mb-6">
                            <h2 className="text-lg font-bold mb-4 text-gray-700"><CardMembershipIcon /> Votre Abonnement</h2>
                            <div className="flex items-center mb-3 gap-20">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                        <p className="text-sm text-gray-600"><CardMembershipIcon /></p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-600">{abonnement}</h3>
                                        <p className="text-sm text-gray-600">{stockage} Go</p>
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

                        {/* Stockage */}
                        <div className="bg-white p-6 shadow rounded-lg mb-6">
                            <h2 className="text-lg font-bold text-gray-700"><StorageIcon /> Votre Stockage</h2>
                            <div className="flex items-center justify-between">
                                <div className="w-96 h-96"> {/* w-96 et h-96 correspondent à 400px */}
                                    <StorageChart />
                                </div>
                            </div>
                            <span className="text-sm text-gray-600">{stockageUsed} GB utilisés sur {stockage} GB</span>
                            <ProgressBar completed={persentageUsed} bgColor="#3b82f6" height="20px" />
                        </div>

                        {/* Statistique fichiers */}
                        <div className="bg-white p-6 shadow rounded-lg">
                            <h2 className="text-lg font-bold mb-4 text-gray-700"><FolderIcon /> Contenu de votre drive</h2>
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-500"><InsertDriveFileIcon /> Nombre de fichiers </h3>
                                <p className="text-sm text-gray-600">{numberFiles} dans votre espace</p>
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