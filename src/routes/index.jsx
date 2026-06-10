import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import Services from '../pages/Services';
import Features from '../pages/Features';
import Contact from '../pages/Contact';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyOtp from '../pages/VerifyOtp';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import CookiePolicy from '../pages/CookiePolicy';

export default function createAppRouter(isDark, toggleTheme) {
  return createBrowserRouter([
    {
      path: '/',
      element: <RootLayout isDark={isDark} toggleTheme={toggleTheme} />,
      children: [
        { index: true, element: <Home /> },
        { path: 'about', element: <About /> },
        { path: 'services', element: <Services /> },
        { path: 'features', element: <Features /> },
        { path: 'contact', element: <Contact /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'verify-otp', element: <VerifyOtp /> },
        { path: 'privacy', element: <PrivacyPolicy /> },
        { path: 'terms', element: <TermsOfService /> },
        { path: 'cookies', element: <CookiePolicy /> },
      ],
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
    {
      path: '/profile',
      element: <Profile />,
    },
  ]);
}
