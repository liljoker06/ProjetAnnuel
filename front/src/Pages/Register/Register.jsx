import React, { useState, useEffect, useRef } from 'react';
import TitlePart from '../../Components/TitlePart/TitlePart';
import ProgressBar from "@ramonak/react-progress-bar";
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import './Register.css';

export default function Register() {
  const [progress, setProgress] = useState(25);       // En %
  const [currentStep, setCurrentStep] = useState(1);  // Étape actuelle du formulaire
  const [countdown, setCountdown] = useState(30);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const nbSteps = 3;                                  // Nombre de formulaire à remplir

  /****************************************/
  //    Création des champs du form       //
  /****************************************/

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [jour, setJour] = useState('');
  const [mois, setMois] = useState('');
  const [annee, setAnnee] = useState('');
  const [adresse, setAdresse] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [ville, setVille] = useState('');

  const [email, setEmail] = useState('');
  const [codeMail, setCodeMail] = useState(Array(5).fill(''));
  const [canResend, setCanResend] = useState(false); // Contrôle l'activation du bouton de renvoi

  const inputRefs = useRef(codeMail.map(() => React.createRef()));

  /****************************************/
  //    Gestion des différents forms      //
  /****************************************/

  const nextStep = () => {
    if (currentStep < nbSteps) {
      setCurrentStep(currentStep + 1);
      setProgress(Math.round(((currentStep + 1) / nbSteps) * 100)); // Calcul du pourcentage de progression sans décimale
      //clear and set the value of the input
      window.scrollTo(0, 0);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setProgress(Math.round(((currentStep - 1) / nbSteps) * 100)); // Calcul du pourcentage de progression sans décimale
      window.scrollTo(0, 0);
    }
  }

  const renderStepTransition = () => {
    return (
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={currentStep}
          addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
          classNames="fade"
        >
          <div>
            {renderStep(currentStep)}
          </div>
        </CSSTransition>
      </SwitchTransition>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="mb-4 text-2xl font-bold text-gray-800">Informations personnelles</div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="email@email.com" />
            </div>

            {/* Téléphone */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Téléphone
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="tel" placeholder="+33" />
            </div>

            {/* Mot de passe */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Mot de passe
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="••••••••••••" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Confirmer le mot de passe
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="••••••••••••" />
            </div>

            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            {/* Nom et prénom */}
            <div className="mb-4 flex justify-between gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nom">
                  Nom
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="nom" type="text" placeholder="Nom" />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prenom">
                  Prénom
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="prenom" type="text" placeholder="Prénom" />
              </div>
            </div>

            {/* Date de naissance */}
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Birth">Date de naissance</label>
            <div className="mb-4 flex justify-between gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jour">
                  Jour
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="jour" type="number" placeholder="JJ" min="1" max="31" />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mois">
                  Mois
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="mois" type="number" placeholder="MM" min="1" max="12" />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="annee">
                  Année
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="annee" type="number" placeholder="AAAA" min="1900" max="2023" />
              </div>
            </div>

            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            {/* Adresse */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adresse">
                Adresse
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="adresse" type="text" placeholder="Numéro, Rue, Allée" />
            </div>

            {/* Code postal et ville */}
            <div className="mb-4 flex justify-between gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nom">
                  Code postal
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="nom" type="text" placeholder="00000" />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prenom">
                  Ville
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="prenom" type="text" placeholder="Ville" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={nextStep} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Suivant
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <>
            <div className="mb-4 text-2xl font-bold text-gray-800">Informations personnelles</div>

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
              <button onClick={previousStep} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Retour
              </button>
              <button onClick={nextStep} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Confirmer
              </button>
            </div>
          </>
        );
      // Ajoutez plus de cas si nécessaire
      default:
        return <div>Un problème est survenu recharger la page</div>;
    }
  };


  /****************************************/
  //    Code de vérification par mail     //
  /****************************************/
  const handleChangeCodeMail = (index, value, e) => {
    const newCodeMail = [...codeMail];
    newCodeMail[index] = value;
    setCodeMail(newCodeMail);

    if (value && index < codeMail.length - 1) {
      inputRefs.current[index + 1].current.focus();
    }
    if (e.key === 'Backspace' && value === '') {
      // Si l'input actuel est vide et que l'utilisateur appuie sur Backspace, déplacez le focus à l'input précédent
      if (index > 0) {
        const previousInputRef = inputRefs.current[index - 1];
        if (previousInputRef && previousInputRef.current) {
          previousInputRef.current.focus();
        }
      }
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

  useEffect(() => {
    // Démarre un minuteur de 30 secondes au montage du composant
    const timer = setTimeout(() => {
      setCanResend(true); // Active le bouton après 30 secondes
    }, 30000); // 30000 millisecondes = 30 secondes

    return () => clearTimeout(timer); // Nettoie le minuteur si le composant est démonté avant la fin
  }, []);

  /****************************************/

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <TitlePart title="Inscription" />

      <div className="w-full max-w-md mt-5">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {renderStepTransition()}
        </form>
        <ProgressBar
          completed={progress}
          barContainerClassName="w-full bg-gray-200 rounded-full dark:bg-gray-700"
        />
      </div>
    </div>
  );
}