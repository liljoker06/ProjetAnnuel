import React, { useState, useEffect, useRef } from 'react';
import TitlePart from '../../Components/TitlePart/TitlePart';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { NavLink, useNavigate } from 'react-router-dom';

import consoleLog from '../../Functions/Dev/consoleLog';

import { checkStepLogin } from '../../Functions/LoginForm/checkStepLogin';
import { checkCodeMail } from '../../Functions/LoginForm/checkCodeMail';

import { loginUser } from '../../Functions/CallApi/CallLogin';
import { validateUser } from '../../Functions/CallApi/CallUser';
import { generateMailCode, resendMailCode, validateMailCode } from '../../Functions/CallApi/CallMailCode';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);     // Temps avant de pouvoir renvoyer le code de vérification

  const nbCases = 4;
  const CASE_LOGIN = 1;
  const CASE_EMAIL = 2;
  const CASE_PASSWDFORGET = 3;
  const CASE_PASSWDFORGETNOMAIL = 4;

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
  const newUser = () => {
    navigate('/register');
  };



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
                onClick={forgetPassword}
                className={`text-blue-500 text-sm font-bold mb-2 ${isButtonDisabled ? 'text-gray-500' : 'text-blue-500'}`}
                type="button"
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={newUser}
                className={`text-blue-500 text-sm font-bold mb-2 ${isButtonDisabled ? 'text-gray-500' : 'text-blue-500'}`}
                type="button"
              >
                Créer un compte
              </button>
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
              <button onClick={handleCheckCodeMail} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
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
      // Oubli du mot de passe avec email dans le form
      case 3:
        return (
          <>
            <div className="mb-4 text-2xl font-bold text-gray-800">Informations personnelles</div>
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
              {/* <button onClick={checkCodeEmail} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                {loading ? 'Chargement...' : 'Confirmer'}

              </button> */}
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
      // Oubli du mot de passe sans email dans le form
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
              <button onClick={handleCheckEmailPasswordForget} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
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

  const forgetPassword = () => {
    console.log('Mot de passe oublié...');
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!email || (email && !emailRegex.test(email))) {
      console.log('Aucune adresse e-mail renseignée.');
      skipCase(CASE_PASSWDFORGETNOMAIL);
    } else {
      console.log('Vérification terminée.');
      console.log('Email : ' + email);
      setEmail(email);
      skipCase(CASE_PASSWDFORGET);

    }
  };

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
      console.log('Renvoi de l\'email...');
      setCanResend(false);
      setIsButtonDisabled(true); // Désactive le bouton
      let timer = 30;
      setCountdown(timer);
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

  const handleCheckLogin = () => {
    checkStepLogin({
      setEmail,
      setPassword,
      validateUser,
      generateMailCode,
      nextCase,
      setLoading,
      setErrors
    });
  };

  const handleCheckCodeMail = async () => {
    checkCodeMail({
      setLoading,
      setErrors,
      getFullCode,
      validateMailCode,
      email,
      password,
      loginUser
    });
  };

  const handleCheckEmailPasswordForget = () => {
  };


  // const checkEmailPasswordForget = () => {
  //   setLoading(true);
  //   consoleLog('[START] - checkEmailPasswordForget', "cyan");
  //   consoleLog('Vérification des informations de connexion...', 'blue');
  //   const email = document.getElementById('email').value;
  //   const emailResult = checkEmail(email, setLoading);
  //   const newErrors = {};

  //   if (!emailResult.success) {
  //     newErrors.email = emailResult.error;
  //   }

  //   setErrors(newErrors);
  //   setLoading(false);

  //   if (Object.values(newErrors).filter(error => error).length === 0) {
  //     setEmail(document.getElementById('email').value);
  //     skipCase(CASE_PASSWDFORGET);
  //     consoleLog('END : checkEmailPasswordForget', "cyan");
  //   }

  // };

  // const checkLogin = () => {
  //   setLoading(true);
  //   consoleLog('[START] checkLogin', "cyan");
  //   consoleLog('Vérification des informations de connexion...', 'blue');
  //   const email = document.getElementById('email').value;
  //   const password = document.getElementById('password').value;
  //   const newErrors = {};

  //   // Appel des fonctions modifiées sans setErrors
  //   const emailResult = checkEmail(email, setLoading);
  //   const passwordResult = checkPasswd(password, setLoading);

  //   // Mise à jour de newErrors basée sur les résultats
  //   if (!emailResult.success) {
  //     newErrors.email = emailResult.error;
  //   }
  //   if (!passwordResult.success) {
  //     newErrors.password = passwordResult.error;
  //   }

  //   // Vérification s'il y a des erreurs
  //   if (!emailResult.success || !passwordResult.success) {
  //     setLoading(false);
  //     setErrors(newErrors);
  //     return;
  //   }

  //   setLoading(false);
  //   consoleLog('Vérification terminée.', 'blue');
  //   console.log(newErrors);

  //   if (Object.keys(newErrors).length === 0) {
  //     setEmail(email);
  //     setPassword(password);
  //     skipCase(CASE_EMAIL);
  //     consoleLog('END : checkLogin', "cyan");
  //   }
  // };



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
