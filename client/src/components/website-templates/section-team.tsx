import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Linkedin, Twitter } from "lucide-react";

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

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export default function SectionTeam({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as TeamData;
  const members = data.members || [];
  
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/30" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-0 w-96 h-96 rounded-full blur-[150px] opacity-10" 
          style={{ background: "var(--brand-primary, hsl(var(--primary)))" }} 
        />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 rounded-full blur-[120px] opacity-10" 
          style={{ background: "var(--brand-accent, hsl(var(--primary)))" }} 
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {data.headline && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight" data-testid="text-team-headline">
              {data.headline}
            </h2>
            {data.subheadline && (
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-team-subheadline">
                {data.subheadline}
              </p>
            )}
          </motion.div>
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {members.map((member, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="group relative"
              data-testid={`card-team-member-${index}`}
            >
              <div 
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                style={{ 
                  background: `linear-gradient(135deg, 
                    hsl(var(--brand-primary-hsl, var(--primary)) / 0.2) 0%, 
                    transparent 70%)`
                }}
              />
              
              <div 
                className="relative p-6 sm:p-8 rounded-3xl border backdrop-blur-sm text-center transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1"
                style={{
                  background: `linear-gradient(180deg, 
                    hsl(var(--card)) 0%, 
                    hsl(var(--muted) / 0.3) 100%)`,
                  borderColor: "hsl(var(--border) / 0.5)"
                }}
              >
                <div className="relative mx-auto mb-6">
                  <div 
                    className="absolute inset-0 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"
                    style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                  />
                  <div 
                    className="relative w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, 
                        var(--brand-primary, hsl(var(--primary))) 0%, 
                        var(--brand-secondary, hsl(var(--primary))) 100%)`
                    }}
                  >
                    {member.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"}
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-1 tracking-tight">{member.name}</h3>
                <p 
                  className="font-medium text-sm mb-4"
                  style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                >
                  {member.role}
                </p>
                {member.bio && (
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{member.bio}</p>
                )}

                <div className="flex justify-center gap-2">
                  <a 
                    href="#" 
                    className="w-8 h-8 rounded-full bg-muted/50 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a 
                    href="#" 
                    className="w-8 h-8 rounded-full bg-muted/50 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
