import axios from "axios";

const linkAPI = process.env.REACT_APP_LinkAPI;

// récupère les factures par l'id de l'utilisateur
export const getInvoicesByUserId = async (token) => {
    try {
        const response = await axios.post(`${linkAPI}/invoices/getInvoicesByUserId`, {}, {
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