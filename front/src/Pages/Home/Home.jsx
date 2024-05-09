import React from 'react'
import Vitrine from '../../Components/Vitrine/Vitrine'
import Presentation from '../../Components/Presentation/Presentation'
import WhyVcloud from '../../Components/WhyVcloud/WhyVcloud'
import Prices from '../../Components/Prices/Prices'
import EndMsg from '../../Components/EndMsg/EndMsg'

export default function Home() {
  return (
    <>
      <Vitrine />
      <Presentation />
      <WhyVcloud />
      <Prices />
      <EndMsg />
    </>
  )
}
