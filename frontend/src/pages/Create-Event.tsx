'use client';

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Clock,
  MapPin,
  Upload,
  LogOut,
  Info,
  Plus,
  Minus,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { DatePicker } from '../components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardContent } from '../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import api from '../lib/api';

interface TicketType {
  name: string;
  price: string;
  quantity: string;
}

interface User {
  username: string;
  avatar?: string;
  email?: string;
}

const categories = [
  { value: 'tech', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'food', label: 'Food & Drink' },
];

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'tech',
    date: null as Date | null,
    time: '18:00',
    isOnline: false,
    meetingUrl: '',
    location: '',
    organizer: '',
    organizerDescription: '',
    contactEmail: '',
    contactPhone: '',
    isPaid: false,
    maxAttendees: '',
    image: null as File | null,
    imageUrl: '',
  });

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { name: 'General Admission', price: '500', quantity: '100' },
  ]);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/getUser');
        setUser(response.data.user);
        setFormData((prev) => ({
          ...prev,
          organizer: response.data.user?.username || '',
          contactEmail: response.data.user?.email || '',
        }));
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

 const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  console.log('Selected file:', { // Debug log
    name: file.name,
    type: file.type,
    size: file.size
  });

  setUploadingImage(true);

  try {
    const formData = new FormData();
    formData.append('image', file); // Must match Multer field name

    // Debug FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await api.post('/events/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      transformRequest: (data) => data // Prevent axios from transforming FormData
    });

    if (!response.data.imageUrl) {
      throw new Error('No image URL in response');
    }

    setFormData(prev => ({ ...prev, imageUrl: response.data.imageUrl }));

  } catch (error:any) {
    console.error('Upload failed:', {
      error: error.response?.data || error.message
    });
    alert(error.response?.data?.message || 'Upload failed');
  } finally {
    setUploadingImage(false);
  }
};
  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: '', quantity: '' }]);
  };

  const removeTicketType = (index: number) => {
    const newTicketTypes = [...ticketTypes];
    newTicketTypes.splice(index, 1);
    setTicketTypes(newTicketTypes);
  };

  const updateTicketType = (
    index: number,
    field: keyof TicketType,
    value: string,
  ) => {
    const newTicketTypes = [...ticketTypes];
    newTicketTypes[index] = { ...newTicketTypes[index], [field]: value };
    setTicketTypes(newTicketTypes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = [
        'title',
        'description',
        'category',
        'date',
        'time',
        'organizer',
        'contactEmail',
      ] as const;
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        setSubmitting(false);
        return;
      }

      if (formData.isOnline && !formData.meetingUrl) {
        console.error('Meeting URL is required for online events');
        setSubmitting(false);
        return;
      }

      if (!formData.isOnline && !formData.location) {
        console.error('Location is required for in-person events');
        setSubmitting(false);
        return;
      }

      if (formData.isPaid) {
        if (!ticketTypes.length) {
          console.error('At least one ticket type is required for paid events');
          setSubmitting(false);
          return;
        }

        for (const ticket of ticketTypes) {
          if (!ticket.name || !ticket.price || !ticket.quantity) {
            console.error('All ticket fields are required:', ticket);
            setSubmitting(false);
            return;
          }

          if (isNaN(Number(ticket.price)) || Number(ticket.price) < 0) {
            console.error('Invalid ticket price:', ticket.price);
            setSubmitting(false);
            return;
          }

          if (isNaN(Number(ticket.quantity)) || Number(ticket.quantity) <= 0) {
            console.error('Invalid ticket quantity:', ticket.quantity);
            setSubmitting(false);
            return;
          }
        }
      }

      // Prepare payload
      const payload = {
        ...formData,
        date: formData.date ? dayjs(formData.date).format('YYYY-MM-DD') : null,
        imageUrl: formData.imageUrl,
        ticketTypes: formData.isPaid
          ? ticketTypes.map((t) => ({
            name: t.name,
            price: Number(t.price),
            quantity: Number(t.quantity),
          }))
          : undefined,
        maxAttendees:
          !formData.isPaid && formData.maxAttendees
            ? Number(formData.maxAttendees)
            : undefined,
      };

      const response = await api.post('/events/create-event', payload);

      if (response.data.success) {
        console.log('Event created:', response.data);
        // Redirect or show success message
      } else {
        console.error('Server response:', response.data);
      }
    } catch (error: any) {
      console.error(
        'Error creating event:',
        error.response?.data || error.message,
      );
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
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Dashboard
            </a>
            <a
              href="/my-events"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              My Events
            </a>
            <a
              href="/create-event"
              className="text-sm font-medium text-primary"
            >
              Create Event
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback>
                  {user?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.username}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Event
            </h1>
            <p className="text-muted-foreground mt-1">
              Fill in the details to create your event.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="basic" className="mb-8">
                  <TabsList className="mb-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="tickets">Tickets</TabsTrigger>
                  </TabsList>

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
                      <Select
                        value={formData.category}
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Date*</Label>
                        <DatePicker
                          date={formData.date || undefined}
                          setDate={(date) =>
                            setFormData((prev) => ({
                              ...prev,
                              date: date || null,
                            }))
                          }
                          placeholder="Pick a date"
                          fromDate={new Date()}
                        />
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
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              isOnline: checked,
                            }))
                          }
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
                      <div className="flex flex-col items-center gap-4">
                        {formData.imageUrl ? (
                          <div className="relative w-full h-64 rounded-lg overflow-hidden">
                            <img
                              src={formData.imageUrl}
                              alt="Event preview"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  imageUrl: '',
                                  image: null,
                                }))
                              }
                            >
                              Change
                            </Button>
                          </div>
                        ) : (
                          <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {uploadingImage ? (
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                              ) : (
                                <>
                                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">
                                      Click to upload
                                    </span>{' '}
                                    or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PNG, JPG (MAX. 2MB)
                                  </p>
                                </>
                              )}
                            </div>
                            <input
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                              accept="image/png, image/jpeg"
                              onChange={handleImageUpload}
                              disabled={uploadingImage}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </TabsContent>

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
                      <Label htmlFor="organizerDescription">
                        About the Organizer
                      </Label>
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

                  <TabsContent value="tickets" className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isPaid">Paid Event</Label>
                        <Switch
                          id="isPaid"
                          checked={formData.isPaid}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              isPaid: checked,
                            }))
                          }
                        />
                      </div>
                    </div>

                    {formData.isPaid ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Ticket Types*</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addTicketType}
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add Ticket Type
                          </Button>
                        </div>

                        {ticketTypes.map((ticket, index) => (
                          <Card key={index}>
                            <CardContent className="pt-6">
                              <div className="grid gap-4 md:grid-cols-4">
                                <div className="md:col-span-2 space-y-2">
                                  <Label htmlFor={`ticket-name-${index}`}>
                                    Name*
                                  </Label>
                                  <Input
                                    id={`ticket-name-${index}`}
                                    value={ticket.name}
                                    onChange={(e) =>
                                      updateTicketType(
                                        index,
                                        'name',
                                        e.target.value,
                                      )
                                    }
                                    placeholder="e.g. General Admission"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`ticket-price-${index}`}>
                                    Price (₹)*
                                  </Label>
                                  <Input
                                    id={`ticket-price-${index}`}
                                    type="number"
                                    value={ticket.price}
                                    onChange={(e) =>
                                      updateTicketType(
                                        index,
                                        'price',
                                        e.target.value,
                                      )
                                    }
                                    placeholder="500"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`ticket-quantity-${index}`}>
                                    Quantity*
                                  </Label>
                                  <div className="flex items-center">
                                    <Input
                                      id={`ticket-quantity-${index}`}
                                      type="number"
                                      value={ticket.quantity}
                                      onChange={(e) =>
                                        updateTicketType(
                                          index,
                                          'quantity',
                                          e.target.value,
                                        )
                                      }
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
                        <p className="text-sm text-muted-foreground">
                          Leave blank for unlimited attendees
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-4 mt-8">
                  <Button type="button" variant="outline" onClick={() => { }}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={submitting || uploadingImage}
                  >
                    {submitting ? 'Creating...' : 'Create Event'}
                  </Button>
                </div>
              </form>
            </div>

            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">
                      Tips for Creating Events
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Info className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">
                          Use a clear, descriptive title that includes keywords.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">
                          Upload a high-quality image (recommended size:
                          1920x1080px).
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">
                          Provide detailed information about what attendees can
                          expect.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">
                          Set a reasonable ticket price based on your target
                          audience.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Need Help?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you have any questions or need assistance creating your
                      event, our support team is here to help.
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
