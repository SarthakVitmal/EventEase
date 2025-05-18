"use client"

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Upload, LogOut, Info, Plus, Minus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import { toast, Toaster } from "sonner";
import api from "../lib/api";

interface TicketType {
  name: string;
  price: string;
  quantity: string;
}

interface User {
  username: string;
  avatar?: string;
}

const categories = [
  { value: "tech", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "health", label: "Health & Wellness" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "food", label: "Food & Drink" },
];

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tech",
    date: undefined as Date | undefined,
    time: "18:00",
    isOnline: false,
    meetingUrl: "",
    location: "",
    organizer: "",
    organizerDescription: "",
    contactEmail: "",
    contactPhone: "",
    isPaid: false,
    maxAttendees: "",
  });
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { name: "General Admission", price: "500", quantity: "100" }
  ]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/getUser");
        setUser(response.data.user);
        // Pre-fill organizer info with user data
        setFormData(prev => ({
          ...prev,
          organizer: response.data.user?.username || "",
          contactEmail: response.data.user?.email || ""
        }));
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: "", price: "", quantity: "" }]);
  };

  const removeTicketType = (index: number) => {
    const newTicketTypes = [...ticketTypes];
    newTicketTypes.splice(index, 1);
    setTicketTypes(newTicketTypes);
  };

  const updateTicketType = (index: number, field: keyof TicketType, value: string) => {
    const newTicketTypes = [...ticketTypes];
    newTicketTypes[index] = { ...newTicketTypes[index], [field]: value };
    setTicketTypes(newTicketTypes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'date', 'time', 'organizer', 'contactEmail'] as const;
    type FormField = typeof requiredFields[number];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      // toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setSubmitting(false);
      return;
    }

    // Validate conditional fields
    if (formData.isOnline && !formData.meetingUrl) {
      console.error('Meeting URL is required for online events');
      // toast.error('Please provide a meeting URL for online events');
      setSubmitting(false);
      return;
    }
    if (!formData.isOnline && !formData.location) {
      console.error('Location is required for in-person events');
      // toast.error('Please provide a location for in-person events');
      setSubmitting(false);
      return;
    }

    // Validate ticket types for paid events
    if (formData.isPaid) {
      if (!ticketTypes.length) {
        console.error('At least one ticket type is required for paid events');
        // toast.error('Please add at least one ticket type for paid events');
        setSubmitting(false);
        return;
      }
      for (const ticket of ticketTypes) {
        if (!ticket.name || !ticket.price || !ticket.quantity) {
          console.error('All ticket fields are required:', ticket);
          // toast.error('Please fill in all ticket type fields');
          setSubmitting(false);
          return;
        }
        if (isNaN(Number(ticket.price)) || Number(ticket.price) < 0) {
          console.error('Invalid ticket price:', ticket.price);
          // toast.error('Ticket price must be a valid number');
          setSubmitting(false);
          return;
        }
        if (isNaN(Number(ticket.quantity)) || Number(ticket.quantity) <= 0) {
          console.error('Invalid ticket quantity:', ticket.quantity);
          // toast.error('Ticket quantity must be a positive number');
          setSubmitting(false);
          return;
        }
      }
    }

    // Validate maxAttendees for non-paid events
    if (!formData.isPaid && formData.maxAttendees && (isNaN(Number(formData.maxAttendees)) || Number(formData.maxAttendees) <= 0)) {
      console.error('Invalid max attendees:', formData.maxAttendees);
      // toast.error('Maximum attendees must be a positive number or left blank');
      setSubmitting(false);
      return;
    }

    // Prepare payload
    const payload = {
      ...formData,
      date: formData.date?.toISOString(),
      ticketTypes: formData.isPaid ? ticketTypes.map(t => ({
        name: t.name,
        price: Number(t.price),
        quantity: Number(t.quantity)
      })) : undefined,
      maxAttendees: !formData.isPaid && formData.maxAttendees ? Number(formData.maxAttendees) : undefined,
      // Remove fields not expected by backend
      organizerDescription: undefined
    };

    console.log('Submitting payload:', payload); // Debug payload

    const response = await api.post("/events/create-event", payload);

    if (response.data.success) {
      // toast.success("Event created successfully!");
      console.log('Event created:', response.data);
    } else {
      console.error('Server response:', response.data);
      // toast.error(response.data.message || "Failed to create event");
    }
  } catch (error: any) {
    console.error("Error creating event:", error.response?.data || error.message);
    // toast.error(error.response?.data?.message || "Failed to create event");
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
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
            <a href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Dashboard
            </a>
            <a href="/my-events" className="text-sm font-medium text-muted-foreground hover:text-primary">
              My Events
            </a>
            <a href="/create-event" className="text-sm font-medium text-primary">
              Create Event
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.username}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <LogOut className="h-5 w-5" />
            </Button>
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
                      <Label htmlFor="title">Event Title*</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter event title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category*</Label>
                      <Select value={formData.category} onValueChange={handleSelectChange}>
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
                        <Label htmlFor="date">Date*</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.date ? format(formData.date, "PPP") : <span>Select date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.date}
                              onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time">Time*</Label>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="time"
                            type="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isOnline">Online Event</Label>
                        <Switch
                          id="isOnline"
                          checked={formData.isOnline}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOnline: checked }))}
                        />
                      </div>
                      {formData.isOnline ? (
                        <div className="space-y-2">
                          <Label htmlFor="meetingUrl">Meeting URL*</Label>
                          <Input
                            id="meetingUrl"
                            value={formData.meetingUrl}
                            onChange={handleInputChange}
                            placeholder="https://zoom.us/j/123456789"
                            required={formData.isOnline}
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="location">Location*</Label>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              placeholder="Enter event location"
                              required={!formData.isOnline}
                            />
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
                      <Label htmlFor="description">Event Description*</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your event..."
                        className="min-h-[200px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organizer">Organizer Name*</Label>
                      <Input
                        id="organizer"
                        value={formData.organizer}
                        onChange={handleInputChange}
                        placeholder="Who is organizing this event?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organizerDescription">About the Organizer</Label>
                      <Textarea
                        id="organizerDescription"
                        value={formData.organizerDescription}
                        onChange={handleInputChange}
                        placeholder="Tell attendees about the organizer..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email*</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        placeholder="contact@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </TabsContent>

                  {/* Tickets Tab */}
                  <TabsContent value="tickets" className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isPaid">Paid Event</Label>
                        <Switch
                          id="isPaid"
                          checked={formData.isPaid}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPaid: checked }))}
                        />
                      </div>
                    </div>

                    {formData.isPaid ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Ticket Types*</h3>
                          <Button type="button" variant="outline" size="sm" onClick={addTicketType}>
                            <Plus className="mr-2 h-4 w-4" /> Add Ticket Type
                          </Button>
                        </div>

                        {ticketTypes.map((ticket, index) => (
                          <Card key={index}>
                            <CardContent className="pt-6">
                              <div className="grid gap-4 md:grid-cols-4">
                                <div className="md:col-span-2 space-y-2">
                                  <Label htmlFor={`ticket-name-${index}`}>Name*</Label>
                                  <Input
                                    id={`ticket-name-${index}`}
                                    value={ticket.name}
                                    onChange={(e) => updateTicketType(index, "name", e.target.value)}
                                    placeholder="e.g. General Admission"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`ticket-price-${index}`}>Price (₹)*</Label>
                                  <Input
                                    id={`ticket-price-${index}`}
                                    type="number"
                                    value={ticket.price}
                                    onChange={(e) => updateTicketType(index, "price", e.target.value)}
                                    placeholder="500"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`ticket-quantity-${index}`}>Quantity*</Label>
                                  <div className="flex items-center">
                                    <Input
                                      id={`ticket-quantity-${index}`}
                                      type="number"
                                      value={ticket.quantity}
                                      onChange={(e) => updateTicketType(index, "quantity", e.target.value)}
                                      placeholder="100"
                                      required
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
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                        <Input
                          id="maxAttendees"
                          type="number"
                          value={formData.maxAttendees}
                          onChange={handleInputChange}
                          placeholder="100"
                        />
                        <p className="text-sm text-muted-foreground">Leave blank for unlimited attendees</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-4 mt-8">
                  <Button type="button" variant="outline" onClick={() => {}}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={submitting}
                  >
                    {submitting ? "Creating..." : "Create Event"}
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
                      If you have any questions or need assistance creating your event, our support team is here to help.
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
  );
}