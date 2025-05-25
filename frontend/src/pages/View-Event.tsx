import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, User, Ticket, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import api from '../lib/api';

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
  isOnline: boolean;
  meetingUrl?: string;
  organizer: {
    name: string;
    avatarUrl?: string;
    description?: string;
  };
  ticketTypes?: {
    name: string;
    price: number;
    quantity: number;
  }[];
}

export default function ViewEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      // Add validation to check if id exists
      if (!id) {
        setError('Event ID is missing');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching event with ID:', id); // Debug log
        const response = await api.get(`/events/${id}`);
        console.log('Event data:', response.data);
        setEvent(response.data.event);
      } catch (err: any) {
        console.error('Failed to fetch event:', err);
        setError(err.response?.data?.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userResponse = await api.get("/auth/getUser");
        setUserId(userResponse.data.user._id);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchUserId();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleRegister = () => {
    if (!userId) {
      alert('Please log in to register for the event.');
      navigate('/login');
      return;
    }
    // Handle registration logic here
    console.log('Register button clicked');
    // For now, just navigate back to the events page
    window.location.href = `/dashboard/all-events/${id}/register`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-700 py-16 text-white">
        <div className="container mx-auto px-4">
          <Button 
            variant="link" 
            className="text-white mb-4 pl-0"
            onClick={() => navigate(-1)}
          >
            ← Back to Events
          </Button>
          <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
            <Badge className="bg-purple-600">{event.category}</Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={event.imageUrl || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {event.price > 0 ? formatPrice(event.price) : 'Free'}
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <p className="text-gray-700 whitespace-pre-line mb-6">{event.description}</p>

                {event.isOnline && event.meetingUrl && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Online Event Details
                    </h3>
                    <a 
                      href={event.meetingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      Click here to join the meeting
                    </a>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Event Location
                  </h3>
                  <div className="flex items-start gap-4">
                    <div>
                      <p className="font-medium">{event.location}</p>
                      {!event.isOnline && (
                        <Button variant="outline" className="mt-2">
                          View on Map
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                About the Organizer
              </h3>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={event.organizer.avatarUrl} />
                  <AvatarFallback>
                    {event.organizer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{event.organizer.name}</h4>
                  {event.organizer.description && (
                    <p className="text-gray-600 mt-2">{event.organizer.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Section */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Get Tickets
              </h3>
              {event.ticketTypes && event.ticketTypes.length > 0 ? (
                <div className="space-y-4">
                  {event.ticketTypes.map((ticket, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{ticket.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {ticket.quantity} available
                          </p>
                        </div>
                        <div className="text-lg font-bold">
                          {formatPrice(ticket.price)}
                        </div>
                      </div>
                      <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700">
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Free admission</p>
                  <Button onClick={() => handleRegister()} className="w-full bg-purple-600 hover:bg-purple-700">
                    Register Now
                  </Button>
                </div>
              )}

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>{event.attendees} people are attending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}