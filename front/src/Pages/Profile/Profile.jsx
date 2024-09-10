import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Drivebar from '../../Components/Drivebar/Drivebar';

import { getUserInfoByToken } from '../../Functions/CallApi/CallUser';
import Profile_cardinfo from '../../Components/Profile/Profile_cardinfo';
import Profile_information from '../../Components/Profile/Profile_information';
import Profile_Settings from '../../Components/Profile/Profile_Settings';
import Profile_sub from '../../Components/Profile/Profile_sub';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Apartment } from '@mui/icons-material';

export default function Profil() {
  const navigate = useNavigate();
  const [user_name, setUserName] = useState(null);
  const [user_email, setUserEmail] = useState(null);
  const [abonnement, setAbonnement] = useState(null);
  const [codeCompany, setCodeCompany] = useState(null);
  const [company, setCompany] = useState(null);
  const [user_phone, setUser_phone] = useState(null);
  const [user_addre, setUser_addre] = useState(null);
  const [user_city, setUser_city] = useState(null);
  const [user_posta, setUser_posta] = useState(null);
  const [country, setCountry] = useState(null);
  const [user_role, setUserRole] = useState(null);
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  // Vérification de la connexion
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
    } else {
      getUserInfoByToken(token)
        .then((data) => {
          if (!data) {
            navigate('/login');
          } else {
            const userInfo = data.userInfo;
            setUserName(`${userInfo.user_fname} ${userInfo.user_lname}`);
            setCompany(userInfo.user_company);
            setCodeCompany(userInfo.user_codecompany);
            setUserEmail(userInfo.user_email);
            setAbonnement(userInfo.user_subscription);
            setUser_phone(userInfo.user_phone);
            setUser_addre(userInfo.user_addre);
            setUser_city(userInfo.user_city);
            setUser_posta(userInfo.user_posta);
            setCountry(userInfo.user_country);
            setUserRole(userInfo.user_role);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          navigate('/login');
        });
    }
  }, [navigate]);

  const toggleCodeVisibility = () => {
    setIsCodeVisible(!isCodeVisible);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Drivebar />
      <main className="flex-1 p-6">
        <h2 className="text-4xl font-bold mb-4 text-gray-700">Mon Compte</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Profile_cardinfo user_name={user_name} company={company} />
          <div className="relative flex flex-col flex-auto min-w-0 p-4 overflow-hidden break-words border-0 shadow-blur rounded-2xl bg-white/80 bg-clip-border mb-4">
            <div className="flex flex-wrap -mx-3">
              <div className="flex-none w-auto max-w-full px-3">
                <div className="text-base ease-soft-in-out h-18.5 w-18.5 relative inline-flex items-center justify-center rounded-xl text-white transition-all duration-200">
                  <Apartment style={{ fontSize: '80px', color: '#3B82F6' }} />
                </div>
              </div>
              <div className="flex-none w-auto max-w-full px-3 my-auto">
                <div className="h-full">
                  <h5 className="mb-1 text-gray-800">Code de l'entreprise</h5>
                  <p className="mb-0 font-semibold leading-normal text-sm text-gray-700">
                    {isCodeVisible ? codeCompany : '********'}
                  </p>
                </div>
              </div>
              <div className="flex-none w-auto max-w-full px-3 my-auto">
                <button onClick={toggleCodeVisibility} className="text-blue-500 text-2xl">
                  {isCodeVisible ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full pb-6 mx-auto removable">
          <div className="flex flex-wrap -mx-3">
            {/* Settings Section */}
            <div className="w-full max-w-full px-3 lg:mt-6 xl:w-4/12 mb-4">
              <Profile_Settings user_name={user_name} company={company} />
            </div>
            {/* Information Account Section */}
            <div className="w-full max-w-full px-3 lg:mt-6 xl:w-4/12 mb-4">
              <Profile_information
                user_name={user_name}
                company={company}
                user_email={user_email}
                user_phone={user_phone}
                user_addre={user_addre}
                user_city={user_city}
                user_posta={user_posta}
                country={country}
                user_role={user_role}
              />
            </div>
            {/* Information Subscription Section */}
            <div className="w-full max-w-full px-3 lg:mt-6 xl:w-4/12 mb-4">
              <Profile_sub abonnement={abonnement} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}