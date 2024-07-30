import consoleLog from '../Dev/consoleLog';

export const checkCodeMail = (codeChain) => {
    const code = codeChain.join('');
    consoleLog('Vérification du code de validation...', 'blue');
    consoleLog('Code : ' + code, 'blue');
    consoleLog('CodeChain : ' + codeChain, 'blue');


    if (code.length !== 5) {
        consoleLog('Code invalide', 'red');
        return { success: false, error: 'Code invalide.' };
    }
    consoleLog('Code valide', 'green');
    return { success: true };

};