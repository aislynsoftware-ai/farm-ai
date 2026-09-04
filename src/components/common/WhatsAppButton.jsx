import { MessageCircle, Smartphone } from 'lucide-react';

const WHATSAPP_NUMBER = '918892209021';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.farmlytai.com&hl=en_IN';

export default function WhatsAppButton() {
  return (
    <>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl hover:shadow-emerald-600/30 shadow-emerald-600/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
        aria-label="Get the app on Google Play"
      >
        <Smartphone size={26} className="text-white group-hover:rotate-6 transition-transform duration-300" />
      </a>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl hover:shadow-green-500/30 shadow-green-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} className="text-white group-hover:rotate-6 transition-transform duration-300" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white dark:border-gray-900 animate-pulse" />
      </a>
    </>
  );
}
