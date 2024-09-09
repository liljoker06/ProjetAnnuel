import axios from "axios";
const linkAPI = process.env.REACT_APP_LinkAPI;

export const generateMailCode = async (data) => {
    try {
        const response = await axios.post(`${linkAPI}/mailCodes/generate`, data);

        return { success: true, data: response.data };
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
            return { success: false, data: error.response.data };
        } else {
            return { success: false, error: { api: "erreur lors de la connexion API " } };
        }
    }
};

export const validateMailCode = async (data) => {
    try {
        const response = await axios.post(`${linkAPI}/mailCodes/validate`, data);
        return { success: true, status: response.status };
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
            return { success: false, status: error.response.status, data: error.response.data };
        } else {
            console.log(error);
            return { success: false, status: 500, error: { api: "Erreur lors de la connexion API" } };
        }
    }
};

export const resendMailCode = async (data) => {
    try {
        const response = await axios.post(`${linkAPI}/mailCodes/resend`, data);

        return { success: true, data: response.data };
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
            return { success: false, data: error.response.data };
        } else {
            console.log(error);
            return { success: false, error: { api: "erreur lors de la connexion API " } };
        }
    }

};