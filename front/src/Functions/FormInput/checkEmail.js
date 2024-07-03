import consoleLog from '../Dev/consoleLog';

export const checkEmail = (email, setLoading) => {
  setLoading(true);
  consoleLog('Vérification de l\'adresse e-mail...', 'blue');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    consoleLog('No email', 'red');
    setLoading(false);
    return { success: false, error: 'Veuillez renseigner votre adresse e-mail.' };
  }
  if (email && !emailRegex.test(email)) {
    consoleLog('Invalid email', 'red');
    setLoading(false);
    return { success: false, error: 'Email invalide.' };
  }
  setLoading(false);
  consoleLog('Email is valid', 'green');
  return { success: true };
};