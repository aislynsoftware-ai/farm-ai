import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Globe,
  MessageCircle,
  Link as LinkIcon,
  Play,
} from 'lucide-react';
import navigationData from '../../data/navigation';

const socials = [
  {
    icon: Globe,
    href: '#',
    label: 'GitHub',
  },
  {
    icon: MessageCircle,
    href: '#',
    label: 'Twitter',
  },
  {
    icon: LinkIcon,
    href: '#',
    label: 'LinkedIn',
  },
  {
    icon: Play,
    href: '#',
    label: 'YouTube',
  },
];

export default function Footer() {
  const { footer } = navigationData;
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-emerald-950 dark:bg-black text-emerald-200 overflow-hidden border-t border-emerald-800/50">

      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.06),transparent_50%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">

          {/* ========================================= */}
          {/* BRAND COLUMN */}
          {/* ========================================= */}
          <div className="lg:col-span-1">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 mb-5 group w-fit"
            >
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Farmlyt AI"
                  className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                />

                {/* Logo Glow */}
                <span className="absolute inset-0 rounded-lg bg-emerald-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>

              <span className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">
                Farmlyt AI
              </span>
            </Link>

            {/* Description */}
            <p className="text-emerald-300 leading-relaxed mb-6 text-sm max-w-xs">
              {footer.description}
            </p>

            {/* Social Icons */}
            <div className="flex gap-2.5 mb-6">
              {socials.map((social) => {
                const Icon = social.icon;

                return (
                  <div
                    key={social.label}
                    className="relative group/social"
                  >
                    <a
                      href={social.href}
                      aria-label={social.label}
                      className="
                        w-10 h-10
                        rounded-xl
                        bg-emerald-900/80
                        border border-emerald-800/60
                        flex items-center justify-center
                        text-emerald-400
                        hover:bg-emerald-500
                        hover:text-white
                        hover:border-emerald-400
                        hover:shadow-lg
                        hover:shadow-emerald-500/25
                        transition-all
                        duration-300
                        hover:-translate-y-1
                      "
                    >
                      <Icon
                        size={17}
                        className="transition-transform duration-300 group-hover/social:scale-110"
                      />
                    </a>

                    {/* Tooltip */}
                    <span
                      className="
                        absolute
                        bottom-full
                        left-1/2
                        -translate-x-1/2
                        mb-2
                        px-2.5
                        py-1
                        rounded-md
                        bg-gray-900
                        border border-emerald-800
                        text-white
                        text-[10px]
                        whitespace-nowrap
                        opacity-0
                        invisible
                        group-hover/social:opacity-100
                        group-hover/social:visible
                        transition-all
                        duration-200
                        pointer-events-none
                        z-20
                      "
                    >
                      {social.label}

                      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ========================================= */}
            {/* GOOGLE PLAY BUTTON */}
            {/* ========================================= */}
            <a
              href="https://play.google.com/store/apps/details?id=com.farmlytai.com&hl=en_IN"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Farmlyt AI from Google Play"
              className="
                group
                relative
                inline-flex
                items-center
                gap-2.5
                px-4
                py-2.5
                rounded-xl
                bg-black
                border
                border-gray-700
                hover:border-gray-500
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-xl
                hover:shadow-black/40
              "
            >
              {/* Play Store Icon (official multicolor triangle) */}
              <svg
                viewBox="0 0 512 512"
                className="w-7 h-7 flex-shrink-0"
                aria-hidden="true"
              >
                <path fill="#00D0FF" d="M119.6 12.6c-5.1 5.4-8.1 13.7-8.1 24.6v437.6c0 10.9 3 19.2 8.2 24.5l1.3 1.2L367.8 256v-5.8L120.9 11.4l-1.3 1.2z" />
                <path fill="#00F076" d="M451 336.9l-83.2-83.2v-5.9L451 164.6l1.9 1.1 98.6 56c28.2 16 28.2 42.2 0 58.2l-98.6 56-1.9 1z" />
                <path fill="#FF3A44" d="M451.3 336.8L367.8 253 119.6 501.3c9.4 9.9 24.8 11.1 42.3 1.3l289.4-165.8" />
                <path fill="#FFCF00" d="M451.3 169.2L161.9 3.4c-17.5-10-32.9-8.7-42.3 1.3l248.2 248.3 83.5-83.8z" />
              </svg>

              {/* Text */}
              <span className="flex flex-col leading-tight text-left">
                <span className="text-[10px] text-gray-300">
                  GET IT ON
                </span>
                <span className="text-lg font-medium text-white -mt-0.5 tracking-tight">
                  Google Play
                </span>
              </span>
            </a>

            {/* Small Download Text */}
            <p className="mt-2 text-[10px] text-emerald-700">
              Download the Farmlyt AI mobile app
            </p>
          </div>


          {/* ========================================= */}
          {/* QUICK LINKS */}
          {/* ========================================= */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm tracking-wide flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-emerald-500" />
              Quick Links
            </h3>

            <ul className="space-y-3">
              {footer.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="
                      group
                      inline-flex
                      items-center
                      gap-1.5
                      text-sm
                      text-emerald-400
                      hover:text-white
                      transition-all
                      duration-200
                    "
                  >
                    <span className="relative">
                      {link.label}

                      <span
                        className="
                          absolute
                          -bottom-1
                          left-0
                          w-full
                          h-px
                          bg-emerald-400
                          rounded-full
                          scale-x-0
                          group-hover:scale-x-100
                          transition-transform
                          duration-300
                          origin-left
                        "
                      />
                    </span>

                    <ArrowUpRight
                      size={12}
                      className="
                        opacity-0
                        -translate-y-1
                        group-hover:opacity-100
                        group-hover:translate-y-0
                        transition-all
                        duration-200
                      "
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* ========================================= */}
          {/* SERVICES */}
          {/* ========================================= */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm tracking-wide flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-emerald-500" />
              Services
            </h3>

            <ul className="space-y-3">
              {footer.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="
                      group
                      inline-flex
                      items-center
                      gap-1.5
                      text-sm
                      text-emerald-400
                      hover:text-white
                      transition-all
                      duration-200
                    "
                  >
                    <span className="relative">
                      {link.label}

                      <span
                        className="
                          absolute
                          -bottom-1
                          left-0
                          w-full
                          h-px
                          bg-emerald-400
                          rounded-full
                          scale-x-0
                          group-hover:scale-x-100
                          transition-transform
                          duration-300
                          origin-left
                        "
                      />
                    </span>

                    <ArrowUpRight
                      size={12}
                      className="
                        opacity-0
                        -translate-y-1
                        group-hover:opacity-100
                        group-hover:translate-y-0
                        transition-all
                        duration-200
                      "
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* ========================================= */}
          {/* CONTACT */}
          {/* ========================================= */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm tracking-wide flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-emerald-500" />
              Contact
            </h3>

            <ul className="space-y-4">

              {/* Email */}
              <li>
                <a
                  href={`mailto:${footer.contact.email}`}
                  className="
                    group
                    flex
                    items-start
                    gap-3
                    text-sm
                    text-emerald-400
                    hover:text-white
                    transition-all
                    duration-200
                  "
                >
                  <span
                    className="
                      flex-shrink-0
                      w-8
                      h-8
                      rounded-lg
                      bg-emerald-900/70
                      border
                      border-emerald-800/50
                      flex
                      items-center
                      justify-center
                      group-hover:bg-emerald-500
                      group-hover:border-emerald-400
                      group-hover:text-white
                      transition-all
                      duration-300
                    "
                  >
                    <Mail size={14} />
                  </span>

                  <span className="pt-1.5 break-all">
                    {footer.contact.email}
                  </span>
                </a>
              </li>


              {/* Phone */}
              <li>
                <a
                  href={`tel:${footer.contact.phone}`}
                  className="
                    group
                    flex
                    items-start
                    gap-3
                    text-sm
                    text-emerald-400
                    hover:text-white
                    transition-all
                    duration-200
                  "
                >
                  <span
                    className="
                      flex-shrink-0
                      w-8
                      h-8
                      rounded-lg
                      bg-emerald-900/70
                      border
                      border-emerald-800/50
                      flex
                      items-center
                      justify-center
                      group-hover:bg-emerald-500
                      group-hover:border-emerald-400
                      group-hover:text-white
                      transition-all
                      duration-300
                    "
                  >
                    <Phone size={14} />
                  </span>

                  <span className="pt-1.5">
                    {footer.contact.phone}
                  </span>
                </a>
              </li>


              {/* WhatsApp */}
              <li>
                <a
                  href={`https://wa.me/${footer.contact.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group
                    flex
                    items-start
                    gap-3
                    text-sm
                    text-emerald-400
                    hover:text-white
                    transition-all
                    duration-200
                  "
                >
                  <span
                    className="
                      flex-shrink-0
                      w-8
                      h-8
                      rounded-lg
                      bg-emerald-900/70
                      border
                      border-emerald-800/50
                      flex
                      items-center
                      justify-center
                      group-hover:bg-emerald-500
                      group-hover:border-emerald-400
                      group-hover:text-white
                      transition-all
                      duration-300
                    "
                  >
                    <MessageCircle size={14} />
                  </span>

                  <span className="pt-1.5">
                    {footer.contact.whatsapp}
                  </span>
                </a>
              </li>


              {/* Address */}
              <li>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=MC+Layout+Vijayanagar+Bengaluru+Karnataka+560040"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group
                    flex
                    items-start
                    gap-3
                    text-sm
                    text-emerald-400
                    hover:text-white
                    transition-all
                    duration-200
                  "
                >
                  <span
                    className="
                      flex-shrink-0
                      w-8
                      h-8
                      rounded-lg
                      bg-emerald-900/70
                      border
                      border-emerald-800/50
                      flex
                      items-center
                      justify-center
                      group-hover:bg-emerald-500
                      group-hover:border-emerald-400
                      group-hover:text-white
                      transition-all
                      duration-300
                    "
                  >
                    <MapPin size={14} />
                  </span>

                  <span className="pt-1 leading-relaxed">
                    {footer.contact.address}
                  </span>
                </a>
              </li>

            </ul>
          </div>
        </div>


        {/* ========================================= */}
        {/* BOTTOM FOOTER */}
        {/* ========================================= */}
        <div className="border-t border-emerald-800/70 pt-6">

          <div className="flex flex-col md:flex-row justify-between items-center gap-5">

            {/* Copyright */}
            <p className="text-xs text-emerald-500 text-center md:text-left">
              &copy; {year} Farmlyt AI. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-emerald-500">

              <Link
                to="/privacy"
                className="group relative hover:text-emerald-300 transition-colors duration-200"
              >
                Privacy Policy

                <span
                  className="
                    absolute
                    -bottom-1
                    left-0
                    w-full
                    h-px
                    bg-emerald-400
                    scale-x-0
                    group-hover:scale-x-100
                    transition-transform
                    duration-300
                    origin-left
                  "
                />
              </Link>

              <Link
                to="/terms"
                className="group relative hover:text-emerald-300 transition-colors duration-200"
              >
                Terms of Service

                <span
                  className="
                    absolute
                    -bottom-1
                    left-0
                    w-full
                    h-px
                    bg-emerald-400
                    scale-x-0
                    group-hover:scale-x-100
                    transition-transform
                    duration-300
                    origin-left
                  "
                />
              </Link>

              <Link
                to="/cookies"
                className="group relative hover:text-emerald-300 transition-colors duration-200"
              >
                Cookie Policy

                <span
                  className="
                    absolute
                    -bottom-1
                    left-0
                    w-full
                    h-px
                    bg-emerald-400
                    scale-x-0
                    group-hover:scale-x-100
                    transition-transform
                    duration-300
                    origin-left
                  "
                />
              </Link>

            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
