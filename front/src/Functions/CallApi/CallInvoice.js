import axios from "axios";

// récupère les factures par l'id de l'utilisateur
export const getInvoicesByUserId = async (token) => {
    try {
        const response = await axios.post('http://localhost:5555/api/invoices/getInvoicesByUserId', {}, {
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