import axios from "axios";

// check si l'email existe
export const validateUserEmail = async (data) => {
    try {
        const response = await axios.post('http://localhost:5555/api/users/validateEmail', data);

        return response.data.isValid;
    } catch (error) {
        return false;
    }
}

// check si l'utilisateur existe
export const validateUser = async (data) => {
    try {
        const response = await axios.post('http://localhost:5555/api/users/validateUser', data);

        return response.data.isValid;
    } catch (error) {
        return false;
    }
}

export const getUserInfoByToken = async (token) => {
    try {
        const response = await axios.post('http://localhost:5555/api/users/getUserInfoByToken', {}, {
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