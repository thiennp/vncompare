// Tailwind CSS example component

export function TailwindExample() {
  return (
    <div className="container-custom section-padding">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Tailwind CSS Integration
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          This component demonstrates how Tailwind CSS works alongside our CSS
          variables system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 - Using Tailwind classes */}
        <div className="card-hover p-6">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Tailwind Classes
          </h3>
          <p className="text-gray-600 mb-4">
            Using utility classes for rapid development and consistent styling.
          </p>
          <button className="btn-primary">Learn More</button>
        </div>

        {/* Card 2 - Using CSS variables with Tailwind */}
        <div
          className="card p-6"
          style={{
            backgroundColor: 'var(--white)',
            borderColor: 'var(--gray-200)',
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: 'var(--gray-900)' }}
          >
            CSS Variables + Tailwind
          </h3>
          <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
            Combining CSS variables with Tailwind for maximum flexibility.
          </p>
          <button
            className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'var(--white)',
            }}
          >
            Get Started
          </button>
        </div>

        {/* Card 3 - Custom component classes */}
        <div className="card p-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Custom Components
          </h3>
          <p className="text-gray-600 mb-4">
            Pre-built component classes for common UI patterns.
          </p>
          <button className="btn-outline">Explore</button>
        </div>
      </div>

      {/* Gradient section */}
      <div className="hero-gradient rounded-2xl p-8 mt-12 text-white">
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-xl mb-6 opacity-90">
            Combine the power of Tailwind CSS with your existing CSS variables
            system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Building
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
