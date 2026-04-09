import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSpacesById, getEventsById } from '@/api/listings';
import { createBooking } from '@/api/bookings';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

export default function ListingDetail() {
  const { type, id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState({ quantity: 1, status: null, error: null });

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetch = type === 'event' ? getEventsById(id) : getSpacesById(id);

    fetch
      .then((res) => setListing(res?.data ?? null))
      .catch(() => setError('Listing not found or failed to load.'))
      .finally(() => setLoading(false));
  }, [type, id]);

  const handleBook = async () => {
    if (!user) return;
    setBooking((b) => ({ ...b, status: 'loading', error: null }));

    try {
      const payload =
        type === 'event'
          ? {
              eventId: Number(id),
              quantity: booking.quantity,
              totalPrice: Number(listing.price_per_spot) * booking.quantity,
            }
          : {
              spaceId: Number(id),
              quantity: booking.quantity,
              totalPrice: booking.quantity,
            };

      await createBooking(payload);
      setBooking((b) => ({ ...b, status: 'success' }));
    } catch (err) {
      setBooking((b) => ({
        ...b,
        status: 'error',
        error: err.response?.data?.message || 'Failed to create booking.',
      }));
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-secondary-200">
        Loading...
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
          {error ?? 'Listing not found.'}
        </div>
        <Link to="/explore">
          <Button variant="outline">Back to Explore</Button>
        </Link>
      </div>
    );
  }

  const isEvent = type === 'event';
  const title = isEvent ? listing.title : listing.name;
  const location = isEvent
    ? `${listing.space_name ? listing.space_name + ' · ' : ''}${listing.city ?? ''}`
    : `${listing.address ? listing.address + ', ' : ''}${listing.city ?? ''}${listing.country ? ', ' + listing.country : ''}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/explore" className="text-sm text-gray-500 hover:underline mb-6 inline-block">
        ← Back to Explore
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-primary-100/20 text-primary-300 mb-2 capitalize">
                {type}
              </span>
              <h1 className="text-3xl font-bold font-display text-secondary-200">{title}</h1>
            </div>
            {isEvent && listing.price_per_spot != null && (
              <p className="text-2xl font-bold text-primary-200 flex-shrink-0">
                ${Number(listing.price_per_spot).toFixed(2)}<span className="text-sm font-normal text-gray-500">/spot</span>
              </p>
            )}
          </div>

          {location && (
            <p className="text-gray-500 mt-2">{location}</p>
          )}

          {isEvent && listing.category && (
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
              {listing.category}
            </span>
          )}
        </div>

        {/* Details */}
        {listing.description && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-secondary-200 mb-2">About</h2>
            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Capacity</p>
            <p className="text-lg font-semibold text-secondary-200">{listing.capacity}</p>
          </div>
          {isEvent && listing.start_at && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Date & Time</p>
              <p className="text-sm font-semibold text-secondary-200">
                {new Date(listing.start_at).toLocaleString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
        </div>

        {/* Booking */}
        {booking.status === 'success' ? (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 text-center">
            <p className="font-semibold">Booking submitted!</p>
            <p className="text-sm mt-1">Check your bookings for status updates.</p>
            <Link to="/bookings" className="mt-3 inline-block">
              <Button variant="primary">View My Bookings</Button>
            </Link>
          </div>
        ) : user ? (
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-secondary-200 mb-4">Book this {type}</h2>
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm text-gray-600">Quantity</label>
              <input
                type="number"
                min="1"
                max={listing.capacity}
                value={booking.quantity}
                onChange={(e) =>
                  setBooking((b) => ({ ...b, quantity: Math.max(1, Number(e.target.value)) }))
                }
                className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
            {booking.error && (
              <p className="text-red-600 text-sm mb-3">{booking.error}</p>
            )}
            <Button
              variant="primary"
              onClick={handleBook}
              disabled={booking.status === 'loading'}
            >
              {booking.status === 'loading' ? 'Booking...' : `Book now`}
            </Button>
          </div>
        ) : (
          <div className="border-t border-gray-100 pt-6 text-center">
            <p className="text-secondary-200 mb-4">Sign in to book this {type}.</p>
            <Link to="/login" state={{ from: `/listings/${type}/${id}` }}>
              <Button variant="primary">Log in to Book</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
