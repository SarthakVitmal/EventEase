"use client"

import { ArrowRight, Calendar, MapPin, Search, Star, Filter, Bell, Ticket, Heart, Share2 } from "lucide-react"
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

// Event data with improved images and more details
const events = [
  {
    id: "e1",
    title: "Mumbai Tech Fest 2025",
    description: "India's largest student-run tech event with 100+ talks and workshops on AI, blockchain, and more.",
    date: "May 25, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "IIT Bombay, Mumbai",
    price: "₹1,500",
    category: "Tech",
    attendees: 342,
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    organizer: {
      name: "IIT Bombay",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "e2",
    title: "Comedy Night Live",
    description:
      "Stand-up comedy special with top Indian comedians. Prepare for a night of laughter and entertainment.",
    date: "June 10, 2025",
    time: "8:00 PM - 10:30 PM",
    location: "Juhu Theatre, Mumbai",
    price: "₹800",
    category: "Entertainment",
    attendees: 189,
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    organizer: {
      name: "Laugh Factory",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "e3",
    title: "Bollywood Beats Festival",
    description: "Celebrate music, dance and fun with top DJs and artists. Experience the best of Bollywood music.",
    date: "July 15, 2025",
    time: "4:00 PM - 11:00 PM",
    location: "Andheri Stadium, Mumbai",
    price: "₹1,200",
    category: "Music",
    attendees: 567,
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    organizer: {
      name: "Mumbai Beats",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "e4",
    title: "Startup Pitch Night",
    description: "Watch innovative startups pitch their ideas to top investors. Networking opportunities available.",
    date: "June 5, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "WeWork, Bandra Kurla Complex",
    price: "₹500",
    category: "Business",
    attendees: 124,
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    organizer: {
      name: "Mumbai Startups",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

// Categories for filtering
const categories = ["All", "Tech", "Music", "Entertainment", "Business", "Food", "Sports", "Art"]

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter events based on category and search query
  const filteredEvents = events.filter(
    (event) =>
      (activeCategory === "All" || event.category === activeCategory) &&
      (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="font-[Montserrat] min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Navbar */}
     

      <main className="flex-1">
        {/* Hero Section - Enhanced with animated gradient and search bar */}
        <section className="mx-auto flex justify-center relative w-full py-20 md:py-32 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 opacity-90">
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          </div>

          {/* Content */}
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none text-white">
                  Discover & Experience <span className="text-purple-300">Unforgettable</span> Events
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Concerts, workshops, fests, meetups — find your next adventure in just a few clicks.
                </p>
              </div>

              {/* Search bar */}
              <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-2 rounded-xl shadow-lg">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                    <Input
                      type="text"
                      placeholder="Search events, artists, venues..."
                      className="pl-9 h-11 bg-white/90 border-0 focus-visible:ring-purple-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button className="h-11 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                    Find Events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-8 text-white">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">1000+</span>
                  <span className="text-sm text-gray-300">Events</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">50k+</span>
                  <span className="text-sm text-gray-300">Users</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">100+</span>
                  <span className="text-sm text-gray-300">Cities</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="flex justify-center w-full py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Badge variant="outline" className="px-3 py-1 text-sm border-purple-200 bg-purple-50 text-purple-800">
                Featured
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                Trending This Week
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-lg">
                Don't miss out on these popular events happening soon.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              {events
                .filter((event) => event.featured)
                .map((event) => (
                  <Card
                    key={event.id}
                    className="group overflow-hidden border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          width={600}
                          height={340}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <Badge className="absolute top-4 right-4 bg-purple-600 hover:bg-purple-700">
                        {event.category}
                      </Badge>
                    </div>

                    <CardHeader className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold">{event.title}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {event.date} • {event.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">{event.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">{event.price}</div>
                          <div className="text-xs text-gray-500 mt-1">{event.attendees} attending</div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="px-6 pb-0">
                      <p className="text-gray-600">{event.description}</p>
                    </CardContent>

                    <CardFooter className="p-6 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} alt={event.organizer.name} />
                          <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">By {event.organizer.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Heart className="h-4 w-4" />
                          <span className="sr-only">Add to favorites</span>
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only">Share event</span>
                        </Button>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Book Now
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        </section>

        {/* Events Section - Enhanced with tabs and filters */}
        <section id="events" className="flex justify-center w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Discover Events</h2>
                <p className="max-w-[700px] text-gray-500 md:text-lg">
                  Find the perfect events that match your interests.
                </p>
              </div>
            </div>

            {/* Category filters */}
            <div className="flex justify-center mt-8 mb-10">
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    className={`px-4 py-2 cursor-pointer transition-all ${
                      activeCategory === category ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-purple-100"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Events grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        width={500}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge className="mb-2">{event.category}</Badge>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{event.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-purple-600">{event.price}</span>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-gray-100 p-6 mb-4">
                    <Search className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold">No events found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                </div>
              )}
            </div>

            {filteredEvents.length > 0 && (
              <div className="flex justify-center mt-10">
                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                  Load More Events
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Features Section - Enhanced with illustrations and better layout */}
        <section id="features" className="flex justify-center w-full py-12 md:py-24 bg-gradient-to-b from-white to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge variant="outline" className="px-3 py-1 text-sm border-purple-200 bg-purple-50 text-purple-800">
                Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose EventEase?</h2>
              <p className="max-w-[700px] text-gray-500 md:text-lg">
                We make event discovery and management simple and enjoyable.
              </p>
            </div>

            <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-purple-100 p-4">
                  <Search className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Discovery</h3>
                <p className="text-gray-500">
                  Our AI-powered recommendation engine helps you find events that perfectly match your interests and
                  preferences.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-purple-100 p-4">
                  <Ticket className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Seamless Booking</h3>
                <p className="text-gray-500">
                  Book tickets in just a few clicks with secure payment options and instant confirmation.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-purple-100 p-4">
                  <Bell className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Event Reminders</h3>
                <p className="text-gray-500">
                  Never miss an event with personalized notifications and calendar integration.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-purple-100 p-4">
                  <Filter className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Advanced Filters</h3>
                <p className="text-gray-500">
                  Find exactly what you're looking for with our comprehensive filtering options.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-purple-100 p-4">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Reviews & Ratings</h3>
                <p className="text-gray-500">
                  Make informed decisions with authentic reviews and ratings from other attendees.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-purple-100 p-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Personalization</h3>
                <p className="text-gray-500">
                  Create your own profile, save favorite events, and get personalized recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - New section */}
        <section className="flex justify-center w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge variant="outline" className="px-3 py-1 text-sm border-purple-200 bg-purple-50 text-purple-800">
                Testimonials
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What Our Users Say</h2>
              <p className="max-w-[700px] text-gray-500 md:text-lg">
                Hear from people who have discovered amazing events through our platform.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-white border border-purple-100">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="italic text-gray-600 mb-6">
                      "EventEase has completely changed how I discover events in my city. The interface is intuitive,
                      and I've found some amazing concerts I would have missed otherwise!"
                    </p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${i}`} />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">User {i}</h4>
                        <p className="text-sm text-gray-500">Event Enthusiast</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mobile App Section - New section */}
        <section className="flex justify-center w-full py-12 md:py-24 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col space-y-4">
                <Badge
                  variant="outline"
                  className="w-fit px-3 py-1 text-sm border-purple-200 bg-purple-50 text-purple-800"
                >
                  Mobile App
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Take EventEase Everywhere</h2>
                <p className="text-gray-500 md:text-lg">
                  Download our mobile app to discover and book events on the go. Get exclusive mobile-only deals and
                  instant notifications.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button className="bg-black hover:bg-gray-800 text-white">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.5,1.5h-11c-2.761,0-5,2.239-5,5v11c0,2.761,2.239,5,5,5h11c2.761,0,5-2.239,5-5v-11C22.5,3.739,20.261,1.5,17.5,1.5z M14.5,13.5l-3,1.5l-3-1.5v-7l3,1.5l3-1.5V13.5z" />
                    </svg>
                    App Store
                  </Button>
                  <Button className="bg-black hover:bg-gray-800 text-white">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.5,1.5h17c1.105,0,2,0.895,2,2v17c0,1.105-0.895,2-2,2h-17c-1.105,0-2-0.895-2-2v-17C1.5,2.395,2.395,1.5,3.5,1.5z M12,7.5c-2.209,0-4,1.791-4,4s1.791,4,4,4s4-1.791,4-4S14.209,7.5,12,7.5z" />
                    </svg>
                    Google Play
                  </Button>
                </div>
              </div>
              <div className="relative mx-auto max-w-sm">
                <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 opacity-20 blur-xl"></div>
                <div className="relative overflow-hidden rounded-3xl border-8 border-white shadow-2xl">
                  <img
                    src="/placeholder.svg?height=600&width=300&text=App"
                    alt="EventEase Mobile App"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced with better visuals */}
        <section className="flex justify-center relative w-full py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900">
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          </div>

          <div className="container relative px-4 md:px-6">
            <div className="max-w-3xl mx-auto flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Ready to Discover Amazing Events?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Join thousands of users who are already enjoying the best events in their city.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-purple-900 hover:bg-white/10 hover:text-white">
                  Learn More
                </Button>
              </div>
              <div className="pt-4">
                <p className="text-sm text-gray-300">No credit card required • Free to get started</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
