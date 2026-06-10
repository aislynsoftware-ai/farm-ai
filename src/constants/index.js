export const APP_NAME = 'Farmlyt AI';

export const APP_DESCRIPTION = 'AI-Powered Smart Agriculture Platform';

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  FEATURES: '/features',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  COOKIES: '/cookies',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY: '/verify-otp',
  PREDICT: '/predict',
};

export const NAV_LINKS = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'About', path: ROUTES.ABOUT },
  { label: 'Services', path: ROUTES.SERVICES },
  { label: 'Features', path: ROUTES.FEATURES },
  { label: 'Contact', path: ROUTES.CONTACT },
];

export const DASHBOARD_SIDEBAR = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Disease Detection', path: '/dashboard/disease', icon: 'Bug' },
  { label: 'Plant Identification', path: '/dashboard/plant', icon: 'Leaf' },
  { label: 'Food Identification', path: '/dashboard/food', icon: 'Apple' },
  { label: 'Reports', path: '/dashboard/reports', icon: 'FileText' },
  { label: 'Settings', path: '/dashboard/settings', icon: 'Settings' },
];

export const HERO = {
  title: 'AI-Powered Smart Agriculture Platform',
  description:
    'Detect plant diseases, identify crops, analyze food items, and gain intelligent agricultural insights using advanced artificial intelligence.',
  primaryBtn: 'Get Started',
  secondaryBtn: 'Explore Services',
};
