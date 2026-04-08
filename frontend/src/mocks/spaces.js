// Mock spaces data for demo mode
export const mockSpaces = [
  {
    id: 'space-1',
    title: 'Cozy Art Studio',
    description:
      'A bright, inspiring art studio perfect for painting, drawing, or creative workshops. Natural light, easels, and all supplies included.',
    category: 'Creative',
    capacity: 8,
    price: 25,
    location: 'Downtown',
    images: ['/pexels-cottonbro-4009398.jpg'],
    host: {
      id: 'host-1',
      name: 'Sarah Johnson',
    },
    amenities: ['Natural Light', 'Art Supplies', 'WiFi', 'Parking'],
  },
  {
    id: 'space-2',
    title: 'Yoga & Meditation Room',
    description:
      'Peaceful space designed for yoga, meditation, and wellness activities. Includes mats, cushions, and calming ambiance.',
    category: 'Relaxation/Wellness',
    capacity: 12,
    price: 20,
    location: 'Westside',
    images: ['/pexels-polina-zimmerman-3747468.jpg'],
    host: {
      id: 'host-2',
      name: 'Michael Chen',
    },
    amenities: ['Mats Provided', 'Sound System', 'Temperature Control'],
  },
  {
    id: 'space-3',
    title: 'Modern Workshop Space',
    description:
      'Fully equipped workshop for crafts, DIY projects, or small business activities. Tools and workbenches available.',
    category: 'Learning/Study',
    capacity: 6,
    price: 30,
    location: 'Industrial District',
    images: ['/pexels-rui-dias-469842-1472887.jpg'],
    host: {
      id: 'host-3',
      name: 'Emma Rodriguez',
    },
    amenities: ['Power Tools', 'Workbenches', 'Storage', 'Safety Equipment'],
  },
  {
    id: 'space-4',
    title: 'Garden Party Venue',
    description:
      'Beautiful outdoor garden space perfect for celebrations, gatherings, or outdoor events. Includes seating and lighting.',
    category: 'Social/Community',
    capacity: 50,
    price: 150,
    location: 'Suburbs',
    images: ['/pexels-wilcle-nunes-38713774-27165070.jpg'],
    host: {
      id: 'host-4',
      name: 'David Thompson',
    },
    amenities: ['Outdoor Seating', 'Lighting', 'BBQ Area', 'Restrooms'],
  },
  {
    id: 'space-5',
    title: 'Private Music Studio',
    description:
      'Soundproofed music studio with recording equipment. Perfect for practice, recording, or music lessons.',
    category: 'Creative',
    capacity: 4,
    price: 40,
    location: 'Arts District',
    images: ['/pexels-yankrukov-9072394.jpg'],
    host: {
      id: 'host-5',
      name: 'Lisa Park',
    },
    amenities: ['Recording Equipment', 'Instruments', 'Soundproofing', 'WiFi'],
  },
  {
    id: 'space-6',
    title: 'Quiet Study Library',
    description:
      'Peaceful library space with desks, comfortable seating, and quiet atmosphere. Perfect for focused study or reading.',
    category: 'Learning/Study',
    capacity: 10,
    price: 15,
    location: 'University Area',
    images: ['/pexels-roman-odintsov-8063880.jpg'],
    host: {
      id: 'host-6',
      name: 'James Wilson',
    },
    amenities: ['Desks', 'WiFi', 'Quiet Environment', 'Coffee Available'],
  },
];

export const getMockSpace = (id) => {
  return mockSpaces.find((space) => space.id === id);
};
