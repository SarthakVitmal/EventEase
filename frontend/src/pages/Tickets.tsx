import { useEffect, useState } from 'react';
import api from '../lib/api';
import { FiCalendar, FiClock, FiMapPin, FiUser } from 'react-icons/fi';
// import LoadingSpinner from '../components/LoadingSpinner'; // Assume you have this component

export default function TicketsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        setLoading(true);
        const userResponse = await api.get("/auth/getUser");
        setUserId(userResponse.data.user._id);
      } catch (err) {
        setError('Failed to load user details');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchUserRegisteredEvents = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const response = await api.get(`/events/${userId}/getUserRegisteredEvents`);
        if (Array.isArray(response.data.events)) {
          setRegisteredEvents(response.data.events);
        } else if (Array.isArray(response.data)) {
          setRegisteredEvents(response.data);
        } else {
          setRegisteredEvents([]);
        }
      } catch (err) {
        setError('Failed to load registered events');
        console.error('Error fetching registered events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRegisteredEvents();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        {/* <LoadingSpinner size="large" /> */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md w-full">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <FiCalendar className="inline mr-2" />
            Your Event Tickets
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            All your registered events in one place
          </p>
        </div>

        {registeredEvents.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't registered for any events yet.
            </p>
            <div className="mt-6">
              <a
                href="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Events
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {registeredEvents.map((event) => (
              <div key={event._id} className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {event.title || "Untitled Event"}
                  </h3>
                  <span className="mt-1 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Registered
                  </span>
                </div>
                <div className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FiCalendar className="mr-2" />
                    {new Date(event.date || Date.now()).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FiClock className="mr-2" />
                    {event.time || "Time not specified"}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <FiMapPin className="mr-2" />
                    {event.location || "Location not specified"}
                  </div>
                  <p className="text-gray-600 mb-4">
                    {event.description || "No description available."}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUser className="mr-1" />
                      {event.organizer || "Organizer not specified"}
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Ticket Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}