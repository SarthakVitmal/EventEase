"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, LogOut, Plus, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import api from "../lib/api";

interface User {
  username: string;
  avatar?: string;
  email?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string;
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user details
        const userResponse = await api.get("/auth/getUser");
        setUser(userResponse.data.user);

        // Fetch events
        const eventsResponse = await api.get("/events/getEventsByUser");
        const events: Event[] = eventsResponse.data;

        // Classify events based on date
        const currentDate = new Date();
        const upcoming: Event[] = [];
        const past: Event[] = [];

        events.forEach((event) => {
          const eventDate = new Date(event.date);
          if (eventDate >= currentDate) {
            upcoming.push(event);
          } else {
            past.push(event);
          }
        });

        setAllEvents(events);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
        setRecommendedEvents(events); 

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

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Failed to log out. Please try again.");
    }
  };

  const formatEventDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return format(date, "MMMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const formatEventTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return format(date, "h:mm a");
    } catch {
      return "Invalid time";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">Error loading dashboard</h2>
          <p className="mt-2">{error}</p>
          <Button onClick={() => window.location.href = "/login"} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
              <a href="/dashboard/all-events" className="text-sm font-medium text-muted-foreground hover:text-primary">
                All Events
              </a>
              <a href="/dashboard/create-event" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Create Event
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.username} />
                <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.username || "User"}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8">
        <div className="container">
          {/* Welcome Section */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back, {user?.username || "User"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Here's what's happening with your events and recommendations for you.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <a href="/dashboard/create-event">
                    <Plus className="mr-2 h-4 w-4" /> Create New Event
                  </a>
                </Button>
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

          {/* Events Tabs */}
          <Tabs defaultValue="upcoming" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
            </TabsList>

            {/* Upcoming Events Tab */}
            <TabsContent value="upcoming">
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={event.imageUrl || "/placeholder.svg"}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatEventDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Clock className="mr-2 h-4 w-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.location}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Manage
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {upcomingEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-purple-100 p-3 mb-4">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium">No upcoming events</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    You don't have any upcoming events. Create one or browse events to join.
                  </p>
                  <Button asChild>
                    <a href="/dashboard/create-event">Create Event</a>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Past Events Tab */}
            <TabsContent value="past">
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={event.imageUrl || "/placeholder.svg"}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatEventDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Clock className="mr-2 h-4 w-4" />
                        {formatEventTime(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.location}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {pastEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <h3 className="text-lg font-medium">No past events</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    You haven't attended any events yet.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* All Events Tab */}
            <TabsContent value="all">
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {allEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={event.imageUrl || "/placeholder.svg"}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatEventDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Clock className="mr-2 h-4 w-4" />
                        {formatEventTime(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.location}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        {new Date(event.date) >= new Date() ? "Manage" : "View Details"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {allEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-purple-100 p-3 mb-4">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium">No events</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    You don't have any events. Create one or browse events to join.
                  </p>
                  <Button asChild>
                    <a href="/dashboard/create-event">Create Event</a>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Recommended Events Tab */}
            <TabsContent value="recommended">
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {recommendedEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={event.imageUrl || "/placeholder.svg"}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatEventDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Clock className="mr-2 h-4 w-4" />
                        {formatEventTime(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.location}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Register
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {recommendedEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <h3 className="text-lg font-medium">No recommended events</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    We don't have any event recommendations for you yet.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Quick Stats */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Your Event Stats</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{allEvents.length}</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingEvents.length}</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendees</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">120</div>
                  <p className="text-xs text-muted-foreground">+35 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹24,500</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}