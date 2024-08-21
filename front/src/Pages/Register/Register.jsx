import React, { useState, useEffect, useRef } from 'react';
import TitlePart from '../../Components/TitlePart/TitlePart';
import ProgressBar from "@ramonak/react-progress-bar";
import { NavLink } from "react-router-dom";

import { CSSTransition, SwitchTransition } from 'react-transition-group';

import './Register.css';
import CardPrice from '../../Components/CardPrice/CardPrice';

export default function Register() {
  const [progress, setProgress] = useState(14);       // En %
  const [countdown, setCountdown] = useState(30);     // Temps avant de pouvoir renvoyer le code de vérification
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({});        // Contient les données du formulaire

  const nbSteps = 7;                                  // Nombre de formulaire à remplir
  const STEP_BASIC = 1;
  const STEP_EMAIL = 2;
  const STEP_COMPANY = 3;
  const STEP_SUBSCRIPTION = 4;
  const STEP_PAYMENT = 5;
  const STEP_CONFIRMATION = 6;
  const STEP_SUCCESS = 7;

  const [currentStep, setCurrentStep] = useState(STEP_BASIC);  // Étape actuelle du formulaire

  /****************************************/
  //    Création des champs du form       //
  /****************************************/

  /*case 1*/
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [birth, setBirth] = useState('');
  const [adresse, setAdresse] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [ville, setVille] = useState('');

  /*case 2*/
  const [codeMail, setCodeMail] = useState(Array(5).fill(''));
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef(codeMail.map(() => React.createRef()));

  /*case 3*/
  const [estEntrepriseExistante, setEstEntrepriseExistante] = useState(false);
  const [codeCompany, setCodeCompany] = useState('');
  const [nomEntreprise, setNomEntreprise] = useState('');
  const [siret, setSiret] = useState('');
  const [adresseEntreprise, setAdresseEntreprise] = useState('');
  const [codePostalEntreprise, setCodePostalEntreprise] = useState('');

  /*case 4*/
  const [plan, setPlan] = useState('');

  /*case 5*/
  const [numCard, setNumCard] = useState('0000000000000000');
  const [nameCard, setNameCard] = useState('');
  const [dateCard, setDateCard] = useState('');
  const [cvvCard, setCvvCard] = useState('');




  /****************************************/
  //    Gestion des différents forms      //
  /****************************************/

  const Auto = () => {
    document.getElementById('email').value = 'test@gmail.com';
    document.getElementById('phone').value = '0606060606';
    document.getElementById('password').value = 'password';
    document.getElementById('confirmPassword').value = 'password';
    document.getElementById('nom').value = 'Doe';
    document.getElementById('prenom').value = 'John';
    document.getElementById('jour').value = '01';
    document.getElementById('mois').value = '01';
    document.getElementById('annee').value = '2000';
    document.getElementById('adresse').value = '1 rue de la rue';
    document.getElementById('cp').value = '75000';
    document.getElementById('city').value = 'Paris';
  }

  const nextStep = () => {
    if (currentStep < nbSteps) {
      setCurrentStep(currentStep + 1);
      setProgress(Math.round(((currentStep + 1) / nbSteps) * 100)); // Calcul du pourcentage de progression sans décimale
      //clear and set the value of the input
      window.scrollTo(0, 0);
    }
  };

  const skipStep = (step) => {
    if (step <= nbSteps) {
      setCurrentStep(step);
      setProgress(Math.round((step / nbSteps) * 100)); // Calcul du pourcentage de progression sans décimale
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

  const formClass = () => {
    return currentStep === STEP_SUBSCRIPTION ? 'w-full lg:w-4/5 mt-5 mb-5 mx-auto form-container pb-12' : 'w-full max-w-md mt-5 mb-5 mx-auto form-container pb-12';
  };

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
          <>
            <div className="mb-4 text-2xl font-bold text-gray-800">Informations personnelles</div>
            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="email@email.com" autoComplete="email" />
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
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="••••••••••••" autoComplete="new-password" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirmer le mot de passe
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline" id="confirmPassword" type="password" placeholder="••••••••••••" autoComplete="new-password" />
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cp">
                  Code postal
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="cp" type="text" placeholder="00000" />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                  Ville
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="city" type="text" placeholder="Ville" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button disabled={loading} onClick={checkStepBasic} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                {loading ? 'Chargement...' : 'Suivant'}
              </button>
              <button onClick={Auto} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Dev
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
      case 2:
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
              <button onClick={checkCodeEmail} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
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
      case 3:
        return (
          <>
            <div className="mb-4 text-2xl font-bold text-gray-800">Informations entreprise</div>
            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            <span className="text-gray-700 text-sm font-bold mb-2">
              <span className=''>
                Entreprise déjà existante ? {estEntrepriseExistante ? 'Oui' : 'Non'}
              </span>

              <label className="switch ml-5">
                <input type="checkbox" onChange={toggleEntrepriseExistante} />
                <span className="slider rounded"></span>
                <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAIG/8QAIxAAAgIABQQDAAAAAAAAAAAAAQMCBAAREiExBUFRcROBsf/EABQBAQAAAAAAAAAAAAAAAAAAAAX/xAAWEQADAAAAAAAAAAAAAAAAAAAAEiL/2gAMAwEAAhEDEQA/AMBTp03dNglMVuttjqnKQ2UPOfntkOThbqVVUJ12BKnogZQZpy+Ucc8knwePWJrWqyqEHVmrTahEBqpbBoAH1n635wt3a9mjN1p8X2pw0qVEbKB/CO/c4OphSVP/2Q==" className="off cursor-pointer" />
                <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAQABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQIEBf/EACMQAAEDAwQDAQEAAAAAAAAAAAQBAgUDESEAEjFBBlFhMkL/xAAUAQEAAAAAAAAAAAAAAAAAAAAF/8QAGBEAAwEBAAAAAAAAAAAAAAAAABIiMUH/2gAMAwEAAhEDEQA/AM+Bg4mS8coRccMOdNG01qVyH/kRvHPKKmMdr8uujPwUTG+NkRpw1AKWCbvHKa2zTGphc9u9p0q+rLqeMl4kSCGkYgtoE0HTahIz3bWGNanPrdyqWzn7p5ibh5CArnyZNMyVLpK0QSkt2BNXtVX+7ol1wuLJiyaHt+6Kyp//2Q==" className="on cursor-pointer	" />
              </label>


            </span>

            <div className="mt-5 mb-4">
              {estEntrepriseExistante ? (
                <>
                  {/* Code de l'entreprise */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="codeCompany">
                      Code de l'entreprise
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="codeCompany" type="number" placeholder="0000000000" />
                  </div>
                </>
              ) : (
                <>
                  {/* Identité entreprise */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nameCompany">
                      Nom de l'entreprise
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="nameCompany" type="text" placeholder="Nom" />
                  </div>

                  {/* SIRET */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="SIRET">
                      SIRET
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="SIRET" type="number" placeholder="000 000 000 00000" />
                  </div>

                  <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

                  {/* Adresse */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adresseCompany">
                      Adresse
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="adresseCompany" type="text" placeholder="Numéro, Rue, Allée" />
                  </div>

                  {/* CP et Ville */}
                  <div className="mb-4 flex justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cpCompany">
                        Code Postale
                      </label>
                      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="cpCompany" type="number" placeholder="00000" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cityCompany">
                        Ville
                      </label>
                      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="cityCompany" type="text" placeholder="Ville" />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button onClick={previousStep} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Retour
              </button>
              <button onClick={checkStepEntreprise} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
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
      case 4:
        return (
          <>
            <div className="mb-4 text-2xl font-bold text-gray-800">Choix du forfait</div>
            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            <div className="flex flex-col sm:flex-row justify-center pt-12 my-12 sm:my-4">

              <CardPrice
                title="Basique"
                price="9"
                features={[
                  '10 utilisateurs',
                  '2 Go de stockage',
                  'Support par email'
                ]}
                size="small"
              />

              <CardPrice
                title="Pro"
                price="49"
                features={[
                  '100 utilisateurs',
                  '20 Go de stockage',
                  'Support prioritaire'
                ]}
                size="small"
              />

              <CardPrice
                title="Business"
                price="99"
                features={[
                  'Illimité',
                  'Illimité',
                  'Support 24/7'
                ]}
                size="small"
              />

            </div>
            <div className="flex flex-col sm:flex-row justify-center pt-6 my-12 sm:my-4">
              <div className="radio-input">
                <label>
                  <input type="radio" id="BasicPlan" name="radio-plan" value="BasicPlan" />
                  <span>Basique</span>
                </label>
                <label>
                  <input type="radio" id="ProPlan" name="radio-plan" value="ProPlan" />
                  <span>Pro</span>
                </label>
                <label>
                  <input type="radio" id="BusinessPlan" name="radio-plan" value="BusinessPlan" />
                  <span>Business</span>
                </label>
                <span className="selection"></span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button onClick={previousStep} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Retour
              </button>
              <button onClick={checkStepForfait} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              {loading ? 'Chargement...' : 'Suivant'}

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
      case 5:
        return (
          <>
            <div className="mb-4 text-2xl font-bold text-gray-800">Paiement</div>
            {plan} - {plan === 'BasicPlan' ? '9€' : plan === 'ProPlan' ? '49€' : '99€'}/mois
            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            {/* Numéro de la carte */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cb">
                Numéro de la carte
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="numCard" type="number" placeholder="0000 0000 0000 0000" />
            </div>

            {/* Nom */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nameCard">
                Nom sur la carte
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="nameCard" type="tel" placeholder="Nom Prénom" />
            </div>

            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            {/* Date et CVV */}
            <div className="mb-4 flex justify-between gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateCard">
                  Date d'expiration
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="dateCard" type="text" placeholder="MM/AA" />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cvvCard">
                  CVV
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="cvvCard" type="number" placeholder="000" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={previousStep} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Retour
              </button>
              <button onClick={checkStepCard} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              {loading ? 'Chargement...' : 'Suivant'}
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
      case 6:
        return (
          <>
            <div className="mb-4 text-2xl font-bold text-gray-800">Confirmation</div>
            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />


            <h2 className='font-bold text-gray-800'>Vos Informations</h2>
            <ul className='list-disc ml-5'>
              <li>{email}</li>
              <li>{phone}</li>
              <li>{nom} {prenom}</li>
              <li>{birth}</li>
              <li>{adresse}</li>
              <li>{codePostal} {ville}</li>
            </ul>
            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            <h2 className='font-bold text-gray-800'>Informations entreprise</h2>
            <ul className='list-disc ml-5'>
              {estEntrepriseExistante ? (
                <li>Entreprise par code ({codeCompany})</li>
              ) : (
                <>
                  <li>{nomEntreprise}</li>
                  <li>{siret}</li>
                  <li>{adresseEntreprise}</li>
                  <li>{codePostalEntreprise}</li>
                </>
              )}
            </ul>
            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            <h2 className='font-bold text-gray-800'>Forfait</h2>
            <ul className='list-disc ml-5'>
              {estEntrepriseExistante ? (
                <li>Géré par l'entreprise</li>
              ) : (
                <li>{plan}</li>
              )}
            </ul>
            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            <h2 className='font-bold text-gray-800'>Paiement</h2>
            <ul className='list-disc ml-5'>
              {estEntrepriseExistante ? (
                <li>Géré par l'entreprise</li>
              ) : (
                <>
                  <li>{'•'.repeat(numCard.length - 4) + numCard.slice(-4).replace(/(.{4})/g, '$1 ')}</li>
                  <li>{nameCard}</li>
                  <li>{dateCard}</li>
                  <li>•••</li>
                </>
              )}

            </ul>


            <div className="flex items-center justify-between mt-5">
              <button onClick={previousStep} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Retour
              </button>
              {estEntrepriseExistante ? (
                <button onClick={nextStep} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                  Rejoindre
                </button>
              ) : (
                <>
                  <button onClick={checkPayment} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                  {loading ? 'Chargement...' : `S'abonner pour ${plan === 'BasicPlan' ? '9€' : plan === 'ProPlan' ? '49€' : '99€'}/mois`}
                  </button>
                </>
              )}

            </div>
          </>
        );
      case 7:
        return (
          <>
            <div className="mb-4 text-2xl font-bold text-gray-800">Succès</div>
            <hr className="my-4 border rounded rounded-full h-1.5 dark:bg-blue-500" />

            <div className="flex items-center justify-center">
              <div className="text-green-500 text-4xl font-bold">✔</div>
            </div>

            {!estEntrepriseExistante ? (
              <>
                <div className="text-center text-gray-800">
                  <p>Votre paiement a bien été effectué.</p>
                  <p>Vous allez recevoir un<span className="text-blue-500"> email de confirmation</span> dans quelques instants.</p>
                  <br />
                  <p>Si vous vous êtes inscrit en tant que entreprise, vous retrouverez votre <span className="text-blue-500"> Code d'invitation</span> sur votre email</p>
                  <br />
                  <NavLink to='/login' className="mt-5 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Se connecter</NavLink>
                </div>
              </>
            ) : (
              <>
                <div className="text-center text-gray-800">
                  <p>Vous êtes inscrit lié à l'entreprise XXX.</p>
                  <br />
                  <NavLink to='/login' className="mt-5 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Se connecter</NavLink>
                </div>
              </>
            )}
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
  //    Informations entreprise           //
  /****************************************/

  const toggleEntrepriseExistante = () => {
    setEstEntrepriseExistante(!estEntrepriseExistante);
    setNomEntreprise('');
    setSiret('');
    setAdresseEntreprise('');
    setCodePostalEntreprise('');
  };

  /****************************************/
  //    Vérification des forms            //
  /****************************************/

  const checkStepBasic = () => {
    setLoading(true);
    console.log('Vérification des champs...');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    const newErrors = {};

    //Verifier champs vides
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const jour = document.getElementById('jour').value;
    const mois = document.getElementById('mois').value;
    const annee = document.getElementById('annee').value;
    const adresse = document.getElementById('adresse').value;
    const codePostal = document.getElementById('cp').value;
    const ville = document.getElementById('city').value;

    // Vérification de la présence
    newErrors.email = !email ? 'Email requis.' : '';
    newErrors.phone = !phone ? 'Téléphone requis.' : '';
    newErrors.password = !password ? 'Mot de passe requis.' : '';
    newErrors.confirmPassword = !confirmPassword ? 'Confirmation de mot de passe requis.' : '';
    newErrors.nom = !nom ? 'Nom requis.' : '';
    newErrors.prenom = !prenom ? 'Prénom requis.' : '';
    newErrors.jour = !jour ? 'Jour de naissance requis.' : '';
    newErrors.mois = !mois ? 'Mois de naissance requis.' : '';
    newErrors.annee = !annee ? 'Année de naissance requise.' : '';
    newErrors.adresse = !adresse ? 'Adresse requise.' : '';
    newErrors.codePostal = !codePostal ? 'Code postal requis.' : '';
    newErrors.ville = !ville ? 'Ville requise.' : '';

    // Validation du contenu (seulement si le champ est rempli)
    if (email && !emailRegex.test(email)) newErrors.email = 'Email invalide.';
    if (phone && !phoneRegex.test(phone)) newErrors.phone = 'Numéro de téléphone invalide.';
    if (password && password.length < 6) newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
    if (confirmPassword && password !== confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
    if (jour && (jour < 1 || jour > 31)) newErrors.jour = 'Jour invalide.';
    if (mois && (mois < 1 || mois > 12)) newErrors.mois = 'Mois invalide.';
    if (annee && (annee < 1900 || annee > 2023)) newErrors.annee = 'Année invalide.';
    if (codePostal && codePostal.length !== 5) newErrors.codePostal = 'Code postal invalide.';

    setErrors(newErrors); // Met à jour l'état des erreurs
    setLoading(false); // Termine le chargement
    console.log('Vérification terminée.');
    console.log(newErrors);

    if (Object.values(newErrors).filter(error => error).length === 0) {
      // Si aucune erreur n'est trouvée, enregistrer les données et passer à l'étape suivante
      setEmail(email);
      setPhone(phone);
      setPassword(password);
      setNom(nom);
      setPrenom(prenom);
      setBirth(`${jour}/${mois}/${annee}`);
      setAdresse(adresse);
      setCodePostal(codePostal);
      setVille(ville);
      console.log(email, phone, password, nom, prenom, `${jour}/${mois}/${annee}`, adresse, codePostal, ville);

      nextStep();
    }
  };

  const checkCodeEmail = () => {
    setLoading(true);
    console.log('Vérification du code de vérification...');
    const newErrors = {};

    // Vérification de la présence
    const code = getFullCode();
    console.log("code : " + code);
    newErrors.codeMail = code.length !== 5 ? 'Code invalide.' : '';
    console.log("codeMail : " + codeMail);

    setErrors(newErrors); // Met à jour l'état des erreurs
    setLoading(false); // Termine le chargement
    console.log('Vérification terminée.');
    console.log(newErrors);

    if (Object.values(newErrors).filter(error => error).length === 0) {
      nextStep();
    }
  };

  const checkStepEntreprise = () => {
    setLoading(true);
    console.log('Vérification des champs entreprise...');
    const newErrors = {};

    if (estEntrepriseExistante) {
      const codeCompany = document.getElementById('codeCompany').value;
      newErrors.codeCompany = !codeCompany ? 'Code de l\'entreprise requis.' : '';
      if (codeCompany && codeCompany.length !== 10) newErrors.codeCompany = 'Code de l\'entreprise invalide.';
      setErrors(newErrors);
      setLoading(false);
      console.log(newErrors);
      console.log('Vérification terminée.');



      if (Object.values(newErrors).filter(error => error).length === 0) {
        setCodeCompany(codeCompany);

        skipStep(6);
        // nextStep();

      }

    }
    else {
      const nomEntreprise = document.getElementById('nameCompany').value;
      const siret = document.getElementById('SIRET').value;
      const adresseEntreprise = document.getElementById('adresseCompany').value;
      const codePostalEntreprise = document.getElementById('cpCompany').value;
      const cityCompany = document.getElementById('cityCompany').value;

      newErrors.nomEntreprise = !nomEntreprise ? 'Nom de l\'entreprise requis.' : '';
      newErrors.siret = !siret ? 'SIRET requis.' : '';
      newErrors.adresseEntreprise = !adresseEntreprise ? 'Adresse de l\'entreprise requise.' : '';
      newErrors.codePostalEntreprise = !codePostalEntreprise ? 'Code postal de l\'entreprise requis.' : '';
      newErrors.cityCompany = !cityCompany ? 'Ville de l\'entreprise requise.' : '';

      if (siret && siret.length !== 14) newErrors.siret = 'SIRET invalide.';
      if (codePostalEntreprise && codePostalEntreprise.length !== 5) newErrors.codePostalEntreprise = 'Code postal invalide.';

      setErrors(newErrors);
      setLoading(false);
      console.log('Vérification terminée.');

      if (Object.values(newErrors).filter(error => error).length === 0) {
        setNomEntreprise(nomEntreprise);
        setSiret(siret);
        setAdresseEntreprise(adresseEntreprise);
        setCodePostalEntreprise(codePostalEntreprise);
        nextStep();
      }
    }
  }

  const checkStepForfait = () => {
    setLoading(true);
    console.log('Vérification du forfait...');
    const newErrors = {};

    const radioPlan = document.querySelector('input[name="radio-plan"]:checked');
    newErrors.radioPlan = !radioPlan ? 'Forfait requis.' : '';

    setErrors(newErrors);
    setLoading(false);
    console.log(newErrors);
    console.log('Vérification terminée.');

    if (Object.values(newErrors).filter(error => error).length === 0) {
      setPlan(radioPlan.value);
      nextStep();
    }
  }

  const checkStepCard = () => {
    setLoading(true);
    console.log('Vérification du paiement...');
    const newErrors = {};

    const numCard = document.getElementById('numCard').value;
    const nameCard = document.getElementById('nameCard').value;
    const dateCard = document.getElementById('dateCard').value;
    const cvvCard = document.getElementById('cvvCard').value;

    newErrors.numCard = !numCard ? 'Numéro de carte requis.' : '';
    newErrors.nameCard = !nameCard ? 'Nom sur la carte requis.' : '';
    newErrors.dateCard = !dateCard ? 'Date d\'expiration requise.' : '';
    newErrors.cvvCard = !cvvCard ? 'CVV requis.' : '';

    if (numCard && numCard.length !== 16) newErrors.numCard = 'Numéro de carte invalide.';
    if (dateCard && dateCard.length !== 5) newErrors.dateCard = 'Date d\'expiration invalide.';
    if (cvvCard && cvvCard.length !== 3) newErrors.cvvCard = 'CVV invalide.';

    setErrors(newErrors);
    setLoading(false);
    console.log(newErrors);
    console.log('Vérification terminée.');

    if (Object.values(newErrors).filter(error => error).length === 0) {
      setNumCard(numCard);
      setNameCard(nameCard);
      setDateCard(dateCard);
      setCvvCard(cvvCard);
      nextStep();
    }
  }

  const checkPayment = () => {
    setLoading(true);
    nextStep();

    setLoading(false);
  } 

  /****************************************/

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 pt-16">
      <div className={formClass()}>
        <TitlePart title="Inscription" />
        <div className={formClass()}>
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {renderStepTransition()}
          </form>
          <ProgressBar
            completed={progress}
            barContainerClassName="w-full bg-gray-200 rounded-full dark:bg-gray-700"
          />
        </div>
      </div>
    </div>

  );
}