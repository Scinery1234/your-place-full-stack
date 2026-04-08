// Mock bookings data for demo mode
export const mockUserBookings = [
  {
    id: 'booking-1',
    type: 'space',
    spaceId: 'space-1',
    title: 'Cozy Art Studio',
    date: '2024-02-12',
    startTime: '10:00 AM',
    endTime: '2:00 PM',
    price: 100,
    status: 'confirmed',
    host: {
      name: 'Sarah Johnson',
    },
  },
  {
    id: 'booking-2',
    type: 'event',
    eventId: 'event-2',
    title: 'Morning Yoga Flow',
    date: '2024-02-10',
    time: '7:00 AM',
    price: 18,
    status: 'confirmed',
    host: {
      name: 'Michael Chen',
    },
  },
  {
    id: 'booking-3',
    type: 'space',
    spaceId: 'space-6',
    title: 'Quiet Study Library',
    date: '2024-02-08',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    price: 120,
    status: 'pending',
    host: {
      name: 'James Wilson',
    },
  },
];

export const mockHostBookings = [
  {
    id: 'host-booking-1',
    type: 'space',
    spaceId: 'space-1',
    title: 'Cozy Art Studio',
    guestName: 'John Doe',
    date: '2024-02-12',
    startTime: '10:00 AM',
    endTime: '2:00 PM',
    price: 100,
    status: 'confirmed',
  },
  {
    id: 'host-booking-2',
    type: 'space',
    spaceId: 'space-1',
    title: 'Cozy Art Studio',
    guestName: 'Jane Smith',
    date: '2024-02-14',
    startTime: '3:00 PM',
    endTime: '6:00 PM',
    price: 75,
    status: 'pending',
  },
];

export const getUserBookings = (userId) => {
  // In demo mode, return mock bookings for demo user
  if (userId === 'demo-user-1' || userId?.startsWith('demo-')) {
    return mockUserBookings;
  }
  return [];
};

export const getHostBookings = (hostId) => {
  // In demo mode, return mock bookings for demo host
  if (hostId === 'demo-host-1' || hostId?.startsWith('demo-')) {
    return mockHostBookings;
  }
  return [];
};
