import consoleLog from '../Dev/consoleLog';

export const checkPasswd = (password, setLoading) => {
    setLoading(true);
    consoleLog('Vérification du mot de passe...', 'blue');
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!password) {
        setLoading(false);
        consoleLog('No password', 'red');
        return { success: false, error: 'Veuillez renseigner votre mot de passe.' };
    }
    if (password && !passwordRegex.test(password)) {
        setLoading(false);
        consoleLog('Invalid password', 'red');
        return { success: false, error: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre.' };
    }
    setLoading(false);
    consoleLog('Password is valid', 'green');
    return { success: true };
};