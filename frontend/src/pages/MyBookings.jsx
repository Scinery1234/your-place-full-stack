import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBooking } from '@/api/bookings';
import Button from '@/components/ui/Button';

const STATUS_STYLES = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyBooking('mine')
      .then((res) => setBookings(res?.data ?? []))
      .catch(() => setError('Failed to load bookings. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-display text-secondary-200 mb-8">My Bookings</h1>

      {loading && (
        <div className="text-center py-16 text-secondary-200">Loading bookings...</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-16">
          <p className="text-secondary-200 mb-6 text-lg">You don&apos;t have any bookings yet.</p>
          <Link to="/explore">
            <Button variant="primary">Explore Spaces &amp; Events</Button>
          </Link>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isEvent = !!booking.event_id;
            const listingLabel = isEvent
              ? `Event #${booking.event_id}`
              : `Space #${booking.space_id}`;
            const detailPath = isEvent
              ? `/listings/event/${booking.event_id}`
              : `/listings/space/${booking.space_id}`;
            const statusStyle =
              STATUS_STYLES[booking.payment_status] ?? 'bg-gray-100 text-gray-800';

            return (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <Link to={detailPath} className="hover:underline">
                      <h2 className="text-lg font-semibold text-secondary-200">{listingLabel}</h2>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      Booked on {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-secondary-200 mt-1">
                      Quantity: {booking.quantity}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusStyle}`}>
                      {booking.payment_status}
                    </span>
                    <p className="text-xl font-bold text-secondary-200 mt-2">
                      ${Number(booking.total_price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
