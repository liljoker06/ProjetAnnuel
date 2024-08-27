import axios from "axios";

// check si l'entreprise existe
export const validateCompany = async (data) => {
    try {
        const response = await axios.post('http://localhost:5555/api/companies/validate', data);

        return response.data.isValid;
    } catch (error) {
        return false;
    }
}

// check si le code entreprise existe
export const validateCompanyCode = async (data) => {
    try {
        const response = await axios.post('http://localhost:5555/api/companies/validateCode', data);

        return response.data.isValid;
    } catch (error) {
        return false;
    }
}