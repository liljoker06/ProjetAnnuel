import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);

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

    const deleteUser = (userId) => {
        axios.delete(`http://localhost:5555/api/users/${userId}`)
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

    return (
        <div>
            <h1>Admin</h1>
            <button onClick={toggleUserList} style={{marginTop: 100}}>
                Liste des utilisateurs
            </button>
            {showUsers && (
                <ul>
                    {users.map(user => (
                        <>
                        <li key={user.user_id}>
                            {user.user_fname} - {user.user_lname}
                            <button onClick={() => deleteUser(user.user_id)} style={{ marginLeft: 10 }}>
                                Supprimer utilisateur
                            </button>
                        </li>
                        
                        </>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Admin;
