import PageHeader from '../components/layout/PageHeader';
import { APP_NAME } from '../constants';

const sections = [
  {
    title: 'Information We Collect',
    content:
      'We collect information you provide directly, such as your name, email address, phone number, and agricultural data including crop images and farm details. We also automatically collect certain technical information when you use our platform, including IP address, browser type, device information, and usage patterns.',
  },
  {
    title: 'How We Use Your Information',
    content:
      'Your information is used to provide and improve our AI-powered agricultural services, process your requests, send relevant notifications, analyze platform usage, and comply with legal obligations. We use agricultural data solely to train and improve our AI models for disease detection, crop identification, and analytics.',
  },
  {
    title: 'Data Sharing & Disclosure',
    content:
      'We do not sell your personal information. We may share data with trusted service providers who assist in platform operations, when required by law, or with your explicit consent. All third-party partners are contractually bound to protect your data.',
  },
  {
    title: 'Data Security',
    content:
      'We implement industry-standard security measures including encryption at rest and in transit, regular security audits, access controls, and secure data centers. However, no method of transmission over the Internet is 100% secure.',
  },
  {
    title: 'Your Rights',
    content:
      'You have the right to access, correct, or delete your personal data. You may opt out of marketing communications at any time. To exercise these rights, contact us at hello@farmai.agriculture.',
  },
  {
    title: 'Cookies',
    content:
      'We use cookies and similar tracking technologies to enhance platform functionality, analyze usage, and improve user experience. You can control cookie preferences through your browser settings.',
  },
  {
    title: 'Changes to This Policy',
    content:
      'We may update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date. Continued use of the platform constitutes acceptance of the revised policy.',
  },
];

export default function PrivacyPolicy() {
  return (
    <main>
      <PageHeader
        title="Privacy Policy"
        description={`How ${APP_NAME} collects, uses, and protects your personal information.`}
      />

      <section className="py-10 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{section.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last updated: June 2026. If you have questions, contact us at hello@farmai.agriculture.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
