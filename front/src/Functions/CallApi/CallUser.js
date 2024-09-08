import axios from "axios";

const linkAPI = process.env.REACT_APP_LinkAPI;

// check si l'email existe
export const validateUserEmail = async (data) => {
    try {
        const response = await axios.post(`${linkAPI}/users/validateEmail`, data);

        return response.data.isValid;
    } catch (error) {
        return false;
    }
}

// check si l'utilisateur existe
export const validateUser = async (data) => {
    try {
        const response = await axios.post(`${linkAPI}/users/validate`, data);

        return response.data.isValid;
    } catch (error) {
        return false;
    }
}

// récupère les infos de l'utilisateur par son token
export const getUserInfoByToken = async (token) => {
    try {
        const response = await axios.post(`${linkAPI}/users/getByToken`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API error:', error);
        return false;
    }
}

//changer le mot de passe
export const changeUserPassword = async (data) => {
    try {
        const response = await axios.post(`${linkAPI}/users/changePassword`, data);
        return response.data; 
    } catch (error) {
        console.error('API error:', error);
        return { success: false, error: 'API call failed' }; 
    }
}
