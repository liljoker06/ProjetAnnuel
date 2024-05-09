import React from 'react'
import TitlePart from '../TitlePart/TitlePart'

export default function Presentation() {
  return (
    <section className="bg-white border-b py-8">
      <div className="container max-w-5xl mx-auto m-8">

        <TitlePart title="Réseau Cloud" />

        {/* Row 1 - Interface */}
        <div className="flex gap-5 flex-col sm:flex-row">
          <div className="w-5/6 sm:w-1/2 p-6">
            <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
              Une interface simple
            </h3>
            <p className="text-gray-600 mb-8">
              En tant qu'architecte, vous avez besoin d'une interface simple et intuitive pour gérer vos projets. VCloud vous offre une interface simple et intuitive pour gérer vos projets.
            </p>
          </div>
          <div className="w-full sm:w-1/2 p-6">
            <img className="w-full sm:h-64 mx-auto" src='./img/presentation1.svg'></img>
          </div>
        </div>

        {/* Row 2 - Gestion */}
        <div className="flex gap-5 flex-col-reverse sm:flex-row">
          <div className="w-full sm:w-1/2 p-6 mt-6">
            <img className="w-full sm:h-64 mx-auto" src='./img/presentation2.svg'></img>

          </div>
          <div className="w-full sm:w-1/2 p-6 mt-6">
            <div className="align-middle">
              <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
                Gestion du stockage
              </h3>
              <p className="text-gray-600 mb-8">
                Votre espace personnel peut être utilisé pour stocker des fichiers, des images, des vidéos, des documents, des fichiers audio, etc. Vous pouvez également partager des fichiers avec d'autres utilisateurs.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
