import consoleLog from '../Dev/consoleLog';

export const checkPasswdReset = async ({
    setLoading,
    setErrors,
    changeUserPassword,
    CASE_LOGIN,
    email,
    setPassword,
    setNewPassword,
    skipCase
}) => {
    consoleLog('• [START] checkPasswdReset', 'white');
    setLoading(true);
    const newErrors = {};

    // Vérification de la présence
    const newpassword = document.getElementById('new-password').value;
    const repeatnewpassword = document.getElementById('repeat-new-password').value;

    newErrors.newpassword = newpassword.length < 6 ? 'Mot de passe trop court (6 caractères minimum).' : '';
    newErrors.repeatnewpassword = newpassword !== repeatnewpassword ? 'Les mots de passe ne correspondent pas.' : '';

    if (newpassword.length >= 6 && newpassword === repeatnewpassword) {
        try {
            const response = await changeUserPassword({ email, password: newpassword });

            if (response && response.success) {
                consoleLog('Mot de passe changé.', 'green');
                setPassword('');
                setNewPassword('');
                skipCase(CASE_LOGIN);
            } else {
                newErrors.newpassword = response.error || 'Erreur lors du changement de mot de passe.';
                consoleLog('Erreur lors du changement de mot de passe.', 'red');
            }
        } catch (error) {
            consoleLog('Erreur lors du changement de mot de passe:', error);
            newErrors.newpassword = 'Erreur lors du changement de mot de passe.';
        } finally {
            setErrors(newErrors);
            setLoading(false);
            if (newErrors.newpassword) consoleLog('Erreurs:', newErrors.newpassword, 'red');
        }
    } else {
        setErrors(newErrors);
        setLoading(false); 
    }
};