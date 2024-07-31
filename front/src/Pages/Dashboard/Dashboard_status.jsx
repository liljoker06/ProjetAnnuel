import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard_status() {
  const [apiStatus, setApiStatus] = useState([
    { name: 'API 1', status: 'Unknown' },
    { name: 'API 2', status: 'Unknown' },
    { name: 'API 3', status: 'Unknown' },
  ]);

  const [serverStatus, setServerStatus] = useState([
    { name: 'Cloud', status: 'Unknown' },
    { name: 'Mail', status: 'Unknown' },
    { name: 'BDD', status: 'Unknown' },
  ]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Operational':
        return 'text-green-500';
      case 'Down':
        return 'text-red-500';
      case 'Unknown':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center">Status du serveur</h2>
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Statut des API</h3>
        <ul className="space-y-2">
          {apiStatus.map((api, index) => (
            <li key={index} className={`flex justify-between ${getStatusClass(api.status)}`}>
              <span>{api.name}</span>
              <span>{api.status}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-2">Statut des serveurs</h3>
        <ul className="space-y-2">
          {serverStatus.map((server, index) => (
            <li key={index} className={`flex justify-between ${getStatusClass(server.status)}`}>
              <span>{server.name}</span>
              <span>{server.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}