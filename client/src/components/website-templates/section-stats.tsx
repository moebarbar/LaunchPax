import type { SectionContent } from "@shared/schema";

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
}

interface StatsData {
  headline?: string;
  subheadline?: string;
  items?: StatItem[];
}

export default function SectionStats({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as StatsData;
  const items = data.items || [];
  
  return (
    <section 
      className="py-20 px-6 text-white relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, 
          var(--brand-primary, hsl(var(--primary))) 0%, 
          var(--brand-secondary, hsl(var(--primary))) 100%)`
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {data.headline && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-stats-headline">{data.headline}</h2>
            {data.subheadline && (
              <p className="text-lg opacity-90 max-w-2xl mx-auto" data-testid="text-stats-subheadline">{data.subheadline}</p>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {items.map((item, index) => (
            <div key={index} className="text-center" data-testid={`stat-item-${index}`}>
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3" data-testid={`text-stat-value-${index}`}>
                {item.prefix}{item.value}{item.suffix}
              </div>
              <p className="text-sm md:text-base opacity-80 uppercase tracking-wide font-medium" data-testid={`text-stat-label-${index}`}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
