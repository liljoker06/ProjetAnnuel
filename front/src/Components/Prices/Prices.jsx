import React from 'react'
import TitlePart from '../TitlePart/TitlePart'
import CardPrice from '../CardPrice/CardPrice'

export default function Prices() {
    return (
        <section class="bg-gray-100 py-8">
            <div class="container mx-auto px-2 pt-4 pb-12 text-gray-800">

                <TitlePart title="Tarifs" />


                <div class="flex flex-col sm:flex-row justify-center pt-12 my-12 sm:my-4">

                    <CardPrice
                        title="Basique"
                        price="9"
                        features={[
                            '10 utilisateurs',
                            '2 Go de stockage',
                            'Support par email'
                        ]}
                        action="S'abonner"
                        size="small"
                        link="/register"
                    />

                    <CardPrice
                        title="Pro"
                        price="49"
                        features={[
                            '100 utilisateurs',
                            '20 Go de stockage',
                            'Support prioritaire'
                        ]}
                        action="S'abonner"
                        size="big"
                        link="/register"
                    />

                    <CardPrice
                        title="Business"
                        price="99"
                        features={[
                            'Illimité',
                            'Illimité',
                            'Support 24/7'
                        ]}
                        action="S'abonner"
                        size="small"
                        link="/register"
                    />

                </div>
            </div>
        </section>)
}
