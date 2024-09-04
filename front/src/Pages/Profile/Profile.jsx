import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Drivebar from '../../Components/Drivebar/Drivebar';

import { getUserInfoByToken } from '../../Functions/CallApi/CallUser';
import Profile_cardinfo from '../../Components/Profile/Profile_cardinfo';
import Profile_information from '../../Components/Profile/Profile_information';
import Profile_Settings from '../../Components/Profile/Profile_Settings';
import Profile_sub from '../../Components/Profile/Profile_sub';

export default function Profil() {
  const navigate = useNavigate();
  const [user_name, setUserName] = useState(null);
  const [user_email, setUserEmail] = useState(null);
  const [abonnement, setAbonnement] = useState(null);
  const [stockage, setStockage] = useState(null);
  const [stockageUsed, setStockageUsed] = useState(null);
  const [numberFiles, setNumberFiles] = useState(null);
  const [company, setCompany] = useState(null);

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
            setUserEmail(userInfo.user_email);
            setAbonnement(userInfo.user_subscription);
            setStockage(userInfo.user_storageTotal);
            setStockageUsed(userInfo.user_storageUsed);
            setNumberFiles(userInfo.user_files);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          navigate('/login');
        });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Drivebar />
      <div className="w-full px-6 py-6 mx-auto loopple-min-height-78vh text-slate-500">
        <Profile_cardinfo user_name={user_name} company={company} />
        <div className="w-full pb-6 mx-auto removable">
          <div className="flex flex-wrap -mx-3">
            {/* Settings Section */}
            <div className="w-full max-w-full px-3 lg:mt-6 xl:w-4/12 mb-4">
              <Profile_Settings user_name={user_name} company={company} />
            </div>
            {/* Information Account Section */}
            <div className="w-full max-w-full px-3 lg:mt-6 xl:w-4/12 mb-4">
              <Profile_information user_name={user_name} company={company} user_email={user_email}/>
            </div>
            {/* Information Subscription Section */}
            <div className="w-full max-w-full px-3 lg:mt-6 xl:w-4/12 mb-4">
              <Profile_sub abonnement={abonnement} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
