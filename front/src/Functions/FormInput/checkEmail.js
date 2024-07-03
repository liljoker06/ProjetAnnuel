export const checkEmail = (email, setLoading) => {
  setLoading(true);
  console.log('Vérification de l\'adresse e-mail...');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    console.log('No email');
    setLoading(false);
    return { success: false, error: 'Veuillez renseigner votre adresse e-mail.' };
  }
  if (email && !emailRegex.test(email)) {
    console.log('Invalid email');
    setLoading(false);
    return { success: false, error: 'Email invalide.' };
  }
  setLoading(false);
  return { success: true };
};