import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/common/ScrollToTop';

export default function RootLayout({ isDark, toggleTheme }) {
  return (
    <>
      <ScrollToTop />
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
