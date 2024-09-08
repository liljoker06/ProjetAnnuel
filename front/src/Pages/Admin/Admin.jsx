import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);

    const [showUsers, setShowUsers] = useState(false);
    const [showCompanies, setShowCompanies] = useState(false);
    const [showSubscriptions, setShowSubscriptions] = useState(false);

    const [editUser, setEditUser] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);


    useEffect(() => {
        axios.get('http://localhost:5555/api/users')
            .then(response => {
                console.log('Utilisateurs récupérés:', response.data);
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5555/api/companies')
            .then(response => {
                console.log('Entreprises récupérées:', response.data);
                setCompanies(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des entreprises:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5555/api/subscriptions')
            .then(response => {
                console.log('Abonnements récupérés:', response.data);
                setSubscriptions(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des abonnements:', error);
            });
    }, []);


    const deleteUser = (userId) => {
        console.log(`Tentative de suppression de l'utilisateur avec l'ID: ${userId}`);
        axios.delete(`http://localhost:5555/api/deleteUser/${userId}`)
            .then(() => {
                setUsers(users.filter(user => user.user_id !== userId));
                console.log(`Utilisateur ${userId} supprimé`);
            })
            .catch(error => {
                console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            });
    };

    const toggleUserList = () => {
        setShowUsers(!showUsers);
        console.log('État showUsers:', !showUsers);
    };

    const toggleCompanyList = () => {
        setShowCompanies(!showCompanies);
        console.log('État showCompanies:', !showCompanies);
    };

    const toggleSubscriptionList = () => {
        setShowSubscriptions(!showSubscriptions);
        console.log('État showSubscriptions:', !showSubscriptions);
    };

    const handleEditClick = (user) => {
        setEditUser(user);
        setShowEditPopup(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditUser({ ...editUser, [name]: value });
    };

    const handleEditSubmit = () => {
        axios.put(`http://localhost:5555/api/updateUser/${editUser.user_id}`, editUser)
            .then(response => {
                setUsers(users.map(user => user.user_id === editUser.user_id ? editUser : user));
                setShowEditPopup(false);
                console.log('Utilisateur mis à jour:', response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            });
    };

    return (
        <div>
            <h1>Admin</h1>
            <div>
                <button onClick={toggleUserList} style={{ marginTop: 100 }}>
                    Liste des utilisateurs
                </button>
                <button>
                    Créer utilisateur
                </button>
            </div>
            {showUsers && (
                <ul>
                    {users.map(user => (
                        <li key={user.user_id}>
                            {user.user_id} - {user.user_fname} - {user.user_lname} - {user.user_email} - {user.user_addre} - {user.user_posta} - {user.user_city} - {user.user_phone} - {user.user_role} - {user.user_subid}
                            <button onClick={() => deleteUser(user.user_id)} style={{ marginLeft: 10 }}>
                                Supprimer utilisateur
                            </button>
                            <button onClick={() => handleEditClick(user)} style={{ marginLeft: 10 }}>
                                Modifier utilisateur
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div>
                <button onClick={toggleCompanyList}>
                        Liste des Entreprises
                </button>
            </div>
            {showCompanies && (
                <ul>
                    {companies.map(comp => (
                        <li key={comp.comp_id}>
                            {comp.comp_name} - {comp.comp_addre}
                        </li>
                    ))}
                </ul>
            )}

            <div>
                <button onClick={toggleSubscriptionList}>
                        Liste des Abonnements
                </button>
            </div>
            {showSubscriptions && (
                <ul>
                    {subscriptions.map(subs => (
                        <li key={subs.subs_id}>
                            {subs.subs_name} - {subs.subs_stora} - {subs.subs_price} - {subs.subs_nbuser}
                        </li>
                    ))}
                </ul>
            )}


            {showEditPopup && (
                <div className="popup">
                    <h2>Modifier utilisateur</h2>
                    <label>
                        Prénom:
                        <input
                            type="text"
                            name="user_fname"
                            value={editUser.user_fname}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Nom:
                        <input
                            type="text"
                            name="user_lname"
                            value={editUser.user_lname}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <button onClick={handleEditSubmit}>Valider</button>
                    <button onClick={() => setShowEditPopup(false)}>Annuler</button>
                </div>
            )}
        </div>
    );
};

export default Admin;