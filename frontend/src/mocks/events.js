// Mock events data for demo mode
export const mockEvents = [
  {
    id: 'event-1',
    title: 'Weekend Art Workshop',
    description:
      'Join us for a fun weekend art workshop! Learn painting techniques and create your own masterpiece. All skill levels welcome.',
    category: 'Creative',
    capacity: 15,
    price: 45,
    date: '2024-02-15',
    time: '10:00 AM',
    location: 'Cozy Art Studio',
    host: {
      id: 'host-1',
      name: 'Sarah Johnson',
    },
    attendees: 8,
  },
  {
    id: 'event-2',
    title: 'Morning Yoga Flow',
    description:
      'Start your day with a rejuvenating yoga session. Suitable for all levels. Mats and props provided.',
    category: 'Relaxation/Wellness',
    capacity: 20,
    price: 18,
    date: '2024-02-10',
    time: '7:00 AM',
    location: 'Yoga & Meditation Room',
    host: {
      id: 'host-2',
      name: 'Michael Chen',
    },
    attendees: 12,
  },
  {
    id: 'event-3',
    title: 'DIY Furniture Restoration',
    description:
      'Learn how to restore and refinish furniture. Bring your own piece or work on a provided project.',
    category: 'Learning/Study',
    capacity: 8,
    price: 55,
    date: '2024-02-20',
    time: '2:00 PM',
    location: 'Modern Workshop Space',
    host: {
      id: 'host-3',
      name: 'Emma Rodriguez',
    },
    attendees: 5,
  },
  {
    id: 'event-4',
    title: 'Community Garden Party',
    description:
      'Join neighbors for a fun community gathering! Food, music, and games. All ages welcome.',
    category: 'Social/Community',
    capacity: 50,
    price: 10,
    date: '2024-02-18',
    time: '4:00 PM',
    location: 'Garden Party Venue',
    host: {
      id: 'host-4',
      name: 'David Thompson',
    },
    attendees: 35,
  },
];

export const getMockEvent = (id) => {
  return mockEvents.find((event) => event.id === id);
};
