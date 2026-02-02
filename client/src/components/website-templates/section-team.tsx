import type { SectionContent } from "@shared/schema";

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  image?: string;
}

interface TeamData {
  headline?: string;
  subheadline?: string;
  members?: TeamMember[];
}

export default function SectionTeam({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as TeamData;
  const members = data.members || [];
  
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {data.headline && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{data.headline}</h2>
            {data.subheadline && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{data.subheadline}</p>
            )}
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-3xl font-bold text-primary border-4 border-card group-hover:scale-105 transition-transform">
                {member.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"}
              </div>
              <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
              <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
              {member.bio && (
                <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
