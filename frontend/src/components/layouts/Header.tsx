import {Ticket} from 'lucide-react'
export default function Header() {
  return (
    // Sticky Header
      <header className="flex justify-center sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              EventEase
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/events" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Events
            </a>
            <a href="#features" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Features
            </a>
            <a href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Pricing
            </a>
            <a href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">
              About
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="/login"
              className="hidden md:inline-flex h-9 items-center justify-center rounded-md border border-gray-200 px-4 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100"
            >
              Log In
            </a>
            <a
              href="/signup"
              className="inline-flex h-9 items-center justify-center rounded-md bg-purple-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700"
            >
              Sign Up
            </a>
          </div>
        </div>
      </header>
  )
}