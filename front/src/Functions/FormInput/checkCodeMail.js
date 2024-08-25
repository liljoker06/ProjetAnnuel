import consoleLog from '../Dev/consoleLog';

export const checkCodeMail = async ({
    setLoading,
    setErrors,
    getFullCode,
    validateMailCode,
    email,
    nextStep
}) => {
    setLoading(true);
    consoleLog('Début de checkCodeMail', 'cyan');
    consoleLog('Vérification du code de vérification...', 'blue');
    const newErrors = {};

    // Vérification de la présence
    const code = getFullCode();
    consoleLog('Code : ' + code, 'blue');
    newErrors.codeMail = code.length !== 5 ? 'Code invalide (5 chiffres requis).' : '';

    try {
        const response = await validateMailCode({ mailcode_email: email, mailcode_code: code });
        consoleLog('Réponse du serveur: ' + response.success, 'blue');

        if (response.success) {
            consoleLog('Code valide.', 'green');
        } else {
            newErrors.codeMail = response.data.error || 'Code invalide.';
            consoleLog('Code invalide.', 'red');
        }
    } catch (error) {
        consoleLog('Erreur lors de la validation du code:' + error, 'red');
        newErrors.codeMail = 'Erreur lors de la validation du code.';
    } finally {
        setErrors(newErrors); // Met à jour l'état des erreurs
        setLoading(false); // Termine le chargement
        consoleLog('Verification terminée.', 'blue');
        if (newErrors.codeMail) consoleLog('Erreurs:' + newErrors.codeMail, 'red');
        

        // Vérifie s'il n'y a pas d'erreurs avant de passer à l'étape suivante
        if (Object.values(newErrors).filter(error => error).length === 0) {
            consoleLog('Fin de checkCodeMail', 'cyan');
            nextStep();
        } else {
            consoleLog('Fin de checkCodeMail', 'cyan');
        }
    }
};