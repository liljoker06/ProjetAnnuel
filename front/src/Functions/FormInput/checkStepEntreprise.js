import consoleLog from "../Dev/consoleLog";

// Si l'entreprise n'existe pas
export const checkStepEntreprise = async ({
    setLoading,
    setErrors,
    setNomEntreprise,
    setSiret,
    setAdresseEntreprise,
    setCodePostalEntreprise,
    setCityCompany,
    validateCompany,
    nextStep
}) => {
    setLoading(true);
    consoleLog('• [START] checkStepEntreprise', 'white');
    consoleLog('Vérification des champs entreprise...', 'cyan');
    const newErrors = {};

    const fields = [
        { id: 'nameCompany', label: 'Nom de l\'entreprise', required: true },
        { id: 'SIRET', label: 'SIRET', length: 14, required: true },
        { id: 'adresseCompany', label: 'Adresse de l\'entreprise', required: true },
        { id: 'cpCompany', label: 'Code postal de l\'entreprise', length: 5, required: true },
        { id: 'cityCompany', label: 'Ville de l\'entreprise', required: true }
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

    if (Object.values(newErrors).filter(error => error).length === 0) {
        try {
            const response = await validateCompany({ comp_name: values.nameCompany, comp_siret: values.SIRET });
            consoleLog(`Validation de l'entreprise: ${values.nameCompany} - ${values.SIRET}`, 'cyan');
            consoleLog('Réponse:', response.isValid, 'cyan');
            if (!response.isValid) {
                if (response.isName) {
                    newErrors.nameCompany = 'Nom de l\'entreprise déjà utilisé';
                } else if (response.isSiret) {
                    newErrors.SIRET = 'SIRET déjà utilisé';
                } else {
                    newErrors.nameCompany = 'Erreur lors de la validation de l\'entreprise';
                }
            }
        } catch (error) {
            newErrors.nameCompany = 'FATAL Erreur lors de la validation de l\'entreprise';
            consoleLog('FATAL Erreur lors de la validation de l\'entreprise: ' + error.message, 'red');
        }
    }

    setErrors(newErrors);
    setLoading(false);
    Object.keys(newErrors).forEach(key => {
        if (newErrors[key]) {
            consoleLog(newErrors[key], 'red');
        }
    });
    consoleLog('Vérification terminée.', 'cyan');

    if (Object.values(newErrors).filter(error => error).length === 0) {
        setNomEntreprise(values.nameCompany);
        setSiret(values.SIRET);
        setAdresseEntreprise(values.adresseCompany);
        setCodePostalEntreprise(values.cpCompany);
        setCityCompany(values.cityCompany);
        consoleLog('• [END] checkStepEntreprise', 'white');
        nextStep();
    } else {
        consoleLog('• [END] checkStepEntreprise', 'white');
    }
};

