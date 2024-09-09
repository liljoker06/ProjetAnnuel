import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [files, setFiles] = useState([]);
    const [userCompanies, setUserCompanies] = useState([]);

    const [showUsers, setShowUsers] = useState(false);
    const [showCompanies, setShowCompanies] = useState(false);
    const [showSubscriptions, setShowSubscriptions] = useState(false);

    useEffect(() => {
        // Récupérer les utilisateurs
        axios.get('http://localhost:5555/api/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            });

        // Récupérer les entreprises
        axios.get('http://localhost:5555/api/companies')
            .then(response => {
                setCompanies(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des entreprises:', error);
            });

        // Récupérer les abonnements
        axios.get('http://localhost:5555/api/subscriptions')
            .then(response => {
                setSubscriptions(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des abonnements:', error);
            });

        // Récupérer les fichiers
        axios.get('http://localhost:5555/api/files')
            .then(response => {
                setFiles(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des fichiers:', error);
            });

        // Récupérer la liaison UserCompany
        axios.get('http://localhost:5555/api/userCompanies')
            .then(response => {
                setUserCompanies(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de la liaison UserCompany:', error);
            });
    }, []);

    const deleteUser = (userId) => {
        axios.delete(`http://localhost:5555/api/users/deleteUser/${userId}`)
            .then(() => {
                setUsers(users.filter(user => user.user_id !== userId));
            })
            .catch(error => {
                console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            });
    };

    const getCompanyForUser = (userId) => {
        const userCompany = userCompanies.find(uc => uc.user_id === userId);
        if (userCompany) {
            const company = companies.find(comp => comp.comp_id === userCompany.comp_id);
            return company;
        }
        return null;
    };

    const getFilesForUser = (userId) => {
        const userFiles = files.filter(file => file.file_userid === userId);
        return userFiles;
    };

    const getTotalFileCount = (userId) => {
        return files.filter(file => file.file_userid === userId).length;
    };

    const getTotalUsers = () => {
        return users.length;
    };

    const getTotalCompanies = () => {
        return companies.length;
    };

    const getTotalSubscriptions = () => {
        return subscriptions.length;
    };

    const toggleUserList = () => {
        setShowUsers(!showUsers);
    };

    const toggleCompanyList = () => {
        setShowCompanies(!showCompanies);
    };

    const toggleSubscriptionList = () => {
        setShowSubscriptions(!showSubscriptions);
    };


    const getUsedStorage = (userId) => {
        return files
            .filter(file => file.file_userid === userId)
            .reduce((total, file) => total + file.file_size, 0);
    };

    const getTotalStorage = (userSubId) => {
        const subscription = subscriptions.find(subs => subs.subs_id === userSubId);
        return subscription ? subscription.subs_stora : 0;
    };

    return (
        <div className="p-4 bg-gray-200 min-h-screen">
            <div className="mb-4 mt-20">
                <button 
                    onClick={toggleUserList} 
                    className="w-full bg-white text-black py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
                >
                    Liste des utilisateurs (total: {getTotalUsers()})
                </button>
            </div>
            {showUsers && (
                <ul className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
                    {users.map(user => {
                        const usedStorage = getUsedStorage(user.user_id) + 1;
                        const totalStorage = getTotalStorage(user.user_subid);
                        const percentageUsed = totalStorage > 0 ? (usedStorage / totalStorage) * 100 : 0;

                        const chartData = {
                            labels: ['Utilisé', 'Libre'],
                            datasets: [{
                                data: [usedStorage, totalStorage - usedStorage],
                                backgroundColor: ['#FF6384', '#36A2EB'],
                                hoverBackgroundColor: ['#FF6384', '#36A2EB'],
                            }],
                        };

                        const userCompany = getCompanyForUser(user.user_id);
                        const userFiles = getFilesForUser(user.user_id);
                        const totalFileCount = getTotalFileCount(user.user_id);

                        return (
                            <li key={user.user_id} className="mb-4 bg-white p-4 rounded-lg shadow-lg">
                                <h2 className="text-lg font-bold mb-4 text-gray-900">Information utilisateur</h2>
                                <div className="text-md font-bold mb-4 text-gray-500">
                                    {user.user_id} - {user.user_fname} - {user.user_lname} - {user.user_email} - {user.user_addre} - {user.user_posta} - {user.user_city} - {user.user_phone} - {user.user_role} - {user.user_date}
                                </div>

                                {userCompany && (
                                    <div className="mb-4">
                                        <h3 className="text-md font-bold text-gray-700">Entreprise utilisateur</h3>
                                        <p className="text-gray-600">
                                            {userCompany.comp_name} - {userCompany.comp_addre} - {userCompany.comp_posta} - {userCompany.comp_city} - {userCompany.comp_siret} - {userCompany.comp_code}
                                        </p>
                                    </div>
                                )}

                                <h3 className="text-md font-bold text-gray-700">Fichiers utilisateur</h3>
                                {userFiles.length > 0 ? (
                                    <ul className="text-gray-600">
                                        {userFiles.map(file => (
                                            <li key={file.file_id} className="mb-2">
                                                {file.file_name} - {file.file_size} Mo - {file.file_type} - {file.file_date} - {file.file_form} - {file.file_updat} - {file.file_modat}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">Aucun fichier trouvé</p>
                                )}
                                <p className="text-md font-bold mb-4 text-gray-500">Total de fichiers: {totalFileCount}</p>

                                <div className="flex justify-center items-center my-4">
                                    <div className="w-96 h-96">
                                        <Pie data={chartData} />
                                    </div>
                                </div>

                                <div>
                                    <p>{`Stockage utilisé: ${usedStorage} / ${totalStorage} Go (${percentageUsed.toFixed(2)}%)`}</p>
                                </div>

                                <button 
                                    onClick={() => deleteUser(user.user_id)} 
                                    className="bg-white text-black text-lg font-bold py-2 px-4 rounded-lg hover:bg-red-100 transition-colors duration-300 shadow-md border-2 border-red-600 mt-4"
                                >
                                    Supprimer utilisateur
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}


            <div className="mb-4">
                <button 
                    onClick={toggleCompanyList} 
                    className="w-full bg-white text-black py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
                >
                    Liste des Entreprises (total: {getTotalCompanies()})
                </button>
            </div>
            {showCompanies && (
                <ul className="bg-gray-100 p-4 rounded-lg shadow-md">
                    {companies.map(comp => (
                        <li key={comp.comp_id} className="mb-2">
                            {comp.comp_name} - {comp.comp_addre}
                        </li>
                    ))}
                </ul>
            )}

            <div className="mb-4">
                <button 
                    onClick={toggleSubscriptionList} 
                    className="w-full bg-white text-black py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
                >
                    Liste des Abonnements (total: {getTotalSubscriptions()})
                </button>
            </div>
            {showSubscriptions && (
                <ul className="bg-gray-100 p-4 rounded-lg shadow-md">
                    {subscriptions.map(subs => (
                        <li key={subs.subs_id} className="mb-2">
                            {subs.subs_name} - {subs.subs_stora} - {subs.subs_price} - {subs.subs_nbuser}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Admin;
