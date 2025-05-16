export default function Header() {
  return (
    // Sticky Header
      <header className="container mx-auto sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
  )
}