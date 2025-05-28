import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  isPaid: boolean;
  isOnline: boolean;
  price?: number;
  currency?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  additionalInfo: string;
}

export default function EventRegistrationPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    additionalInfo: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${id}`);
        setEvent(response.data.event);
      } catch (err) {
        setError('Failed to load event details');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventDetails();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (formErrors[name as keyof FormData]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(`/events/${id}/register`, {
        ...formData,
        eventId: id,
        userId: userId 
      });
      console.log('Registration response:', response.data);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to process registration');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-gray-50 rounded-lg max-w-md">
          <h2 className="text-xl font-bold">Event Not Found</h2>
          <p className="mt-2">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto container font-[Montserrat] flex min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
            <p className="mb-6">You're registered for <span className="font-semibold">{event.title}</span></p>
            <div className="text-left space-y-2 mb-6">
              <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
              <p><span className="font-medium">Location:</span> {event.location}</p>
            </div>
            <button 
              onClick={() => window.location.href = '/events'}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto container font-[Montserrat] flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Register for {event.title}</h1>
            <p className="mt-2 text-sm text-gray-500">{event.description}</p>
            <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {new Date(event.date).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {event.location}
              </span>
              {event.isPaid && event.price && event.currency && (
                <span className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {event.price} {event.currency}
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-600 text-sm text-center mb-4">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-2 border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-2 border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className={`w-full px-4 py-2 border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all ${
                    formErrors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-xs text-red-500">{formErrors.phone}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-4 py-2 text-white font-medium rounded-md bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting 
                  ? "Processing..." 
                  : event.isPaid 
                    ? "Proceed to Payment" 
                    : "Complete Registration"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p>
                Changed your mind?{" "}
                <a
                  href="/events"
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                >
                  Browse other events
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        input {
          font-size: 1rem;
        }
        input::placeholder {
          color: #a0aec0;
        }
        button:focus,
        a:focus {
          outline: 2px solid #9333ea;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}