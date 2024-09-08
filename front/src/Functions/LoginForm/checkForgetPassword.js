import consoleLog from '../Dev/consoleLog';

export const checkForgetPassword = async ({
    setLoading,
    generateMailCode,
    validateUserEmail,
    setEmail,
    setCanEmail,
    CASE_PASSWDFORGETNOMAIL,
    CASE_PASSWDFORGET,
    skipCase
}) => {
    setLoading(true);
    consoleLog('• [START] checkForgetPassword', 'white');
    consoleLog('Vérification de la présence du mail...', 'cyan');

    // Vérification de la présence
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        consoleLog('Adresse mail manquante.', 'red');
        skipCase(CASE_PASSWDFORGETNOMAIL);
    } else {
        if (!emailRegex.test(email)) {
            consoleLog('Adresse mail invalide.', 'red');
        } else {
            const checkMail = await validateUserEmail({ user_email: email });
            setEmail(email);
            consoleLog('Email : ' + email, 'cyan');
            consoleLog('Réponse du serveur: ' + checkMail, 'cyan');
            
            // Toujours passer à l'étape suivante
            skipCase(CASE_PASSWDFORGET);
            
            // Envoyer le code par mail uniquement si l'email est présent dans la BDD
            if (checkMail === false) {
                setCanEmail(true);
                consoleLog('Le mail existe, envoi du code.', 'green');
                generateMailCode({ mailcode_email: email });
            } else {
                setCanEmail(false);
                consoleLog('Le mail n\'existe pas, pas d\'envoi de code.', 'yellow');
            }
        }
    }

    setLoading(false); 
    consoleLog('• [END] checkForgetPassword', 'white');
}