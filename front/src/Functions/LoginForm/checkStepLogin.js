import consoleLog from '../Dev/consoleLog';

export const checkStepLogin = async ({
    setEmail,           // Fonction pour définir l'email
    setPassword,        // Fonction pour définir le mot de passe
    validateUserEmail,  // Fonction pour vérifier si l'email est valide
    generateMailCode,   // Fonction pour envoyer le code de vérification
    nextStep,           // Fonction pour passer à l'étape suivante
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
            const isEmailValid = await validateUserEmail({ user_email: values.email });
            consoleLog(`Validation de l'email: ${values.email}`, 'cyan');
            if (!isEmailValid) {
                newErrors.email = 'Email déjà utilisé.';
                consoleLog('Email déjà utilisé.', 'red');
            }
        } catch (error) {
            newErrors.email = 'Erreur lors de la validation de l\'email.';
            consoleLog('Erreur lors de la validation de l\'email.', 'red');
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
            } catch (error) {
                consoleLog('Erreur lors de l\'envoi de l\'email de vérification:' + error, 'red');
            }

            consoleLog('• [END] checkStepLogin', 'white');
            nextStep();
        } else {
            consoleLog('• [END] checkStepLogin', 'white');
        }
        setLoading(false);
    } else {
        consoleLog('• [END] checkStepLogin', 'white');
    }
};