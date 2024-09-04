import React from 'react';

export default function Profile_sub() {
  return (
    <div className="relative flex flex-col h-full min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
      <div className="p-4 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl">
        <h6 className="mb-0 text-center font-bold text-xl">Abonnement Actuel</h6>
      </div>
      <div className="flex-auto p-4">
        {/* Résumé de l'abonnement */}
        <div className="flex flex-col items-center justify-center mb-4">
          <h2 className="font-bold text-2xl">Pro</h2>
          <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 my-2"></div>
          <ul className="text-center">
            <li className="mb-2 text-lg font-medium">100 utilisateurs</li>
            <li className="mb-2 text-lg font-medium">20 Go de stockage</li>
            <li className="mb-2 text-lg font-medium">Support prioritaire</li>
          </ul>
          <div className="text-2xl font-bold mt-4">
            49€<span className="text-base font-normal">/ mois</span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col items-center space-y-4 mt-6">
          <button className="px-4 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700">
            Résilier mon abonnement
          </button>
          <button className="px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Changer mon abonnement
          </button>
        </div>
      </div>
    </div>
  );
}
