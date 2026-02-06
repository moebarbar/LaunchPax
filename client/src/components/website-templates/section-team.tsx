import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Linkedin, Twitter } from "lucide-react";
import { useThemeMotion } from "./motion-wrapper";
import { FloatingOrb } from "./visuals/floating-elements";

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
  const themeMotion = useThemeMotion();
  
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/30" />
      <FloatingOrb color="var(--brand-primary, hsl(var(--primary)))" size={400} x="10%" y="30%" opacity={0.05} blur={100} />
      <FloatingOrb color="var(--brand-accent, hsl(var(--primary)))" size={300} x="90%" y="70%" delay={4} opacity={0.04} blur={80} />

      <div className="max-w-7xl mx-auto relative z-10">
        {data.headline && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.duration }}
            className="text-center mb-16 sm:mb-20"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ 
                backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)",
                color: "var(--brand-primary, hsl(var(--primary)))"
              }}
            >
              Our Team
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight" data-testid="text-team-headline"
              style={{ color: "var(--brand-heading, var(--brand-text, hsl(var(--foreground))))" }}>
              {data.headline}
            </h2>
            {data.subheadline && (
              <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed" data-testid="text-team-subheadline"
                style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                {data.subheadline}
              </p>
            )}
          </motion.div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {members.map((member, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: themeMotion.duration, delay: index * 0.08 }}
              className="group relative"
              data-testid={`card-team-member-${index}`}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
            >
              <div 
                className="relative p-6 sm:p-8 rounded-3xl border backdrop-blur-sm text-center transition-all duration-500"
                style={{
                  background: `linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--muted) / 0.3) 100%)`,
                  borderColor: "hsl(var(--border) / 0.5)"
                }}
              >
                <div className="relative mx-auto mb-6">
                  <motion.div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-lg"
                    style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                  />
                  <div 
                    className="relative w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-secondary, hsl(var(--primary))) 100%)`
                    }}
                  >
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"
                    )}
                  </div>
                  <motion.div
                    className="absolute -inset-1 rounded-[1.25rem] border-2"
                    style={{ borderColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.2)" }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                <h3 className="text-xl font-semibold mb-1 tracking-tight" style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>{member.name}</h3>
                <p className="font-medium text-sm mb-4" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}>
                  {member.role}
                </p>
                {member.bio && (
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>{member.bio}</p>
                )}

                <div className="flex justify-center gap-2">
                  <a href="#" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.08)", color: "var(--brand-primary, hsl(var(--primary)))" }}>
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.08)", color: "var(--brand-primary, hsl(var(--primary)))" }}>
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
