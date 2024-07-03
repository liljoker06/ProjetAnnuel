export const checkPasswd = (password, setLoading) => {
    setLoading(true);
    console.log('Vérification du mot de passe...');
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!password) {
        setLoading(false);
        return { success: false, error: 'Veuillez renseigner votre mot de passe.' };
    }
    if (password && !passwordRegex.test(password)) {
        setLoading(false);
        return { success: false, error: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre.' };
    }
    setLoading(false);
    return { success: true };
};