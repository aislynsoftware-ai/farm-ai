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
import Predict from '../pages/Predict';
import Wallet from '../pages/Wallet';
import AgricultureDetail from '../pages/AgricultureDetail';
import CropDetail from '../pages/CropDetail';
import SubCropDetail from '../pages/SubCropDetail';

function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
        <p className="text-sm text-gray-500 mb-4">Please try refreshing the page</p>
        <a href="/" className="text-xs text-emerald-600 hover:underline">Go Home</a>
      </div>
    </div>
  );
}

export default function createAppRouter(isDark, toggleTheme) {
  return createBrowserRouter([
    {
      path: '/',
      element: <RootLayout isDark={isDark} toggleTheme={toggleTheme} />,
      errorElement: <ErrorPage />,
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
        { path: 'agriculture/:id', element: <AgricultureDetail /> },
        { path: 'agriculture/:agriId/crop/:cropId', element: <CropDetail /> },
        { path: 'crop/:id', element: <SubCropDetail /> },
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
    {
      path: '/predict',
      element: <Predict />,
    },
    {
      path: '/wallet',
      element: <Wallet />,
    },
  ]);
}
