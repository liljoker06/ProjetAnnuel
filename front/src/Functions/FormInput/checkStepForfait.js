import consoleLog from "../Dev/consoleLog";

export const checkStepForfait = ({
    setLoading,
    setErrors,
    setPlan,
    nextStep
}) => {
    setLoading(true);
    consoleLog('• Début de checkStepForfait', 'white');
    consoleLog('Vérification du forfait...', 'cyan');
    const newErrors = {};

    const radioPlan = document.querySelector('input[name="radio-plan"]:checked');
    consoleLog('radioPlan : '+ radioPlan.value, 'cyan');
    newErrors.radioPlan = !radioPlan ? 'Forfait requis.' : '';

    setErrors(newErrors);
    setLoading(false);
    Object.keys(newErrors).forEach(key => {
        if (newErrors[key]) {
            consoleLog(newErrors[key], 'red');
        }
    });
    consoleLog('Vérification terminée.', 'cyan');

    if (Object.values(newErrors).filter(error => error).length === 0) {
        setPlan(radioPlan.value);
        consoleLog('• Fin de checkStepForfait', 'white');
        nextStep();
    } else {
        consoleLog('• Fin de checkStepForfait', 'white');
    }
};