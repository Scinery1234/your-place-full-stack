import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBookings } from '@/mocks/bookings';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Dashboard() {
  const { user } = useAuth();
  const bookings = getUserBookings(user?.id);

  const isHost = user?.role === 'host' || user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-display text-secondary-200 mb-2">
          Welcome back, {user?.fullName || user?.email}!
        </h1>
        <div className="flex items-center gap-2 mt-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              isHost
                ? 'bg-secondary-100 text-primary-100'
                : 'bg-primary-200 text-primary-100'
            }`}
          >
            {isHost ? 'Host' : 'User'}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-xl font-semibold text-secondary-200 mb-2">Explore</h3>
          <p className="text-secondary-200 mb-4">Discover spaces and events</p>
          <Link to="/explore">
            <Button variant="primary" className="w-full">
              Browse Listings
            </Button>
          </Link>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-secondary-200 mb-2">My Bookings</h3>
          <p className="text-secondary-200 mb-4">View your upcoming bookings</p>
          <Link to="/bookings">
            <Button variant="secondary" className="w-full">
              View Bookings
            </Button>
          </Link>
        </Card>

        {isHost && (
          <Card>
            <h3 className="text-xl font-semibold text-secondary-200 mb-2">Host Dashboard</h3>
            <p className="text-secondary-200 mb-4">Manage your listings and bookings</p>
            <Link to="/host">
              <Button variant="primary" className="w-full">
                Go to Host Dashboard
              </Button>
            </Link>
          </Card>
        )}

        {!isHost && (
          <Card>
            <h3 className="text-xl font-semibold text-secondary-200 mb-2">Become a Host</h3>
            <p className="text-secondary-200 mb-4">Start sharing your space</p>
            <Link to="/become-host">
              <Button variant="outline" className="w-full">
                Apply to Host
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Recent Bookings */}
      <Card>
        <h2 className="text-2xl font-bold font-display text-secondary-200 mb-6">
          Recent Bookings
        </h2>
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-200">{booking.title}</h3>
                    <p className="text-sm text-secondary-200 mt-1">
                      {booking.date} {booking.startTime && `• ${booking.startTime}`}
                      {booking.time && `• ${booking.time}`}
                    </p>
                    <p className="text-sm text-secondary-200">
                      Host: {booking.host?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                    <p className="text-lg font-semibold text-secondary-200 mt-2">
                      ${booking.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {bookings.length > 3 && (
              <div className="mt-4 text-center">
                <Link to="/bookings">
                  <Button variant="outline">View All Bookings</Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-secondary-200 mb-4">You don&apos;t have any bookings yet.</p>
            <Link to="/explore">
              <Button variant="primary">Explore Spaces & Events</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
