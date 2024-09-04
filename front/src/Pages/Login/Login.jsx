import React, { useState, useEffect, useRef } from 'react';
import TitlePart from '../../Components/TitlePart/TitlePart';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import consoleLog from '../../Functions/Dev/consoleLog';

import { checkStepLogin } from '../../Functions/LoginForm/checkStepLogin';
import { checkCodeMail } from '../../Functions/LoginForm/checkCodeMail';
import { checkForgetPassword } from '../../Functions/LoginForm/checkForgetPassword';
import { checkCodeMailPasswordForget } from '../../Functions/LoginForm/checkCodeMailPasswordForget';

import { loginUser } from '../../Functions/CallApi/CallLogin';
import { validateUser, validateUserEmail } from '../../Functions/CallApi/CallUser';
import { generateMailCode, resendMailCode, validateMailCode } from '../../Functions/CallApi/CallMailCode';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);     // Temps avant de pouvoir renvoyer le code de vérification

  const nbCases = 5;
  const CASE_LOGIN = 1;
  const CASE_CODEMAIL = 2;
  const CASE_PASSWDFORGET = 3;
  const CASE_PASSWDFORGETNOMAIL = 4;
  const CASE_RESETPASSWD = 5;

  const [currentCase, setCurrentCase] = useState(CASE_LOGIN);

  /****************************************/
  //    Création des champs du form       //
  /****************************************/

  /*case 1*/
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  /*case 2*/
  const [codeMail, setCodeMail] = useState(Array(5).fill(''));
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef(codeMail.map(() => React.createRef()));

  /*case 3*/
  const [canEmail, setCanEmail] = useState(true);

  /****************************************/
  //    Outils pour les champs forms      //
  /****************************************/

  const handleKeyPress = (event) => {
    if (event.getModifierState('CapsLock')) {
      setIsCapsLockOn(true);
    } else {
      setIsCapsLockOn(false);
    }
  };


  /****************************************/
  //    Gestion des différents forms      //
  /****************************************/

  const nextCase = () => {
    if (currentCase < nbCases) {
      setCurrentCase(currentCase + 1);
      consoleLog(`passage à Case : ${currentCase + 1}`, 'cyan');
      window.scrollTo(0, 0);
    }
  };

  const skipCase = (Case) => {
    consoleLog(`passage à Case : ${Case}`, 'cyan');
    if (Case <= nbCases) {
      setCurrentCase(Case);
      window.scrollTo(0, 0);
    }
  };

  const renderCaseTransition = () => {
    return (
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={currentCase}
          addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
          classNames="fade"
        >
          <div>
            {renderCase(currentCase)}
          </div>
        </CSSTransition>
      </SwitchTransition>
    );
  };

  useEffect(() => {
    consoleLog(`Case actuelle : ${currentCase}`, 'cyan');
  }, [currentCase]);

  const renderCase = () => {
    switch (currentCase) {
      // Informations de connexion
      case 1:
        return (
          <>
            <div className="mb-4 text-2xl font-bold text-gray-800">Informations de connexion</div>
            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 mt-5" htmlFor="email">
                Adresse e-mail
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                placeholder="email@email.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Mot de passe
              </label>
              <input
                className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="••••••••••••"
                onKeyDown={handleKeyPress}
              />
              {isCapsLockOn && (
                <p className="text-red-500 text-xs italic">Attention : la touche majuscule est activée !</p>
              )}
            </div>
            <div className='mb-6'>
              <button
                onClick={handleForgetPassword}
                className={`text-blue-500 text-sm font-bold mb-2 ${isButtonDisabled ? 'text-gray-500' : 'text-blue-500'}`}
                type="button"
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div className="flex items-center justify-between">
              <Link
                to="/register"
                className={`text-blue-500 text-sm font-bold mb-2 ${isButtonDisabled ? 'text-gray-500' : 'text-blue-500'}`}
                type="button"
              >
                Créer un compte
              </Link>
              <button disabled={loading} onClick={handleCheckLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                {loading ? 'Chargement...' : 'Continuer'}
              </button>
            </div>

            {
              Object.values(errors).filter(error => error).length > 0 && (
                <ul className='mt-5 p-2 bg-red-500 text-black rounded-lg' style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                  {Object.values(errors).map((error, index) => (
                    error && <li key={index}>{error}</li>
                  ))}
                </ul>
              )
            }
          </>
        );
      // Code de vérification par mail
      case 2:
        return (
          <>
            <div className="mb-4 text-2xl font-bold text-gray-800">Vérification de connexion</div>
            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            <span className="text-gray-700 text-sm font-bold mb-2">Un code de vérification vous a été envoyé par mail à l'adresse suivante : </span> <span className="text-blue-500 text-sm font-bold mb-2"> {email} </span>
            {/* Code de vérif */}
            <div className="mt-5 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="codeMail">
                Code :
              </label>
              <div className="flex justify-center">
                {codeMail.map((value, index) => (
                  <input
                    key={index}
                    ref={inputRefs.current[index]}
                    className="code-input shadow appearance-none border rounded w-12 h-12 py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline m-1 text-center text-lg"
                    type="text"
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleChangeCodeMail(index, e.target.value, e)}
                    onKeyDown={(e) => handleChangeCodeMail(index, e.target.value, e)}
                    onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }}
                    placeholder="0"
                  />
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={resendEmail}
                  className={`text-blue-500 text-sm font-bold mb-2 ${isButtonDisabled ? 'text-gray-500' : 'text-blue-500'}`}
                  type="button"
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled ? (
                    <>
                      <span>Le code a été renvoyé à {email}</span>
                      <br />
                      <span>Renvoyer dans {countdown}s</span>
                    </>
                  ) : (
                    'Renvoyer le code'
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => skipCase(CASE_LOGIN)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Retour
              </button>
              <button disabled={loading} onClick={handleCheckCodeMail} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                {loading ? 'Chargement...' : 'Confirmer'}
              </button>
            </div>
            {
              Object.values(errors).filter(error => error).length > 0 && (
                <ul className='mt-5 p-2 bg-red-500 text-black rounded-lg' style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                  {Object.values(errors).map((error, index) => (
                    error && <li key={index}>{error}</li>
                  ))}
                </ul>
              )
            }
          </>
        );
      // mot de passe oublié
      case 3:
        return (
          <>
            <div className="mb-4 text-2xl font-bold text-gray-800">Informations personnelles</div>
            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            <span className="text-gray-700 text-sm font-bold mb-2"><span className="text-blue-500 text-sm font-bold mb-2">Si le compte existe</span>, un code de vérification sera envoyé par mail à l'adresse suivante : </span> <span className="text-blue-500 text-sm font-bold mb-2"> {email} </span>
            <br /><br />
            <span className="text-gray-700 text-sm font-bold mb-2"> Vous serez mené par la suite à <span className="text-blue-500 text-sm font-bold mb-2">rénitialiser votre mot de passe</span>.</span>
            {/* Code de vérif */}
            <div className="mt-5 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="codeMail">
                Code :
              </label>
              <div className="flex justify-center">
                {codeMail.map((value, index) => (
                  <input
                    key={index}
                    ref={inputRefs.current[index]}
                    className="code-input shadow appearance-none border rounded w-12 h-12 py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline m-1 text-center text-lg"
                    type="text"
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleChangeCodeMail(index, e.target.value, e)}
                    onKeyDown={(e) => handleChangeCodeMail(index, e.target.value, e)}
                    onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }}
                    placeholder="0"
                  />
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={resendEmail}
                  className={`text-blue-500 text-sm font-bold mb-2 ${isButtonDisabled ? 'text-gray-500' : 'text-blue-500'}`}
                  type="button"
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled ? (
                    <>
                      <span>Le code a été renvoyé à {email}</span>
                      <br />
                      <span>Renvoyer dans {countdown}s</span>
                    </>
                  ) : (
                    'Renvoyer le code'
                  )}
                </button>

              </div>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => skipCase(CASE_LOGIN)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Retour
              </button>
              <button disabled={loading} onClick={handleCheckEmailPasswordForget} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                {loading ? 'Chargement...' : 'Confirmer'}

              </button>
            </div>
            {
              Object.values(errors).filter(error => error).length > 0 && (
                <ul className='mt-5 p-2 bg-red-500 text-black rounded-lg' style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                  {Object.values(errors).map((error, index) => (
                    error && <li key={index}>{error}</li>
                  ))}
                </ul>
              )
            }
          </>
        );
      // oublie de mail dans le form
      case 4:
        return (
          <>
            <div className="mb-4 text-2xl font-bold text-gray-800">Oubli du mot de passe</div>
            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Adresse e-mail
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                placeholder="email@email.com"
                defaultValue={email}
              />
            </div>


            <div className="flex items-center justify-between">
              <button onClick={() => skipCase(CASE_LOGIN)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Retour
              </button>
              <button disabled={loading} onClick={handleForgetPassword} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                {loading ? 'Chargement...' : 'Confirmer'}
              </button>
            </div>
            {
              Object.values(errors).filter(error => error).length > 0 && (
                <ul className='mt-5 p-2 bg-red-500 text-black rounded-lg' style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                  {Object.values(errors).map((error, index) => (
                    error && <li key={index}>{error}</li>
                  ))}
                </ul>
              )
            }
          </>
        );
      // Réinitialisation du mot de passe
      case 5:
        return (
          <>
            <div className="mb-4 text-2xl font-bold text-gray-800">Réinitialisation du mot de passe</div>
            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Nouveau mot de passe
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="••••••"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Confirmer le mot de passe
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => skipCase(CASE_LOGIN)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Retour
              </button>
              <button disabled={loading} onClick={handleCheckResetPassword} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                {loading ? 'Chargement...' : 'Confirmer'}
              </button>
            </div>
            {
              Object.values(errors).filter(error => error).length > 0 && (
                <ul className='mt-5 p-2 bg-red-500 text-black rounded-lg' style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                  {Object.values(errors).map((error, index) => (
                    error && <li key={index}>{error}</li>
                  ))}
                </ul>
              )
            }
          </>
        );


      default:
        return <div>Un problème est survenu recharger la page</div>;
    }
  };

  /****************************************/
  //    Code de vérification par mail     //
  /****************************************/

  const handleChangeCodeMail = (index, value, e) => {
    // Mise à jour de codeMail avec la nouvelle valeur
    const newCodeMail = [...codeMail];
    newCodeMail[index] = value;
    setCodeMail(newCodeMail);

    // Gestion du focus basée sur la touche pressée et la valeur de l'input
    if (e.key === 'Backspace' && value === '') {
      // Focus sur l'input précédent si l'input actuel est vide et Backspace est pressé
      if (index > 0) {
        const previousInputRef = inputRefs.current[index - 1];
        previousInputRef?.current?.focus();
      }
    } else if (value && index < codeMail.length - 1) {
      // Focus sur l'input suivant si une valeur est entrée
      const nextInputRef = inputRefs.current[index + 1];
      nextInputRef?.current?.focus();
    }
  };

  const getFullCode = () => codeMail.join('');

  const resendEmail = () => {
    if (canResend) {
      consoleLog('• [START] resendEmail', 'white');
      setCodeMail(['', '', '', '', '']);
      if(canEmail){
        consoleLog('Renvoi de l\'email...', 'cyan');
        resendMailCode({ mailcode_email: email });
      } else {
        consoleLog('canEmail = false, pas de renvoi de mail', 'red');
      }
      setCanResend(false);
      setIsButtonDisabled(true); // Désactive le bouton
      let timer = 30;
      setCountdown(timer);
      consoleLog('• [END] resendEmail', 'white');
      const interval = setInterval(() => {
        timer -= 1;
        setCountdown(timer);
        if (timer === 0) {
          clearInterval(interval);
          setIsButtonDisabled(false); // Réactive le bouton
          setCanResend(true);
        }
      }, 1000);
    }
  };

  /****************************************/
  //    Vérification des forms            //
  /****************************************/

  // Case 1
  const handleCheckLogin = () => {
    checkStepLogin({
      setEmail,
      setPassword,
      validateUser,
      generateMailCode,
      setCanEmail,
      nextCase,
      setLoading,
      setErrors
    });
  };

  // Case 2
  const handleCheckCodeMail = async () => {
    checkCodeMail({
      setLoading,
      setErrors,
      getFullCode,
      validateMailCode,
      navigate,
      email,
      password,
      navigate,
      loginUser
    });
  };

  // Case 3
  const handleForgetPassword = () => {
    checkForgetPassword({
      setLoading,
      generateMailCode,
      validateUserEmail,
      setEmail,
      setCanEmail,
      CASE_PASSWDFORGETNOMAIL,
      CASE_PASSWDFORGET,
      skipCase
    })

  };

  // Case 3-5
  const handleCheckEmailPasswordForget = () => {
    checkCodeMailPasswordForget({
      setLoading,
      setErrors,
      getFullCode,
      validateMailCode,
      CASE_RESETPASSWD,
      email,
      password,
      skipCase
    });
  };

  const handleCheckResetPassword = () => {
    console.log('Réinitialisation du mot de passe...');
  }


  useEffect(() => {
    // Démarre un minuteur de 30 secondes au montage du composant
    const timer = setTimeout(() => {
      setCanResend(true); // Active le bouton après 30 secondes
    }, 30000); // 30000 millisecondes = 30 secondes

    return () => clearTimeout(timer); // Nettoie le minuteur si le composant est démonté avant la fin
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 pt-16">
      <div className="w-full max-w-md mt-5 mb-5 mx-auto form-container pb-12">
        <TitlePart title="Connexion" />
        <div className="w-full max-w-md mt-5 mb-5 mx-auto form-container pb-12">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

            {renderCaseTransition()}

          </form>

        </div>
      </div>
    </div>

  );
}
