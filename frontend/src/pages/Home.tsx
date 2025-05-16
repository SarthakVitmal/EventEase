import { ArrowRight } from 'lucide-react'

// Event data
const events = [
  {
    "title": "Mumbai Tech Fest 2025",
    "description": "India's largest student-run tech event with 100+ talks and workshops.",
    "date": "May 25, 2025",
    "location": "IIT Bombay, Mumbai",
    "image": "https://source.unsplash.com/featured/?tech,conference"
  },
  {
    "title": "Comedy Night Live",
    "description": "Stand-up comedy special with top Indian comedians.",
    "date": "June 10, 2025",
    "location": "Juhu Theatre, Mumbai",
    "image": "https://source.unsplash.com/featured/?comedy,show"
  },
  {
    "title": "Bollywood Beats Festival",
    "description": "Celebrate music, dance and fun with top DJs and artists.",
    "date": "July 15, 2025",
    "location": "Andheri Stadium, Mumbai",
    "image": "https://source.unsplash.com/featured/?music,festival"
  }
]

export default function LandingPage() {
  return (
    <div className="font-[Montserrat] container mx-auto flex min-h-screen flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">EventEase</span>
          </a>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </a>
            <a href="#events" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Events
            </a>
            <a href="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Login
            </a>
            <a href="/signup" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Sign Up
            </a>
          </nav>
          <div className="flex md:hidden">
            <button className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover & Manage Events Effortlessly
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Concerts, workshops, fests, meetups — all in one place.
                </p>
              </div>
              <div className="space-x-4">
                <a
                  href="#events"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-purple-900 shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Explore Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Upcoming Events</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover the most exciting events happening around you.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              {events.map((event, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg border bg-white shadow-md transition-all hover:shadow-xl">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={500}
                      height={300}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1 h-4 w-4"
                      >
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                      {event.date}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1 h-4 w-4"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {event.location}
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{event.description}</p>
                    <div className="mt-4">
                      <a
                        href="#"
                        className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800"
                      >
                        View Details
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1 h-4 w-4"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <a
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
              >
                View All Events
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose EventEase?</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We make event discovery and management simple and enjoyable.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-purple-100 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-purple-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m16 10-4 4-2-2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Easy Discovery</h3>
                <p className="text-sm text-gray-500">Find events that match your interests with our smart filters.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-purple-100 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-purple-600"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Seamless Booking</h3>
                <p className="text-sm text-gray-500">Book tickets in just a few clicks with secure payment options.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-purple-100 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-purple-600"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Community</h3>
                <p className="text-sm text-gray-500">Connect with like-minded people who share your interests.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Discover Amazing Events?</h2>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Join thousands of users who are already enjoying the best events in their city.
                </p>
              </div>
              <div className="space-x-4">
                <a
                  href="/signup"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-purple-900 shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Sign Up Now
                </a>
                <a
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Login
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2025 EventEase. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
