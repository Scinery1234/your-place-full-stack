import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSpaces } from '@/api/listings';
import { getEvents } from '@/api/listings';
import { getMyBooking } from '@/api/bookings';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const STATUS_STYLES = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function HostDashboard() {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetches = [
      getSpaces().then((res) => setSpaces(res?.data ?? [])),
      getEvents().then((res) => setEvents(res?.data ?? [])),
      getMyBooking('host').then((res) => setBookings(res?.data ?? [])),
    ];

    Promise.all(fetches)
      .catch(() => setError('Failed to load some data. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  // Filter to only the host's own listings
  const mySpaces = spaces.filter((s) => s.host_user_id === user?.id);
  const myEvents = events.filter((e) => e.host_user_id === user?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-display text-secondary-200 mb-8">Host Dashboard</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-secondary-200">Loading...</div>
      ) : (
        <div className="space-y-10">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card>
              <p className="text-sm text-gray-500 mb-1">My Spaces</p>
              <p className="text-3xl font-bold text-secondary-200">{mySpaces.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 mb-1">My Events</p>
              <p className="text-3xl font-bold text-secondary-200">{myEvents.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 mb-1">Incoming Bookings</p>
              <p className="text-3xl font-bold text-secondary-200">{bookings.length}</p>
            </Card>
          </div>

          {/* My Spaces */}
          <section>
            <h2 className="text-2xl font-bold font-display text-secondary-200 mb-4">My Spaces</h2>
            {mySpaces.length === 0 ? (
              <p className="text-secondary-200 py-4">You haven&apos;t listed any spaces yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mySpaces.map((space) => (
                  <Link
                    key={space.id}
                    to={`/listings/space/${space.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <h3 className="font-semibold text-secondary-200 mb-1">{space.name}</h3>
                    <p className="text-sm text-gray-500">
                      {space.city}{space.country ? `, ${space.country}` : ''}
                    </p>
                    <p className="text-sm text-secondary-200 mt-1">Capacity: {space.capacity}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* My Events */}
          <section>
            <h2 className="text-2xl font-bold font-display text-secondary-200 mb-4">My Events</h2>
            {myEvents.length === 0 ? (
              <p className="text-secondary-200 py-4">You haven&apos;t created any events yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/listings/event/${event.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-secondary-200">{event.title}</h3>
                      {event.price_per_spot != null && (
                        <span className="text-sm font-bold text-primary-200 ml-2">
                          ${Number(event.price_per_spot).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {event.category && (
                      <span className="inline-block text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 mb-1">
                        {event.category}
                      </span>
                    )}
                    {event.start_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(event.start_at).toLocaleDateString()}
                      </p>
                    )}
                    <span
                      className={`inline-block mt-2 text-xs px-2 py-0.5 rounded font-semibold ${
                        event.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {event.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Incoming Bookings */}
          <section>
            <h2 className="text-2xl font-bold font-display text-secondary-200 mb-4">
              Incoming Bookings
            </h2>
            {bookings.length === 0 ? (
              <p className="text-secondary-200 py-4">No bookings yet.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => {
                  const statusStyle =
                    STATUS_STYLES[booking.payment_status] ?? 'bg-gray-100 text-gray-800';
                  const label = booking.event_id
                    ? `Event #${booking.event_id}`
                    : `Space #${booking.space_id}`;

                  return (
                    <div
                      key={booking.id}
                      className="flex justify-between items-center border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div>
                        <p className="font-semibold text-secondary-200">{label}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {booking.quantity} · Booked{' '}
                          {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusStyle}`}>
                          {booking.payment_status}
                        </span>
                        <p className="text-lg font-bold text-secondary-200 mt-1">
                          ${Number(booking.total_price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
