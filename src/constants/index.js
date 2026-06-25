export const APP_NAME = 'Farmlyt AI';

export const APP_DESCRIPTION = 'AI-Powered Smart Agriculture Platform';

export const SITE_URL = 'https://www.farmlytai.in';
export const SITE_EMAIL = 'support@farmlytai.in';
export const SITE_PHONE = '+91-8892209021';
export const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  FEATURES: '/features',
  CONTACT: '/contact',
  RESEARCH: '/research',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  COOKIES: '/cookies',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY: '/verify-otp',
  PREDICT: '/predict',
  WALLET: '/wallet',
  BLOGS: '/blogs',
  PRICING: '/pricing',
  DEVELOPERS: '/developers',
  API_DOCS: '/api-docs',
  ENTERPRISE: '/enterprise',
  DASHBOARD_API_KEYS: '/dashboard/api-keys',
  DASHBOARD_DEVELOPER: '/dashboard/developer',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_AGRI_TITLES: '/admin/agri-titles',
  ADMIN_CROPS: '/admin/crops',
  ADMIN_SUB_CROPS: '/admin/sub-crops',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_PREDICTIONS: '/admin/predictions',
  ADMIN_PLANS: '/admin/plans',
  ADMIN_DOWNLOADS: '/admin/downloads',
  REGISTER_SHOP: '/register-shop',
};

export const NAV_LINKS = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'About', path: ROUTES.ABOUT },
  { label: 'Services', path: ROUTES.SERVICES },
  {
    label: 'Research',
    path: ROUTES.RESEARCH,
    children: [
      { label: 'Our Research', path: ROUTES.RESEARCH },
      
      { label: 'Features', path: ROUTES.FEATURES },
    ],
  },
  {
    label: 'Pricing',
    path: ROUTES.PRICING,
    children: [
      { label: 'Plans', path: ROUTES.PRICING },
      { label: 'Enterprise', path: ROUTES.ENTERPRISE },
      { label: 'API Docs', path: ROUTES.API_DOCS },
      { label: 'Developers', path: ROUTES.DEVELOPERS },
      { label: 'Register as a Shop', path: ROUTES.REGISTER_SHOP },
    ],
  },
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
  title: 'Farmlyt AI - AI-Powered Smart Agriculture Platform',
  description:
    'Detect plant diseases, identify crops, analyze food items, and gain intelligent agricultural insights using advanced artificial intelligence.',
  primaryBtn: 'Get Started',
  secondaryBtn: 'Explore Services',
};
