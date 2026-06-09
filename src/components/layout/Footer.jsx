import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import navigationData from '../../data/navigation';

export default function Footer() {
  const { footer } = navigationData;
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-900 dark:bg-black text-gray-300 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.08),transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Farm AI</span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm">
              {footer.description}
            </p>
            <div className="flex gap-3">
              {[Mail, Phone, MapPin].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <Icon size={16} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {footer.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200 group"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {footer.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200 group"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Mail size={16} className="mt-0.5 text-emerald-500 flex-shrink-0" />
                <span>{footer.contact.email}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Phone size={16} className="mt-0.5 text-emerald-500 flex-shrink-0" />
                <span>{footer.contact.phone}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={16} className="mt-0.5 text-emerald-500 flex-shrink-0" />
                <span>{footer.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {year} Farm AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
