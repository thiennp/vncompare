import { Suspense } from 'react'
import HeroSection from '@/components/HeroSection'
import CategorySection from '@/components/CategorySection'
import FeaturedProducts from '@/components/FeaturedProducts'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import NewsletterSignup from '@/components/NewsletterSignup'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
      </Suspense>

      {/* Paint Categories */}
      <Suspense fallback={<LoadingSpinner />}>
        <CategorySection />
      </Suspense>

      {/* Featured Products */}
      <Suspense fallback={<LoadingSpinner />}>
        <FeaturedProducts />
      </Suspense>

      {/* How It Works */}
      <Suspense fallback={<LoadingSpinner />}>
        <HowItWorks />
      </Suspense>

      {/* Testimonials */}
      <Suspense fallback={<LoadingSpinner />}>
        <Testimonials />
      </Suspense>

      {/* Newsletter Signup */}
      <Suspense fallback={<LoadingSpinner />}>
        <NewsletterSignup />
      </Suspense>
    </main>
  )
}
