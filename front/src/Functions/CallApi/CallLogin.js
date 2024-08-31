import axios from "axios";

// connexion de l'utilisateur
export const loginUser = async (data) => {
    console.log('• callapi login user', 'white');
    try {
        const response = await axios.post('http://localhost:5555/api/users/login', data);

        return response.data;
    } catch (error) {
        return { error: error.message };
    }
}
