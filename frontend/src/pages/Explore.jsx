import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSpaces, getEvents } from '@/api/listings';
import { mockSpaces } from '@/mocks/spaces';
import { mockEvents } from '@/mocks/events';

const TABS = ['spaces', 'events'];

export default function Explore() {
  const [tab, setTab] = useState('spaces');
  const [spaces, setSpaces] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetches = [
      getSpaces()
        .then((res) => setSpaces(res?.data ?? []))
        .catch(() => setSpaces(mockSpaces)),
      getEvents()
        .then((res) => setEvents(res?.data ?? []))
        .catch(() => setEvents(mockEvents)),
    ];

    Promise.all(fetches).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-display text-primary-500 mb-2">Explore</h1>
      <p className="text-secondary-200 mb-8">Find spaces to book or events to attend near you.</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-primary-200 text-primary-200'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-16 text-secondary-200">Loading listings...</div>
      )}

      {!loading && tab === 'spaces' && <SpaceGrid spaces={spaces} />}

      {!loading && tab === 'events' && <EventGrid events={events} />}
    </div>
  );
}

function SpaceGrid({ spaces }) {
  if (spaces.length === 0) {
    return (
      <div className="text-center py-16 text-secondary-200">
        No spaces available yet. Check back soon!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {spaces.map((space) => (
        <Link
          key={space.id}
          to={`/listings/space/${space.id}`}
          className="block border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow bg-white"
        >
          <h2 className="text-lg font-semibold text-secondary-200 mb-1">
            {space.name || space.title}
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            {space.city || space.location}
            {space.country ? `, ${space.country}` : ''}
          </p>
          {space.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{space.description}</p>
          )}
          <p className="text-sm text-secondary-200">Capacity: {space.capacity}</p>
        </Link>
      ))}
    </div>
  );
}

function EventGrid({ events }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-16 text-secondary-200">
        No events available yet. Check back soon!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Link
          key={event.id}
          to={`/listings/event/${event.id}`}
          className="block border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow bg-white"
        >
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-lg font-semibold text-secondary-200">{event.title}</h2>
            {event.price_per_spot != null && (
              <span className="text-sm font-bold text-primary-200 ml-2 flex-shrink-0">
                ${Number(event.price_per_spot).toFixed(2)}
              </span>
            )}
          </div>
          {event.category && (
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary-100/20 text-primary-300 mb-2">
              {event.category}
            </span>
          )}
          <p className="text-sm text-gray-500 mb-3">
            {event.space_name && `${event.space_name} · `}
            {event.city}
          </p>
          {event.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{event.description}</p>
          )}
          {event.start_at && (
            <p className="text-xs text-gray-400">
              {new Date(event.start_at).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
