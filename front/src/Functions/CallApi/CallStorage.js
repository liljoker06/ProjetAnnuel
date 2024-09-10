import axios from "axios";
import Cookies from 'js-cookie'; 
import FormData from 'form-data'; // Pour envoyer des données de formulaire
const linkAPI = process.env.REACT_APP_LinkAPI;


// Vérifier la limite de stockage de l'utilisateur
export const checkStorageLimit = async (fileSize) => {
  try {
    const token = Cookies.get('token'); // Récupérer le token d'authentification

    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const response = await axios.get(`${linkAPI}/userStorages/check`, {
      headers: {
        Authorization: `Bearer ${token}`, // Ajouter le token d'authentification dans l'en-tête
      },
    });

    const { allowedStorage, usedStorage } = response.data;

    if (usedStorage + fileSize > allowedStorage) {
      throw new Error('Vous avez dépassé votre limite de stockage.');
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification du stockage:', error.response?.data || error.message);
    throw error;
  }
};

// Uploader un fichier pour l'utilisateur
export const uploadFile = async (file) => {
  if (!file) {
    console.error("Aucun fichier à uploader");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  console.log([...formData.entries()]);

  const token = Cookies.get('token');

  try {
    const response = await axios.post(`${linkAPI}/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, 
      },
    });
    console.log('Fichier uploadé avec succès:', response.data);
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error);
  }
};



// Récupérer les fichiers de l'utilisateur
export const getUserFiles = async (userId) => {
  try {

    const token = Cookies.get('token'); // Récupérer le token d'authentification
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const response = await axios.post(`${linkAPI}/files/userfile`, { userId } , {
      headers: {
        Authorization: `Bearer ${token}`, // Ajouter le token d'authentification dans l'en-tête
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des fichiers:', error.response?.data || error.message);
    throw error;
  }
};

