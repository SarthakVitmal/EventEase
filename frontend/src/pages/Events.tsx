"use client"

import { useEffect, useState } from "react"
import { Calendar, MapPin, Search, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar as CalendarComponent } from "../components/ui/calendar"
import dayjs from "dayjs"
import api from "../lib/api"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  price: number
  category: string
  attendees: number
  imageUrl: string
  organizer: {
    name: string
    avatarUrl?: string
  }
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "tech", label: "Technology" },
  { value: "music", label: "Music" },
  { value: "business", label: "Business" },
  { value: "art", label: "Art" },
  { value: "food", label: "Food & Drink" },
  { value: "sports", label: "Sports" },
]

const sortOptions = [
  { value: "date-asc", label: "Date (Earliest)" },
  { value: "date-desc", label: "Date (Latest)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "popularity", label: "Most Popular" },
]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date-asc")
  const [dateFilter, setDateFilter] = useState<{ from?: Date; to?: Date }>({})
  const [showFilters, setShowFilters] = useState(false)

  // Fetch future events from backend
  const fetchEvents = async () => {
  try {
    setLoading(true);
    const response = await api.get("/events/getAllEvents", {
      params: {
        futureOnly: true,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        search: searchQuery || undefined,
        sort: sortBy,
        fromDate: dateFilter.from ? dayjs(dateFilter.from).format("YYYY-MM-DD") : undefined,
        toDate: dateFilter.to ? dayjs(dateFilter.to).format("YYYY-MM-DD") : undefined,
      },
    });

    const eventsWithIds = response.data.events.map((event:any) => ({
      ...event,
      id: event.id || event._id 
    }));

    console.log("Fetched events:", eventsWithIds);
    setEvents(eventsWithIds);
  } catch (err) {
    console.error("Failed to fetch events:", err);
    setError("Failed to load events. Please try again later.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
    fetchEvents();
  }
, [searchQuery, selectedCategory, sortBy, dateFilter])

  const handleDateSelect = (range: { from?: Date; to?: Date | undefined }) => {
    setDateFilter({
      from: range.from,
      to: range.to,
    })
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy("date-asc")
    setDateFilter({})
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }
  const handleViewEvent = (eventId: string) => {
  console.log("=== DEBUG EVENT CLICK ===");
  console.log("Event ID received:", eventId);
  console.log("Event ID type:", typeof eventId);
  console.log("Event ID length:", eventId?.length);
  console.log("Is eventId truthy?", !!eventId);
  
  // Check the full event object to see what ID field exists
  const clickedEvent = events.find(e => e.id === eventId);
  console.log("Full event object:", clickedEvent);
  console.log("Available ID fields:", {
    id: clickedEvent?.id,
    _id: clickedEvent?.id, // MongoDB typically uses _id
  });
  
  if (!eventId || eventId === 'undefined') {
    console.error("ERROR: Event ID is undefined or invalid");
    return;
  }
  
  // Try using _id if id doesn't exist
  const actualId = clickedEvent?.id || clickedEvent?.id || eventId;
  console.log("Using ID for navigation:", actualId);
  
  window.location.href = `/${actualId}`;
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-700 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
          <p className="text-xl max-w-2xl">
            Discover exciting events happening near you. Book your tickets and create unforgettable memories.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date Range</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateFilter.from ? (
                          dateFilter.to ? (
                            <>
                              {dayjs(dateFilter.from).format("MMM D, YYYY")} -{" "}
                              {dayjs(dateFilter.to).format("MMM D, YYYY")}
                            </>
                          ) : (
                            dayjs(dateFilter.from).format("MMM D, YYYY")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="range"
                        selected={{
                          from: dateFilter.from,
                          to: dateFilter.to,
                        }}
                        onSelect={(range) => handleDateSelect(range || {})}
                        disabled={(date) => dayjs(date).isBefore(dayjs(), "day")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== "all" || dateFilter.from) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchQuery && (
                <Badge className="flex items-center gap-1">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")}>×</button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge className="flex items-center gap-1">
                  Category: {categories.find(c => c.value === selectedCategory)?.label}
                  <button onClick={() => setSelectedCategory("all")}>×</button>
                </Badge>
              )}
              {dateFilter.from && (
                <Badge className="flex items-center gap-1">
                  Date: {dayjs(dateFilter.from).format("MMM D")}
                  {dateFilter.to && ` - ${dayjs(dateFilter.to).format("MMM D")}`}
                  <button onClick={() => setDateFilter({})}>×</button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && (
          <>
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={event.imageUrl || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-purple-600">
                        {event.category}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <h3 className="text-xl font-bold line-clamp-1">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {dayjs(event.date).format("ddd, MMM D")} • {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-gray-600 line-clamp-2">{event.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={event.organizer.avatarUrl} />
                          <AvatarFallback>
                            {event.organizer.name}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {event.organizer.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">
                          {event.price > 0 ? formatPrice(event.price) : "Free"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {event.attendees} attending
                        </div>

                         <Button onClick={() => handleViewEvent(event.id)} className="text-sm bg-purple-600 hover:bg-purple-700 text-white mt-2 cursor-pointer">
                          View Details
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto max-w-md">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
                  <p className="text-gray-500">
                    {searchQuery || selectedCategory !== "all" || dateFilter.from
                      ? "Try adjusting your search or filters"
                      : "There are no upcoming events at the moment. Check back later!"}
                  </p>
                  {(searchQuery || selectedCategory !== "all" || dateFilter.from) && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Pagination (optional) */}
        {events.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button variant="outline">Previous</Button>
              <Button variant="outline">1</Button>
              <Button>2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}