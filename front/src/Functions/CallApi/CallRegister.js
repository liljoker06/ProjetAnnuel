import axios from 'axios';

const linkAPI = process.env.REACT_APP_LinkAPI;

export const submitRegistration = async (data) => {
    console.log('data', data);
    try {
        const response = await axios.post(`${linkAPI}/users/create`, data);

        return { success : true, data : response.data };
    } catch (error){
        if (error.response) {
            return { success : false, data : error.response.data };
        }else {
            return { success : false, error : { api: 'erreur lors de la connexion API '} };
        }
    }
};



