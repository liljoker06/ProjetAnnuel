import consoleLog from '../Dev/consoleLog';

export const checkPasswdReset = async ({
    setLoading,
    setErrors,
    changeUserPassword,
    email,
    setPassword,
    setNewPassword,
    navigate
}) => {
    consoleLog('• [START] checkPasswdReset', 'white');
    setLoading(true);
    const newErrors = {};

    // Vérification de la présence
    const newpassword = document.getElementById('newpassword').value;
    const repeatnewpassword = document.getElementById('repeatnewpassword').value;

    newErrors.newpassword = newpassword.length < 6 ? 'Mot de passe trop court (6 caractères minimum).' : '';
    newErrors.repeatnewpassword = newpassword !== repeatnewpassword ? 'Les mots de passe ne correspondent pas.' : '';

    if (newpassword.length >= 6 && newpassword === repeatnewpassword) {
        try {
            const response = await changeUserPassword({ email, password: newpassword });
            consoleLog('Réponse du serveur: ' + response.success, 'cyan');

            if (response.success) {
                consoleLog('Mot de passe changé.', 'green');
                setPassword('');
                setNewPassword('');
                navigate('/login');
            } else {
                newErrors.newpassword = response.data.error || 'Erreur lors du changement de mot de passe.';
                consoleLog('Erreur lors du changement de mot de passe.', 'red');
            }
        } catch (error) {
            consoleLog('Erreur lors du changement de mot de passe:' + error, 'red');
            newErrors.newpassword = 'Erreur lors du changement de mot de passe.';
        } finally {
            setErrors(newErrors); // Met à jour l'état des erreurs
            setLoading(false); // Termine le chargement
            consoleLog('Changement terminé.', 'cyan');
            if (newErrors.newpassword) consoleLog('Erreurs: ' + newErrors.newpassword, 'red');
        }
    } else {
        setErrors(newErrors); // Met à jour l'état des erreurs
        setLoading(false); // Termine le chargement
    }


};