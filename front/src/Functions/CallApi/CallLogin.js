import axios from "axios";

// connexion de l'utilisateur
export const loginUser = async (data) => {
    try {
        const response = await axios.post('http://localhost:5555/api/users/login', data, {
            withCredentials: true // Inclure les cookies dans la requête
        });

        return response.data;
    } catch (error) {
        return { error: error.response ? error.response.data : error.message };
    }
};

