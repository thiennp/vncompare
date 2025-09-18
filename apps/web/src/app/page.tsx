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
    <main className="min-h-screen relative overflow-hidden">
      {/* Floating Paint Elements */}
      <div className="fixed top-20 left-10 w-3 h-3 bg-paint-red rounded-full animate-float opacity-40 pointer-events-none" style={{animationDelay: '0s'}}></div>
      <div className="fixed top-40 right-20 w-2 h-2 bg-paint-blue rounded-full animate-float opacity-40 pointer-events-none" style={{animationDelay: '1s'}}></div>
      <div className="fixed top-60 left-1/4 w-4 h-4 bg-paint-green rounded-full animate-float opacity-40 pointer-events-none" style={{animationDelay: '2s'}}></div>
      <div className="fixed top-80 right-1/3 w-2 h-2 bg-paint-yellow rounded-full animate-float opacity-40 pointer-events-none" style={{animationDelay: '0.5s'}}></div>
      <div className="fixed top-32 right-1/2 w-3 h-3 bg-paint-purple rounded-full animate-float opacity-40 pointer-events-none" style={{animationDelay: '1.5s'}}></div>
      <div className="fixed bottom-20 left-20 w-2 h-2 bg-paint-pink rounded-full animate-float opacity-40 pointer-events-none" style={{animationDelay: '2.5s'}}></div>
      <div className="fixed bottom-40 right-10 w-3 h-3 bg-paint-orange rounded-full animate-float opacity-40 pointer-events-none" style={{animationDelay: '3s'}}></div>
      
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
