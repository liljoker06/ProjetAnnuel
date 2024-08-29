import consoleLog from "../Dev/consoleLog";

export const checkStepForfait = ({
    setLoading,
    setErrors,
    setPlan,
    nextStep
}) => {
    setLoading(true);
    consoleLog('• [START] checkStepForfait', 'white');
    consoleLog('Vérification du forfait...', 'cyan');
    const newErrors = {};

    const radioPlan = document.querySelector('input[name="radio-plan"]:checked');
    if (radioPlan) {
        consoleLog('Forfait : ' + radioPlan.value, 'cyan');
        newErrors.radioPlan = '';
    } else {
        newErrors.radioPlan = 'Forfait requis.';
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
        setPlan(radioPlan.value);
        consoleLog('• [END] checkStepForfait', 'white');
        nextStep();
    } else {
        consoleLog('• [END] checkStepForfait', 'white');
    }
};