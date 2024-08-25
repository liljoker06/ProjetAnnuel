import consoleLog from "../Dev/consoleLog";

export const checkStepEntreprise = ({
    setLoading,
    setErrors,
    estEntrepriseExistante,
    setCodeCompany,
    setNomEntreprise,
    setSiret,
    setAdresseEntreprise,
    setCodePostalEntreprise,
    setCityCompany,
    skipStep,
    nextStep
}) => {
    setLoading(true);
    consoleLog('• Début de checkStepEntreprise', 'white');
    consoleLog('Vérification des champs entreprise...', 'cyan');
    const newErrors = {};

    const fields = estEntrepriseExistante ? [
        { id: 'codeCompany', label: 'Code de l\'entreprise', length: 10, required: true }
    ] : [
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

    setErrors(newErrors);
    setLoading(false);
    Object.keys(newErrors).forEach(key => {
        if (newErrors[key]) {
            consoleLog(newErrors[key], 'red');
        }
    });
    consoleLog('Vérification terminée.', 'cyan');

    if (Object.values(newErrors).filter(error => error).length === 0) {
        if (estEntrepriseExistante) {
            setCodeCompany(values.codeCompany);
            skipStep(6);
        } else {
            setNomEntreprise(values.nameCompany);
            setSiret(values.SIRET);
            setAdresseEntreprise(values.adresseCompany);
            setCodePostalEntreprise(values.cpCompany);
            setCityCompany(values.cityCompany);
            consoleLog('• Fin de checkStepEntreprise', 'white');
            nextStep();
        }
    } else {
        consoleLog('• Fin de checkStepEntreprise', 'white');
    }
};