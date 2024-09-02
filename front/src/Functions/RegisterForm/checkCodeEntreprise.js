import consoleLog from "../Dev/consoleLog";

// Si l'entreprise existe
export const checkCodeEntreprise = async ({
    STEP_CONFIRMATION,
    setLoading,
    setErrors,
    setCodeCompany,
    validateCompanyCode,
    getCompanyByCode,
    setCodeExistCompanyName,
    setCodeExistCompanySiret,
    setCodeExistCompanyAdresse,
    setCodeExistCompanyCodePostal,
    setCodeExistCompanyCity,
    skipStep
}) => {
    setLoading(true);
    consoleLog('• [START] checkCodeEntreprise', 'white');
    consoleLog('Vérification du code entreprise...', 'cyan');
    const newErrors = {};

    const fields = [
        { id: 'codeCompany', label: 'Code de l\'entreprise', length: 10, required: true }
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

    if (Object.keys(newErrors).length === 0) {
        try {
            consoleLog(`Validation du code de l'entreprise: ${values.codeCompany}`, 'cyan');
            const isValid = await validateCompanyCode({ comp_code: values.codeCompany });
            consoleLog(`Code de l'entreprise: ${values.codeCompany}`, 'cyan');
            if (!isValid) {
                newErrors.codeCompany = 'Code de l\'entreprise invalide.';
            } else {
                consoleLog(`Recherche de l'entreprise avec le code: ${values.codeCompany}`, 'cyan');
                const company = await getCompanyByCode({ codeEntreprise: values.codeCompany });
                console.log("companie:", company);
                if (company) {
                    setCodeExistCompanyName(company.comp_name);
                    setCodeExistCompanySiret(company.comp_siret);
                    setCodeExistCompanyAdresse(company.comp_adresse);
                    setCodeExistCompanyCodePostal(company.comp_code_postal);
                    setCodeExistCompanyCity(company.comp_city);
                    consoleLog('Entreprise trouvée.', 'green');
                } else {
                    newErrors.codeCompany = 'Code de l\'entreprise invalide.';
                }
            }
        } catch (error) {
            newErrors.codeCompany = 'Erreur lors de la validation ou de la recherche de l\'entreprise.';
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
        setCodeCompany(values.codeCompany);
        consoleLog('• [END] checkCodeEntreprise', 'white');
        skipStep(STEP_CONFIRMATION);
    } else {
        consoleLog('• [END] checkCodeEntreprise', 'white');
    }
};