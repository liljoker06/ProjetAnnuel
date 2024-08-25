import consoleLog from '../Dev/consoleLog';

export const checkStepBasic = ({
    setLoading,         // Fonction pour activer/désactiver le chargement
    setErrors,          // Fonction pour définir les erreurs
    setEmail,           // Fonction pour définir l'email
    setPhone,           // Fonction pour définir le téléphone
    setPassword,        // Fonction pour définir le mot de passe
    setNom,             // Fonction pour définir le nom
    setPrenom,          // Fonction pour définir le prénom
    setBirth,           // Fonction pour définir la date de naissance
    setAdresse,         // Fonction pour définir l'adresse
    setCodePostal,      // Fonction pour définir le code postal
    setVille,           // Fonction pour définir la ville
    generateMailCode,   // Fonction pour envoyer le code de vérification
    nextStep            // Fonction pour passer à l'étape suivante
}) => {
    setLoading(true);
    consoleLog('• Début de checkStepBasic', 'white');
    consoleLog('Vérification des champs...', 'cyan');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    const newErrors = {};

    const fields = [
        { id: 'email', label: 'Email', regex: emailRegex, required: true },
        { id: 'phone', label: 'Téléphone', regex: phoneRegex, required: true },
        { id: 'password', label: 'Mot de passe', minLength: 6, required: true },
        { id: 'confirmPassword', label: 'Confirmation de mot de passe', required: true },
        { id: 'nom', label: 'Nom', required: true },
        { id: 'prenom', label: 'Prénom', required: true },
        { id: 'jour', label: 'Jour', min: 1, max: 31, required: true },
        { id: 'mois', label: 'Mois', min: 1, max: 12, required: true },
        { id: 'annee', label: 'Année', min: 1900, max: 2023, required: true },
        { id: 'adresse', label: 'Adresse', required: true },
        { id: 'cp', label: 'Code postal', length: 5, required: true },
        { id: 'city', label: 'Ville', required: true }
    ];

    const values = {};
    fields.forEach(field => {
        values[field.id] = document.getElementById(field.id).value;
        if (field.required && !values[field.id]) {
            newErrors[field.id] = `${field.label} requis.`;
        } else if (field.regex && !field.regex.test(values[field.id])) {
            newErrors[field.id] = `${field.label} invalide.`;
        } else if (field.minLength && values[field.id].length < field.minLength) {
            newErrors[field.id] = `${field.label} doit contenir au moins ${field.minLength} caractères.`;
        } else if (field.min && values[field.id] < field.min) {
            newErrors[field.id] = `${field.label} invalide.`;
        } else if (field.max && values[field.id] > field.max) {
            newErrors[field.id] = `${field.label} invalide.`;
        } else if (field.length && values[field.id].length !== field.length) {
            newErrors[field.id] = `${field.label} invalide.`;
        } else {
            consoleLog(`${field.label} valide.`, 'green');
        }
    });

    if (values.password !== values.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
    }

    setErrors(newErrors);
    setLoading(false);
    consoleLog('Vérification terminée.', 'cyan');

    Object.keys(newErrors).forEach(key => {
        if (newErrors[key]) {
            consoleLog(newErrors[key], 'red');
        }
    });

    if (Object.values(newErrors).filter(error => error).length === 0) {
        setEmail(values.email);
        setPhone(values.phone);
        setPassword(values.password);
        setNom(values.nom);
        setPrenom(values.prenom);
        setBirth(`${values.jour}/${values.mois}/${values.annee}`);
        setAdresse(values.adresse);
        setCodePostal(values.cp);
        setVille(values.city);
        consoleLog(`${values.email} ${values.phone} ${values.password} ${values.nom} ${values.prenom} ${values.jour}/${values.mois}/${values.annee} ${values.adresse} ${values.cp} ${values.city}`, 'cyan');

        try {
            consoleLog('Envoi de l\'email de vérification...', 'cyan');
            generateMailCode({ mailcode_email: values.email });
            consoleLog('Email de vérification envoyé à ' + values.email, 'green');
        } catch (error) {
            consoleLog('Erreur lors de l\'envoi de l\'email de vérification:' + error, 'red');
        }

        consoleLog('• Fin de checkStepBasic', 'white');
        nextStep();
    } else {
        consoleLog('• Fin de checkStepBasic', 'white');
    }
};