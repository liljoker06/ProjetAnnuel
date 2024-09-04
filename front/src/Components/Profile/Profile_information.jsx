import React from 'react';

export default function Profile_information() {
    return (
        <div className="relative flex flex-col h-full min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="p-4 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl">
                <div className="flex flex-wrap -mx-3">
                    <div className="flex items-center w-full max-w-full px-3 shrink-0 md:w-8/12 md:flex-none">
                        <h6 className="mb-0">Informations du Profil</h6>
                    </div>
                    <div className="w-full max-w-full px-3 text-right shrink-0 md:w-4/12 md:flex-none">
                        <a href="javascript:;" data-target="tooltip_trigger" data-placement="top">
                            <i className="leading-normal fas fa-user-edit text-sm text-slate-400" aria-hidden="true"></i>
                        </a>
                        
                        <div
                            data-target="tooltip"
                            className="px-2 py-1 text-center text-white bg-black rounded-lg text-sm hidden"
                            role="tooltip"
                            style={{
                                position: 'absolute',
                                inset: 'auto auto 0px 0px',
                                margin: '0px',
                                transform: 'translate(1173px, -724px)',
                            }}
                            data-popper-placement="top"
                        >
                            Modifier le profil
                            <div
                                className="invisible absolute h-2 w-2 bg-inherit before:visible before:absolute before:h-2 before:w-2 before:rotate-45 before:bg-inherit before:content-['']"
                                data-popper-arrow=""
                                style={{
                                    position: 'absolute',
                                    left: '0px',
                                    transform: 'translate(0px, 0px)',
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-auto p-4">
                <p className="leading-normal text-sm">Le rôle de votre compte :</p>
                <hr className="h-px my-6 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />
                <ul className="flex flex-col pl-0 mb-0 rounded-lg">
                    <li className="relative block px-4 py-2 pt-0 pl-0 leading-normal bg-white border-0 rounded-t-lg text-sm text-inherit">
                        <strong className="text-slate-700">Nom complet :</strong> &nbsp; Alec M. Thompson
                    </li>
                    <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-sm text-inherit">
                        <strong className="text-slate-700">Mobile :</strong> &nbsp; (44) 123 1234 123
                    </li>
                    <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-sm text-inherit">
                        <strong className="text-slate-700">Email :</strong> &nbsp; alecthompson@mail.com
                    </li>
                    <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-sm text-inherit">
                        <strong className="text-slate-700">Localisation :</strong> &nbsp; USA
                    </li>
                    <li className="relative block px-4 py-2 pb-0 pl-0 bg-white border-0 border-t-0 rounded-b-lg text-inherit">
                        <strong className="leading-normal text-sm text-slate-700">Réseaux sociaux :</strong> &nbsp;
                        <a
                            className="inline-block py-0 pl-1 pr-2 mb-0 font-bold text-center text-blue-800 align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in bg-none"
                            href="javascript:;"
                        >
                            <i className="fab fa-facebook fa-lg" aria-hidden="true"></i>
                        </a>
                        <a
                            className="inline-block py-0 pl-1 pr-2 mb-0 font-bold text-center align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in bg-none text-sky-600"
                            href="javascript:;"
                        >
                            <i className="fab fa-twitter fa-lg" aria-hidden="true"></i>
                        </a>
                        <a
                            className="inline-block py-0 pl-1 pr-2 mb-0 font-bold text-center align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in bg-none text-sky-900"
                            href="javascript:;"
                        >
                            <i className="fab fa-instagram fa-lg" aria-hidden="true"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
