import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import Services from '../pages/Services';
import Features from '../pages/Features';
import Contact from '../pages/Contact';
import Dashboard from '../pages/Dashboard';

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
        { path: 'dashboard', element: <Dashboard /> },
      ],
    },
  ]);
}
