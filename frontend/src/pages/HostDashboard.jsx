import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSpaces, getEvents } from '@/api/listings';
import { getMyBooking } from '@/api/bookings';
import { useAuth } from '@/contexts/AuthContext';
import { mockSpaces } from '@/mocks/spaces';
import { mockEvents } from '@/mocks/events';
import { mockHostBookings } from '@/mocks/bookings';
import Card from '@/components/ui/Card';

const STATUS_STYLES = {
  paid: 'bg-green-100 text-green-800',
  confirmed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function HostDashboard() {
  const { user, isDemoMode } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      setSpaces(mockSpaces);
      setEvents(mockEvents);
      setBookings(mockHostBookings);
      setLoading(false);
      return;
    }

    const fetches = [
      getSpaces()
        .then((res) => setSpaces(res?.data ?? []))
        .catch(() => setSpaces(mockSpaces)),
      getEvents()
        .then((res) => setEvents(res?.data ?? []))
        .catch(() => setEvents(mockEvents)),
      getMyBooking('host')
        .then((res) => setBookings(res?.data ?? []))
        .catch(() => setBookings([])),
    ];

    Promise.all(fetches).finally(() => setLoading(false));
  }, [isDemoMode]);

  // In demo mode show all mock listings; otherwise filter to this host's own
  const mySpaces = isDemoMode ? spaces : spaces.filter((s) => s.host_user_id === user?.id);
  const myEvents = isDemoMode ? events : events.filter((e) => e.host_user_id === user?.id);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-secondary-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-display text-secondary-200 mb-8">Host Dashboard</h1>

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
                  <h3 className="font-semibold text-secondary-200 mb-1">
                    {space.name || space.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {space.city || space.location}
                    {space.country ? `, ${space.country}` : ''}
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
              {myEvents.map((event) => {
                const price = event.price_per_spot ?? event.price ?? null;
                const dateStr = event.start_at
                  ? new Date(event.start_at).toLocaleDateString()
                  : event.date ?? '';
                const status = event.status ?? 'active';

                return (
                  <Link
                    key={event.id}
                    to={`/listings/event/${event.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-secondary-200">{event.title}</h3>
                      {price != null && (
                        <span className="text-sm font-bold text-primary-200 ml-2">
                          ${Number(price).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {event.category && (
                      <span className="inline-block text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 mb-1">
                        {event.category}
                      </span>
                    )}
                    {dateStr && (
                      <p className="text-xs text-gray-400 mt-1">{dateStr}</p>
                    )}
                    <span
                      className={`inline-block mt-2 text-xs px-2 py-0.5 rounded font-semibold ${
                        status === 'published' || status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {status}
                    </span>
                  </Link>
                );
              })}
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
                const statusText = booking.status || booking.payment_status || 'pending';
                const statusStyle = STATUS_STYLES[statusText] ?? 'bg-gray-100 text-gray-800';
                const label =
                  booking.title ||
                  (booking.event_id ? `Event #${booking.event_id}` : `Space #${booking.space_id}`);
                const price = booking.price ?? Number(booking.total_price ?? 0);
                const dateStr = booking.date
                  || (booking.created_at ? new Date(booking.created_at).toLocaleDateString() : '');

                return (
                  <div
                    key={booking.id}
                    className="flex justify-between items-center border border-gray-200 rounded-lg p-4 bg-white"
                  >
                    <div>
                      <p className="font-semibold text-secondary-200">{label}</p>
                      <p className="text-sm text-gray-500">
                        {booking.guestName && `${booking.guestName} · `}
                        {dateStr}
                        {booking.startTime && ` · ${booking.startTime}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusStyle}`}>
                        {statusText}
                      </span>
                      <p className="text-lg font-bold text-secondary-200 mt-1">
                        ${Number(price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
