import React from 'react'

export default function CardPrice({ title, price, features, action, size }) {
    return (
        <>
            {size === 'small' && (
                <div className="flex flex-col w-5/6 lg:w-1/4 mx-auto lg:mx-0 rounded-none lg:rounded-l-lg bg-white mt-4">
                    <div className="flex-1 bg-white text-gray-600 rounded-t rounded-b-none overflow-hidden shadow">
                        <div className="p-8 text-3xl font-bold text-center border-b-4">
                            {title}
                        </div>
                        <ul className="w-full text-center text-sm">
                            {features.map((feature, index) => (
                                <li key={index} className="border-b py-4">{feature}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden shadow p-6">
                        <div className="w-full pt-6 text-3xl text-gray-600 font-bold text-center">
                            {price}€
                            <span className="text-base">/ utilisateur</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <button className="mx-auto lg:mx-0 hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
                                {action}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {size === 'big' && (

                <div className="flex flex-col w-5/6 lg:w-1/3 mx-auto lg:mx-0 rounded-lg bg-white mt-4 sm:-mt-6 shadow-lg z-10">

                    <div className="flex-1 bg-white rounded-t rounded-b-none overflow-hidden shadow">

                        <div className="w-full p-8 text-3xl font-bold text-center">
                            {title}
                        </div>

                        <div className="h-1 w-full gradient my-0 py-0 rounded-t"></div>

                        <ul className="w-full text-center text-base font-bold">
                            {features.map((feature, index) => (
                                <li key={index} className="border-b py-4">{feature}</li>
                            ))}
                        </ul>

                    </div>


                    <div className="flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden shadow p-6">

                        <div className="w-full pt-6 text-4xl font-bold text-center">
                            {price}€
                            <span className="text-base">/ utilisateur</span>
                        </div>

                        <div className="flex items-center justify-center">
                            <button className="mx-auto lg:mx-0 hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
                                {action}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}
