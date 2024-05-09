import React from 'react'
import TitlePart from '../TitlePart/TitlePart'
import Card from '../Card/Card'

export default function WhyVcloud() {
    return (
        <section className="bg-white border-b py-8">
            <div className="container mx-auto flex flex-wrap pt-4 pb-12">

                <TitlePart title="Pourquoi VCloud ?" />

                <Card
                    pretitle="Notre sécurité"
                    title="Une protection maximale"
                    description="Nous mettons tout en oeuvre pour garantir la sécurité de vos données et de vos projets grâce à des solutions de chiffrement de pointe."
                    action="En savoir plus"
                    position="start"
                />

                <Card
                    pretitle="Notre qualité"
                    title="Une performance inégalée"
                    description="Nous vous offrons des services de qualité, performants et fiables pour vous permettre de travailler en toute sérénité."
                    action="En savoir plus"
                    position="center"
                />

                <Card
                    pretitle="Notre interface"
                    title="Garder un visuel sur vos projets"
                    description="Notre interface intuitive vous permet de visualiser vos projets en temps réel et de les partager avec vos collaborateurs."
                    action="En savoir plus"
                    position="end"
                />

            </div>
        </section>
    )
}
