import React from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function Profile_cardinfo({ user_name, company }) {
  return (
    <div className="relative flex flex-col flex-auto min-w-0 p-4 overflow-hidden break-words border-0 shadow-blur rounded-2xl bg-white/80 bg-clip-border mb-4">
      <div className="flex flex-wrap -mx-3">
        <div className="flex-none w-auto max-w-full px-3">
          <div className="text-base ease-soft-in-out h-18.5 w-18.5 relative inline-flex items-center justify-center rounded-xl text-white transition-all duration-200">
            <AccountCircle style={{ fontSize: '80px', color: '#3B82F6' }} />
          </div>
        </div>
        <div className="flex-none w-auto max-w-full px-3 my-auto">
          <div className="h-full">
            <h5 className="mb-1 text-gray-800">{user_name}</h5>
            <p className="mb-0 font-semibold leading-normal text-sm text-gray-700">{company}</p>
          </div>
        </div>
        <div className="w-full max-w-full px-3 mx-auto mt-4 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none lg:w-4/12"></div>
      </div>
    </div>
  );
}
