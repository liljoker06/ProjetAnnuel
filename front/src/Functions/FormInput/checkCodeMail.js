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
    consoleLog('• [START] checkCodeMail', 'white');
    consoleLog('Vérification du code de vérification...', 'cyan');
    const newErrors = {};

    // Vérification de la présence
    const code = getFullCode();
    consoleLog('Code : ' + code, 'cyan');
    newErrors.codeMail = code.length !== 5 ? 'Code invalide (5 chiffres requis).' : '';

    try {
        const response = await validateMailCode({ mailcode_email: email, mailcode_code: code });
        consoleLog('Réponse du serveur: ' + response.success, 'cyan');

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
        consoleLog('Verification terminée.', 'cyan');
        if (newErrors.codeMail) consoleLog('Erreurs: ' + newErrors.codeMail, 'red');
        

        // Vérifie s'il n'y a pas d'erreurs avant de passer à l'étape suivante
        if (Object.values(newErrors).filter(error => error).length === 0) {
            consoleLog('• [END] checkCodeMail', 'white');
            nextStep();
        } else {
            consoleLog('• [END] checkCodeMail', 'white');
        }
    }
};