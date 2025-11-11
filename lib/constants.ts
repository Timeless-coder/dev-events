// lib/constants.ts
// List of upcoming or popular developer events

export type Event = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  url: string;
};

export const events: Event[] = [
  {
    id: 'jsconf2025',
    name: 'JSConf EU 2025',
    date: '2025-12-05',
    time: '09:00 - 18:00',
    location: 'Berlin, Germany',
    description: 'Europe’s leading JavaScript conference, bringing together JS enthusiasts and experts from around the world.',
    image: '/images/event1.png',
    url: 'https://2025.jsconf.eu/',
  },
  {
    id: 'reactsummit',
    name: 'React Summit 2025',
    date: '2025-11-20',
    time: '10:00 - 17:00',
    location: 'Amsterdam, Netherlands',
    description: 'The largest React conference worldwide, featuring talks, workshops, and networking for React developers.',
    image: '/images/event2.png',
    url: 'https://reactsummit.com/',
  },
  {
    id: 'hacknyc',
    name: 'HackNYC 2025',
    date: '2025-12-12',
    time: '08:00 - 20:00',
    location: 'New York, USA',
    description: 'A 48-hour hackathon for students and professionals to build innovative solutions and win prizes.',
    image: '/images/event3.png',
    url: 'https://hacknyc.com/',
  },
  {
    id: 'pyconasia',
    name: 'PyCon Asia 2026',
    date: '2026-01-15',
    time: '09:30 - 18:30',
    location: 'Singapore',
    description: 'Asia’s largest Python conference, with workshops, keynotes, and community events.',
    image: '/images/event4.png',
    url: 'https://pycon.asia/',
  },
  {
    id: 'devfest',
    name: 'Google DevFest 2025',
    date: '2025-11-25',
    time: '11:00 - 19:00',
    location: 'London, UK',
    description: 'A global community-run developer event featuring Google technologies, talks, and codelabs.',
    image: '/images/event5.png',
    url: 'https://devfest.withgoogle.com/',
  },
  {
    id: 'fossasia',
    name: 'FOSSASIA Summit 2026',
    date: '2026-02-20',
    time: '10:00 - 18:00',
    location: 'Singapore',
    description: 'Open source technology conference with talks, workshops, and exhibitions.',
    image: '/images/event6.png',
    url: 'https://summit.fossasia.org/',
  },
];
