import React from 'react'

export default function TitlePart({ title }) {
    return (
        <>
            {/* Title + Underline */}
            <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
                {title}
            </h2>
            <div className="w-full mb-4">
                <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
            </div>
        </>
    )
}
