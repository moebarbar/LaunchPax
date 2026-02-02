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
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {data.headline && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-team-headline">{data.headline}</h2>
            {data.subheadline && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-team-subheadline">{data.subheadline}</p>
            )}
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <div key={index} className="text-center group" data-testid={`card-team-member-${index}`}>
              <div 
                className="w-36 h-36 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300"
                style={{ 
                  background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-secondary, hsl(var(--primary))) 100%)`
                }}
              >
                {member.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"}
              </div>
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p 
                className="font-medium text-sm mb-3"
                style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
              >
                {member.role}
              </p>
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
