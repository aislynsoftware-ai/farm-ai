import PageHeader from '../components/layout/PageHeader';
import { APP_NAME } from '../constants';

const sections = [
  {
    title: 'What Are Cookies',
    content:
      'Cookies are small text files stored on your device when you visit a website. They help us remember your preferences, understand how you use our platform, and improve your experience.',
  },
  {
    title: 'How We Use Cookies',
    content:
      'We use essential cookies for platform functionality (authentication, security, session management). Analytical cookies help us understand usage patterns. Preference cookies remember your settings like theme and language.',
  },
  {
    title: 'Third-Party Cookies',
    content:
      'We may use third-party services (such as analytics providers) that set their own cookies. These services help us analyze platform usage and improve our offerings. We do not control these third-party cookies.',
  },
  {
    title: 'Managing Cookies',
    content:
      'You can control and manage cookies through your browser settings. You may block or delete cookies, but this may affect platform functionality. Most browsers provide options to clear cookies or alert you when cookies are set.',
  },
  {
    title: 'Do Not Track',
    content:
      'Our platform does not currently respond to "Do Not Track" signals. We continue to monitor industry developments regarding tracking technologies.',
  },
  {
    title: 'Updates to This Policy',
    content:
      'We may update this Cookie Policy to reflect changes in technology, regulation, or our practices. Changes will be posted here with an updated effective date.',
  },
];

export default function CookiePolicy() {
  return (
    <main>
      <PageHeader
        title="Cookie Policy"
        description={`How ${APP_NAME} uses cookies and similar tracking technologies.`}
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
              Last updated: June 2026. Questions? Contact hello@farmai.agriculture.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
