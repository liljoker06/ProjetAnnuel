import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios'; // Import axios for HTTP requests
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Profile_information({ user_name, user_email, user_role, user_phone, user_addre, user_city, user_posta, country }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        user_name,
        user_email,
        user_role,
        user_phone,
        user_addre,
        user_city,
        user_posta,
        country,
    });
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // For redirection after account deletion

    useEffect(() => {
        if (open) {
            setFormData({
                user_name,
                user_email,
                user_role,
                user_phone,
                user_addre,
                user_city,
                user_posta,
                country,
            });
        }
    }, [open, user_name, user_email, user_role, user_phone, user_addre, user_city, user_posta, country]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setPassword('');
        setError('');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = () => {
        if (password === '') {
            setError('Veuillez confirmer votre mot de passe');
        } else {
            console.log('Form Data Submitted:', formData);
            console.log('Password Confirmation:', password);
            handleClose();
        }
    };

    const handleDeleteAccount = () => {
        const token = Cookies.get('token'); // Assume the token is stored in cookies

        // Demander une confirmation avant la suppression
        const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.');
        if (!confirmed) return;

        axios.delete('http://localhost:5555/api/users/deleteUser', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log('Compte supprimé avec succès');
                Cookies.remove('token'); // Supprimer le token des cookies
                navigate('/'); // Rediriger vers la page d'accueil ou de connexion
            })
            .catch((error) => {
                console.error('Erreur lors de la suppression du compte :', error);
                alert('Une erreur est survenue lors de la suppression du compte.');
            });
    };

    return (
        <div className="relative flex flex-col h-full min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="p-4 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl">
                <div className="flex flex-wrap -mx-3">
                    <div className="flex items-center w-full max-w-full px-3 shrink-0 md:w-8/12 md:flex-none">
                        <h6 className="mb-0">Informations du Profil</h6>
                    </div>
                    <div className="w-full max-w-full px-3 text-right shrink-0 md:w-4/12 md:flex-none">
                        {/* Material UI IconButton */}
                        <IconButton onClick={handleClickOpen} color="primary">
                            <EditIcon />
                        </IconButton>
                    </div>
                </div>
            </div>
            <div className="flex-auto p-4">
                <p className="leading-normal text-sm">Le rôle de votre compte : {user_role}</p>
                <hr className="h-px my-6 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />
                <ul className="flex flex-col pl-0 mb-0 rounded-lg">
                    <li className="relative block px-4 py-2 pt-0 pl-0 leading-normal bg-white border-0 rounded-t-lg text-sm text-inherit">
                        <strong className="text-slate-700">Nom complet :</strong> &nbsp; {user_name}
                    </li>
                    <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-sm text-inherit">
                        <strong className="text-slate-700">Mobile :</strong> &nbsp; {user_phone}
                    </li>
                    <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-sm text-inherit">
                        <strong className="text-slate-700">Email :</strong> &nbsp; {user_email}
                    </li>
                    <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-sm text-inherit">
                        <strong className="text-slate-700">Localisation :</strong> &nbsp; {country}
                    </li>
                    <li className="relative block px-4 py-2 pb-0 pl-0 bg-white border-0 border-t-0 rounded-b-lg text-inherit">
                        <strong className="leading-normal text-sm text-slate-700">Adresse postal :</strong> &nbsp; {user_addre}, {user_city} {user_posta} {country}
                    </li>
                </ul>
            </div>

            {/* Dialog for editing the profile information */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Modifier le profil</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nom complet"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Mobile"
                        name="user_phone"
                        value={formData.user_phone}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="user_email"
                        value={formData.user_email}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Adresse"
                        name="user_addre"
                        value={formData.user_addre}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Ville"
                        name="user_city"
                        value={formData.user_city}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Code Postal"
                        name="user_posta"
                        value={formData.user_posta}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Pays"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        fullWidth
                    />
                    {/* Password Confirmation Field */}
                    <TextField
                        margin="dense"
                        label="Confirmez votre mot de passe"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        fullWidth
                        error={error !== ''}
                        helperText={error}
                    />
                </DialogContent>
                {/* Tailwind Styled Buttons for Actions */}
                <div className="flex justify-end p-4">
                    <button
                        onClick={handleClose}
                        className="bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2 hover:bg-gray-700"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Enregistrer
                    </button>
                    <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                    Supprimer mon compte
                    </button>
                </div>
            </Dialog>
        </div>
    );
}
