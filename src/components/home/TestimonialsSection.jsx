import testimonialsData from '../../data/testimonials';
import TestimonialCard from '../ui/TestimonialCard';
import SectionTitle from '../common/SectionTitle';

export default function TestimonialsSection() {
  return (
    <section className="relative py-12 lg:py-16 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Testimonials"
          title="What Our Users Say"
          description="Join thousands of farmers and agricultural professionals who trust Farmlyt AI for their farming needs."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
