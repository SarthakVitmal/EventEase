"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin, Search, Filter, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import dayjs from "dayjs";
import api from "../lib/api";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  category: string;
  attendees: number;
  imageUrl: string;
  organizer: {
    name: string;
    avatarUrl?: string;
  };
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "tech", label: "Technology" },
  { value: "music", label: "Music" },
  { value: "business", label: "Business" },
  { value: "art", label: "Art" },
  { value: "food", label: "Food & Drink" },
  { value: "sports", label: "Sports" },
];

const sortOptions = [
  { value: "date-asc", label: "Date (Earliest)" },
  { value: "date-desc", label: "Date (Latest)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "popularity", label: "Most Popular" },
];

export default function AllEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date-asc");
  const [dateFilter, setDateFilter] = useState<{ from?: Date; to?: Date }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState<any>(null);

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

      const eventsWithIds = response.data.events.map((event: any) => ({
        ...event,
        id: event.id || event._id,
      }));

      setEvents(eventsWithIds);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user details
        const userResponse = await api.get("/auth/getUser");
        setUser(userResponse.data.user);

      } catch (err: any) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else {
          setError(err.message || "Failed to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if(!user) window.location.href = "/login";
  })

  useEffect(() => {
    fetchEvents();
  }, [searchQuery, selectedCategory, sortBy, dateFilter]);

  const handleDateSelect = (range: { from?: Date; to?: Date | undefined }) => {
    setDateFilter({
      from: range.from,
      to: range.to,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("date-asc");
    setDateFilter({});
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleViewEvent = (eventId: string) => {
    window.location.href = `/dashboard/all-events/${eventId}`;
  };

  const handleCreateEvent = () => {
   window.location.href = ("/dashboard/create-event");
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Event Dashboard</h1>
            <nav className="hidden md:flex gap-6">
              <a href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Dashboard
              </a>
              <a href="/dashboard/all-events" className="text-sm font-medium text-foreground hover:text-primary">
                All Events
              </a>
              <a href="/dashboard/create-event" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Create Event
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="w-full pl-8 rounded-full bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCreateEvent}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8">
        <div className="container">
          {/* Page Header */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Discover Events</h1>
                <p className="text-muted-foreground mt-1">
                  Browse and join exciting events happening near you
                </p>
              </div>
            </div>
          </section>

          {/* Mobile Search */}
          <div className="mb-6 md:hidden">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="w-full pl-8 rounded-full bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
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
              <div className="bg-background p-4 rounded-lg border mb-4">
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
                    Category: {categories.find((c) => c.value === selectedCategory)?.label}
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
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <Card key={event.id} className="overflow-hidden transition-all hover:shadow-lg">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={event.imageUrl || "/placeholder.svg"}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                        <Badge className="absolute top-2 right-2 bg-purple-600">
                          {event.category}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Calendar className="mr-2 h-4 w-4" />
                          {dayjs(event.date).format("ddd, MMM D")} • {event.time}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {event.description}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={event.organizer.avatarUrl} />
                            <AvatarFallback>
                              {/* {event.organizer.name.charAt(0)} */}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{event.organizer.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-purple-600">
                            {event.price > 0 ? formatPrice(event.price) : "Free"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {event.attendees} attending
                          </div>
                        </div>
                      </CardFooter>
                      <div className="px-6 pb-4">
                        <Button
                          onClick={() => handleViewEvent(event.id)}
                          className="w-full bg-purple-600"
                        >
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto max-w-md">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-foreground mb-2">
                      No events found
                    </h3>
                    <p className="text-muted-foreground">
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
      </main>
    </div>
  );
}