import axios from "axios";

const linkAPI = process.env.REACT_APP_LinkAPI;

// connexion de l'utilisateur
export const loginUser = async (data) => {
    try {
        const response = await axios.post(`${linkAPI}/users/login`, data, {
            withCredentials: true // Inclure les cookies dans la requête
        });

        return response.data;
    } catch (error) {
        return { error: error.response ? error.response.data : error.message };
    }
};

