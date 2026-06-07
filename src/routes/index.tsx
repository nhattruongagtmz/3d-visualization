import { createFileRoute } from '@tanstack/react-router'
import CategoryShowcase from '../components/CategoryShowcase'
import FeaturedProductsSection from '../components/FeaturedProductsSection'
import HeroBanner from '../components/HeroBanner'
import TrustBadges from '../components/TrustBadges'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main>
      <HeroBanner />
      <FeaturedProductsSection />
      <CategoryShowcase />
      <TrustBadges />
    </main>
  )
}
