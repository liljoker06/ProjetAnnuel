export const checkCodeMail = (codeChain) => {
    const code = codeChain.join('');
    console.log("code : " + code);
    console.log("codeChain : " + codeChain);

    if (code.length !== 5) {
        return { success: false, error: 'Code invalide.' };
    }
    return { success: true };

};