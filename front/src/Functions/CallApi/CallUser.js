import axios from "axios";



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