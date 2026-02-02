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
    <section className="py-20 px-6 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto">
        {data.headline && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{data.headline}</h2>
            {data.subheadline && (
              <p className="text-lg opacity-90 max-w-2xl mx-auto">{data.subheadline}</p>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {items.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                {item.prefix}{item.value}{item.suffix}
              </div>
              <p className="text-sm md:text-base opacity-80 uppercase tracking-wide font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
