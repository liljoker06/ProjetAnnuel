import consoleLog from "../Dev/consoleLog";

export const checkPayment = async ({
    setLoading,
    setErrors,
    nextStep,
    userData,
    submitRegistration
}) => {
    setLoading(true);
    consoleLog('• [START] checkPayment', 'white');

    try {
        const result = await submitRegistration(userData);
        if (result.success) {
            consoleLog('• Utilisateur enregistré', 'green');
            consoleLog('• [END] checkPayment', 'white');
            nextStep();
        } else {
            consoleLog('• Erreur lors de l\'enregistrement', 'red');
            setErrors(result.errors);
        }
    } catch (error) {
        setErrors({ api: 'Une erreur est survenue lors de la soumission.' });
    }
    Object.keys(newErrors).forEach(key => {
        if (newErrors[key]) {
            consoleLog(newErrors[key], 'red');
        }
    });
    consoleLog('• [END] checkPayment', 'white');

    setLoading(false);
};