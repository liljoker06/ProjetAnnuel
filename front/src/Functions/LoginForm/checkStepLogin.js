import consoleLog from '../Dev/consoleLog';

export const checkStepLogin = async ({
    setEmail,           // Fonction pour définir l'email
    setPassword,        // Fonction pour définir le mot de passe
    validateUser,       // Fonction pour vérifier si l'utilisateur existe
    generateMailCode,   // Fonction pour envoyer le code de vérification
    setCanEmail,        // Fonction pour définir si l'email est valide
    nextCase,           // Fonction pour passer à l'étape suivante
    setLoading,         // Fonction pour définir l'état de chargement
    setErrors           // Fonction pour définir les erreurs
}) => {
    setLoading(true);
    consoleLog('• [START] checkStepLogin', 'white');
    consoleLog('Vérification des champs...', 'cyan');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};

    const fields = [
        { id: 'email', label: 'Email', regex: emailRegex, required: true },
        { id: 'password', label: 'Mot de passe', required: true },
    ];
    
    const values = {};
    fields.forEach(field => {
        values[field.id] = document.getElementById(field.id).value;
        if (field.required && !values[field.id]) {
            newErrors[field.id] = `${field.label} requis.`;
        } else if (field.regex && !field.regex.test(values[field.id])) {
            newErrors[field.id] = `${field.label} invalide.`;
        } else {
            consoleLog(`${field.label} valide.`, 'green');
        }
    });

    setErrors(newErrors);
    setLoading(false);
    consoleLog('Vérification terminée.', 'cyan');

    Object.keys(newErrors).forEach(key => {
        if (newErrors[key]) {
            consoleLog(newErrors[key], 'red');
        }
    });

    if (Object.values(newErrors).filter(error => error).length === 0) {
        setLoading(true);
        try {
            const isValidUser = await validateUser({ user_email: values.email, user_passw: values.password });
            consoleLog(`Validation de l'utilisateur: ${values.email}`, 'cyan');
            consoleLog(`Utilisateur ${isValidUser ? 'valide' : 'invalide'}.`, isValidUser ? 'green' : 'red');
            if (!isValidUser) {
                newErrors.email = 'Email ou mot de passe incorrect.';
                consoleLog('Email ou mot de passe incorrect.', 'red');
            }
        } catch (error) {
            newErrors.email = 'Erreur lors de la validation de l\'utilisateur.';
            consoleLog('Erreur lors de la validation de l\'utilisateur.', 'red');
        }
        setErrors(newErrors);

        if (Object.values(newErrors).filter(error => error).length === 0) {
            setEmail(values.email);
            setPassword(values.password);
            consoleLog(`${values.email} ${values.password}`, 'cyan');

            try {
                consoleLog('Envoi de l\'email de vérification...', 'cyan');
                generateMailCode({ mailcode_email: values.email });
                consoleLog('Email de vérification envoyé à ' + values.email, 'green');
                setCanEmail(true);
                nextCase();
            } catch (error) {
                consoleLog('Erreur lors de l\'envoi de l\'email de vérification:' + error, 'red');
            }

            consoleLog('• [END] checkStepLogin', 'white');
        } else {
            consoleLog('• [END] checkStepLogin', 'white');
        }
        setLoading(false);
    } else {
        consoleLog('• [END] checkStepLogin', 'white');
    }
};