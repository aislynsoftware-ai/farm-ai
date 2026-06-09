import statsData from '../../data/stats';
import StatCard from '../ui/StatCard';

export default function StatsSection() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
