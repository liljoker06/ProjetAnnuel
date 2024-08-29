import consoleLog from "../Dev/consoleLog";

export const checkStepCard = ({
    setLoading,
    setErrors,
    setNumCard,
    setNameCard,
    setDateCard,
    setCvvCard,
    nextStep
}) => {
    setLoading(true);
    consoleLog('• [START] checkStepCard', 'white');
    consoleLog('Vérification des champs carte...', 'cyan');
    const newErrors = {};    

    const fields = [
        { id: 'numCard', label: 'Numéro de carte', length: 19, required: true },
        { id: 'nameCard', label: 'Nom du titulaire', required: true },
        { id: 'dateCard', label: 'Date d\'expiration', length: 5, required: true },
        { id: 'cvvCard', label: 'Cryptogramme visuel', length: 3, required: true }
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

    // pas sécurisé car date prise sur la machine client
    const dateCardValue = values.dateCard;
    if (dateCardValue) {
        const [month, year] = dateCardValue.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; 
        const currentMonth = currentDate.getMonth() + 1; 
    
        if (parseInt(month, 10) > 12 || parseInt(month, 10) <= 0) {
            newErrors.dateCard = 'Mois invalide. Le mois doit être compris entre 01 et 12.';
        } else if (parseInt(year, 10) < currentYear || (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth)) {
            newErrors.dateCard = 'Date de validité dépassée.';
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
        setNumCard(values.numCard.replace(/\s+/g, ''));
        setNameCard(values.nameCard);
        setDateCard(values.dateCard);
        setCvvCard(values.cvvCard);
        consoleLog('• [END] checkStepCard', 'white');
        nextStep();
    } else {
        consoleLog('• [END] checkStepCard', 'white');
    }
};
