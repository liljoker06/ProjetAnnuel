import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/adminUsers');
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // const deleteUser = async (userId) => {
    //     try {
    //         await axios.delete(`/api/admin/users/${userId}`);
    //         fetchUsers();
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    return (
        <div>
            <h1>Admin Page</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name}
                        {/* <button onClick={() => deleteUser(user.id)}>Delete</button> */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;