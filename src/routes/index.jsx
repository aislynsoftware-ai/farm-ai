import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import AdminLayout from '../layouts/AdminLayout';
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
import Research from '../pages/Research';
import Blogs from '../pages/Blogs';
import BlogDetails from '../pages/BlogDetails';
import Landing from '../pages/Landing';
import Pricing from '../pages/Pricing';
import Developers from '../pages/Developers';
import ApiDocs from '../pages/ApiDocs';
import Enterprise from '../pages/Enterprise';
import DashboardApiKeys from '../pages/DashboardApiKeys';
import DashboardDeveloper from '../pages/DashboardDeveloper';
import PlanCheckout from '../pages/PlanCheckout';
import MyPlants from '../pages/MyPlants';
import Notifications from '../pages/Notifications';
import Community from '../pages/Community';
import RegisterShop from '../pages/RegisterShop';
import ShopOwnerDashboard from '../pages/ShopOwnerDashboard';
import AdminShopsPage from '../pages/AdminShopsPage';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminAgriTitlesPage from '../pages/AdminAgriTitlesPage';
import AdminCropsPage from '../pages/AdminCropsPage';
import AdminSubCropsPage from '../pages/AdminSubCropsPage';
import AdminProductsPage from '../pages/AdminProductsPage';
import AdminOrdersPage from '../pages/AdminOrdersPage';
import AdminPredictionsPage from '../pages/AdminPredictionsPage';
import AdminPlansPage from '../pages/AdminPlansPage';
import AdminApiPlansPage from '../pages/AdminApiPlansPage';
import AdminDownloadsPage from '../pages/AdminDownloadsPage';
import AdminAIServicesPage from '../pages/AdminAIServicesPage';
import AdminDailyTipsPage from '../pages/AdminDailyTipsPage';

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
        { path: 'research', element: <Research /> },
        { path: 'landing', element: <Landing /> },
        { path: 'blogs', element: <Blogs /> },
        { path: 'blog/:slug', element: <BlogDetails /> },
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
        { path: 'pricing', element: <Pricing /> },
        { path: 'developers', element: <Developers /> },
        { path: 'api-docs', element: <ApiDocs /> },
        { path: 'enterprise', element: <Enterprise /> },
        { path: 'plan-checkout', element: <PlanCheckout /> },
      ],
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
    {
      path: '/dashboard/api-keys',
      element: <DashboardApiKeys />,
    },
    {
      path: '/dashboard/developer',
      element: <DashboardDeveloper />,
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
    {
      path: '/my-plants',
      element: <MyPlants />,
    },
    {
      path: '/community',
      element: <Community />,
    },
    {
      path: '/notifications',
      element: <Notifications />,
    },
    {
      path: '/register-shop',
      element: <RegisterShop />,
    },
    {
      path: '/my-shop',
      element: <ShopOwnerDashboard />,
    },
    {
      path: '/admin/login',
      element: <AdminLogin />,
    },
    {
      path: '/admin',
      element: <AdminLayout isDark={isDark} toggleTheme={toggleTheme} />,
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: 'dashboard', element: <AdminDashboard /> },
        { path: 'users', element: <AdminUsersPage /> },
        { path: 'agri-titles', element: <AdminAgriTitlesPage /> },
        { path: 'crops', element: <AdminCropsPage /> },
        { path: 'sub-crops', element: <AdminSubCropsPage /> },
        { path: 'products', element: <AdminProductsPage /> },
        { path: 'orders', element: <AdminOrdersPage /> },
        { path: 'predictions', element: <AdminPredictionsPage /> },
        { path: 'plans', element: <AdminPlansPage /> },
        { path: 'api-plans', element: <AdminApiPlansPage /> },
        { path: 'downloads', element: <AdminDownloadsPage /> },
        { path: 'ai-services', element: <AdminAIServicesPage /> },
        { path: 'daily-tips', element: <AdminDailyTipsPage /> },
        { path: 'shops', element: <AdminShopsPage /> },
      ],
    },
  ]);
}
