import axios from "axios";

const linkAPI = process.env.REACT_APP_LinkAPI;

// get company by code 
export const getCompanyByCode = async (data) => {
    try {
        console.log('Données envoyées à l\'API:', data);
        const response = await axios.post(`${linkAPI}/companies/getByCode`, data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'appel API:', error);
        return false;
    }
}

// check si l'entreprise existe
export const validateCompany = async (data) => {
    try {
        const response = await axios.post(`${linkAPI}/companies/validate`, data);

        return response.data;
    } catch (error) {
        return false;
    }
}

// check si le code entreprise existe
export const validateCompanyCode = async (data) => {
    try {
        const response = await axios.post(`${linkAPI}/companies/validateCode`, data);
        return response.data.isValid;
    } catch (error) {
        return false;
    }
}