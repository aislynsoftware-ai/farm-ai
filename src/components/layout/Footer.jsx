import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin, ArrowUpRight, Globe, MessageCircle, Link as LinkIcon, Play } from 'lucide-react';
import navigationData from '../../data/navigation';

const socials = [
  { icon: Globe, href: '#', label: 'GitHub' },
  { icon: MessageCircle, href: '#', label: 'Twitter' },
  { icon: LinkIcon, href: '#', label: 'LinkedIn' },
  { icon: Play, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const { footer } = navigationData;
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-emerald-950 dark:bg-black text-emerald-200 overflow-hidden border-t border-emerald-800/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.06),transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-10">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <img src="/logo.png" alt="Farmlyt AI" className="h-9 w-auto" />
              <span className="text-xl font-bold text-white">Farmlyt AI</span>
            </Link>
            <p className="text-emerald-300 leading-relaxed mb-5 text-xs">
              {footer.description}
            </p>
            <div className="flex gap-2.5">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg bg-emerald-900 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">Quick Links</h3>
            <ul className="space-y-2">
              {footer.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="group relative inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-all duration-200"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-emerald-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </span>
                    <ArrowUpRight size={10} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">Services</h3>
            <ul className="space-y-2">
              {footer.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="group relative inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-all duration-200"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-emerald-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </span>
                    <ArrowUpRight size={10} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">Contact</h3>
            <ul className="space-y-3">
              <li className="group flex items-start gap-3 text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
                <Mail size={14} className="mt-0.5 text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span className="relative">
                  {footer.contact.email}
                  <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-emerald-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </span>
              </li>
              <li className="group flex items-start gap-3 text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
                <Phone size={14} className="mt-0.5 text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span className="relative">
                  {footer.contact.phone}
                  <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-emerald-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </span>
              </li>
              <li className="group flex items-start gap-3 text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
                <MessageCircle size={14} className="mt-0.5 text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span className="relative">
                  {footer.contact.whatsapp}
                  <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-emerald-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </span>
              </li>


              <li className="group flex items-start gap-3 text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
                <MapPin size={14} className="mt-0.5 text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span className="relative">
                  {footer.contact.address}
                  <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-emerald-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-emerald-500">
            &copy; {year} Farmlyt AI. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-emerald-500">
            <Link to="/privacy" className="group relative hover:text-emerald-300 transition-colors duration-200">
              <span className="relative">
                Privacy Policy
                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-emerald-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </span>
            </Link>
            <Link to="/terms" className="group relative hover:text-emerald-300 transition-colors duration-200">
              <span className="relative">
                Terms of Service
                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-emerald-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </span>
            </Link>
            <Link to="/cookies" className="group relative hover:text-emerald-300 transition-colors duration-200">
              <span className="relative">
                Cookie Policy
                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-emerald-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
