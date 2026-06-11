import { motion } from 'framer-motion';
import PageHeader from '../components/layout/PageHeader';
import { APP_NAME } from '../constants';

const sections = [
  {
    title: 'Acceptance of Terms',
    content:
      'By accessing or using the Farmlyt AI platform, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform. We reserve the right to update these terms at any time.',
  },
  {
    title: 'Account Registration',
    content:
      'You must create an account to use certain features. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. You must provide accurate and complete information.',
  },
  {
    title: 'Service Description',
    content:
      'Farmlyt AI provides AI-powered agricultural tools including disease detection, crop identification, food analysis, and data analytics. Services are provided "as is" and we continuously work to improve accuracy and reliability.',
  },
  {
    title: 'Acceptable Use',
    content:
      'You agree to use the platform only for lawful purposes. You may not misuse the services, attempt to access unauthorized areas, upload malicious content, or interfere with platform operations. Agricultural data you submit must be accurate and lawfully obtained.',
  },
  {
    title: 'Intellectual Property',
    content:
      'The platform, including its AI models, software, design, and content, is owned by Farmlyt AI and protected by intellectual property laws. You retain ownership of data you submit but grant us a license to use it for service improvement.',
  },
  {
    title: 'Limitation of Liability',
    content:
      'Farmlyt AI provides recommendations and analysis based on AI models. We are not liable for decisions made based on platform outputs. Our liability is limited to the amount paid for services in the preceding 12 months.',
  },
  {
    title: 'Termination',
    content:
      'We may suspend or terminate your account for violations of these terms. You may terminate your account at any time. Upon termination, your right to access the platform ceases immediately.',
  },
];

export default function TermsOfService() {
  return (
    <main>
      <PageHeader
        title="Terms of Service"
        description={`Rules and guidelines for using the ${APP_NAME} platform.`}
      />

      <section className="py-0 lg:py-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 p-5 hover:border-emerald-400 dark:hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{section.title}</h2>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}

        
        </div>
      </section>
    </main>
  );
}
