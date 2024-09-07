import React from 'react';
import Switch from '@mui/material/Switch';

export default function Profile_Settings() {
  return (
    <div className="relative flex flex-col h-full min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
      <div className="p-4 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl">
        <h6 className="mb-0">Platform Settings</h6>
      </div>
      <div className="flex-auto p-4">
        <h6 className="font-bold leading-tight uppercase text-xs text-slate-500">Account</h6>
        <ul className="flex flex-col pl-0 mb-0 rounded-lg">
          <li className="relative block px-0 py-2 bg-white border-0 rounded-t-lg text-inherit">
            <div className="min-h-6 mb-0.5 block pl-0">
              <Switch defaultChecked />
              <label
                htmlFor="follow"
                className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
              >
                Email me when someone follows me
              </label>
            </div>
          </li>
          <li className="relative block px-0 py-2 bg-white border-0 text-inherit">
            <div className="min-h-6 mb-0.5 block pl-0">
              <Switch />
              <label
                htmlFor="answer"
                className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
              >
                Email me when someone answers on my post
              </label>
            </div>
          </li>
          <li className="relative block px-0 py-2 bg-white border-0 rounded-b-lg text-inherit">
            <div className="min-h-6 mb-0.5 block pl-0">
              <Switch defaultChecked />
              <label
                htmlFor="mention"
                className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
              >
                Email me when someone mentions me
              </label>
            </div>
          </li>
        </ul>
        <h6 className="mt-6 font-bold leading-tight uppercase text-xs text-slate-500">Application</h6>
        <ul className="flex flex-col pl-0 mb-0 rounded-lg">
          <li className="relative block px-0 py-2 bg-white border-0 rounded-t-lg text-inherit">
            <div className="min-h-6 mb-0.5 block pl-0">
              <Switch />
              <label
                htmlFor="launches-projects"
                className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
              >
                New launches and projects
              </label>
            </div>
          </li>
          <li className="relative block px-0 py-2 bg-white border-0 text-inherit">
            <div className="min-h-6 mb-0.5 block pl-0">
              <Switch defaultChecked />
              <label
                htmlFor="product-updates"
                className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
              >
                Monthly product updates
              </label>
            </div>
          </li>
          <li className="relative block px-0 py-2 pb-0 bg-white border-0 rounded-b-lg text-inherit">
            <div className="min-h-6 mb-0.5 block pl-0">
              <Switch />
              <label
                htmlFor="subscribe"
                className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
              >
                Subscribe to newsletter
              </label>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
