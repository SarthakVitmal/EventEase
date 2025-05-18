"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, MapPin, Upload, LogOut, Info, Plus, Minus } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Calendar } from "../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Switch } from "../components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import api from "../lib/api";

// Sample categories
const categories = [
  { value: "tech", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "health", label: "Health & Wellness" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "food", label: "Food & Drink" },
]

interface User {
  username: string;
  avatar?: string;
}

export default function CreateEventPage() {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>("18:00")
  const [isOnline, setIsOnline] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [ticketTypes, setTicketTypes] = useState([{ name: "General Admission", price: "500", quantity: "100" }])
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user details
        const userResponse = await api.get("/auth/getUser");
        setUser(userResponse.data.user); // Adjusted to match getUserFromToken response

        // // Fetch events
        // const eventsResponse = await api.get("/api/user/events");
        // setUpcomingEvents(eventsResponse.data.upcomingEvents || []);
        // setPastEvents(eventsResponse.data.pastEvents || []);
        // setRecommendedEvents(eventsResponse.data.recommendedEvents || []);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          // router.push("/login");
        } else {
          setError(err.message || "Failed to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: "", price: "", quantity: "" }])
  }

  const removeTicketType = (index: number) => {
    const newTicketTypes = [...ticketTypes]
    newTicketTypes.splice(index, 1)
    setTicketTypes(newTicketTypes)
  }

  const updateTicketType = (index: number, field: string, value: string) => {
    const newTicketTypes = [...ticketTypes]
    newTicketTypes[index] = { ...newTicketTypes[index], [field]: value }
    setTicketTypes(newTicketTypes)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted")
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              EventEase
            </span>
          </a>
          <nav className="hidden md:flex gap-6">
            <a
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Dashboard
            </a>
            <a
              href="/my-events"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              My Events
            </a>
            <a href="/create-event" className="text-sm font-medium transition-colors hover:text-primary">
              Create Event
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
             <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.username} />
                <AvatarFallback>{user?.username?.charAt(0) || "S"}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.username}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
          <div className="flex md:hidden">
            <button className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
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
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
            <p className="text-muted-foreground mt-1">Fill in the details to create your event.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Main Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="basic" className="mb-8">
                  <TabsList className="mb-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="tickets">Tickets</TabsTrigger>
                  </TabsList>

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input id="title" placeholder="Enter event title" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Select date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="online-event">Online Event</Label>
                        <Switch id="online-event" checked={isOnline} onCheckedChange={setIsOnline} />
                      </div>
                      {isOnline ? (
                        <div className="space-y-2">
                          <Label htmlFor="meeting-a">Meeting a</Label>
                          <Input id="meeting-a" placeholder="https://zoom.us/j/123456789" />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input id="location" placeholder="Enter event location" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Event Image</Label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                          </div>
                          <input id="dropzone-file" type="file" className="hidden" />
                        </label>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Details Tab */}
                  <TabsContent value="details" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="description">Event Description</Label>
                      <Textarea id="description" placeholder="Describe your event..." className="min-h-[200px]" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organizer">Organizer Name</Label>
                      <Input id="organizer" placeholder="Who is organizing this event?" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organizer-description">About the Organizer</Label>
                      <Textarea
                        id="organizer-description"
                        placeholder="Tell attendees about the organizer..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input id="contact-email" type="email" placeholder="contact..example.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input id="contact-phone" type="tel" placeholder="+91 98765 43210" />
                    </div>
                  </TabsContent>

                  {/* Tickets Tab */}
                  <TabsContent value="tickets" className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="paid-event">Paid Event</Label>
                        <Switch id="paid-event" checked={isPaid} onCheckedChange={setIsPaid} />
                      </div>
                    </div>

                    {isPaid && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Ticket Types</h3>
                          <Button type="button" variant="outline" size="sm" onClick={addTicketType}>
                            <Plus className="mr-2 h-4 w-4" /> Add Ticket Type
                          </Button>
                        </div>

                        {ticketTypes.map((ticket, index) => (
                          <Card key={index}>
                            <CardContent className="pt-6">
                              <div className="grid gap-4 md:grid-cols-4">
                                <div className="md:col-span-2 space-y-2">
                                  <Label htmlFor={`ticket-name-${index}`}>Ticket Name</Label>
                                  <Input
                                    id={`ticket-name-${index}`}
                                    value={ticket.name}
                                    onChange={(e) => updateTicketType(index, "name", e.target.value)}
                                    placeholder="e.g. General Admission"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`ticket-price-${index}`}>Price (₹)</Label>
                                  <Input
                                    id={`ticket-price-${index}`}
                                    value={ticket.price}
                                    onChange={(e) => updateTicketType(index, "price", e.target.value)}
                                    placeholder="500"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`ticket-quantity-${index}`}>Quantity</Label>
                                  <div className="flex items-center">
                                    <Input
                                      id={`ticket-quantity-${index}`}
                                      value={ticket.quantity}
                                      onChange={(e) => updateTicketType(index, "quantity", e.target.value)}
                                      placeholder="100"
                                    />
                                    {index > 0 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="ml-2 text-red-500"
                                        onClick={() => removeTicketType(index)}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {!isPaid && (
                      <div className="space-y-2">
                        <Label htmlFor="max-attendees">Maximum Attendees</Label>
                        <Input id="max-attendees" type="number" placeholder="100" />
                        <p className="text-sm text-muted-foreground">Leave blank for unlimited attendees</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-4 mt-8">
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Create Event
                  </Button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Tips for Creating Events</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Info className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Use a clear, descriptive title that includes keywords.</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Upload a high-quality image (recommended size: 1920x1080px).</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Provide detailed information about what attendees can expect.</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Set a reasonable ticket price based on your target audience.</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Need Help?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you have any questions or need assistance creating your event, our support team is here to
                      help.
                    </p>
                    <Button variant="outline" className="w-full">
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
