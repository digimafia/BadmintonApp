import { usePageMeta } from '../hooks/usePageMeta'
import { Hero } from '../components/sections/Hero'
import { Services } from '../components/sections/Services'
import { Process } from '../components/sections/Process'
import { ProductShowcase } from '../components/sections/ProductShowcase'
import { WorkPreview } from '../components/sections/WorkPreview'
import { CTABanner } from '../components/sections/CTABanner'
import { Highlights } from '../components/sections/Highlights'
import { WhyUs } from '../components/sections/WhyUs'
import { JoinTeam } from '../components/sections/JoinTeam'

export function Home() {
  usePageMeta({
    title: 'Your Idea. Our Technology.',
    description:
      'Global Tech Byte Private Limited builds custom web applications, enterprise software, and digital products using React, .NET and modern engineering practices.',
  })

  return (
    <>
      <Hero />
      <Services />
      <Process />
      <ProductShowcase />
      <WorkPreview />
      <CTABanner />
      <Highlights />
      <WhyUs />
      <JoinTeam />
    </>
  )
}
