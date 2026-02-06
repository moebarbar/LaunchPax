import { motion } from "framer-motion";

interface BrowserMockupProps {
  url?: string;
  children?: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function BrowserMockup({ url = "yoursite.com", children, className = "", animate = true }: BrowserMockupProps) {
  const Wrapper = animate ? motion.div : "div" as any;
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, y: 30, rotateX: 5 },
        whileInView: { opacity: 1, y: 0, rotateX: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
      }
    : {};

  return (
    <Wrapper
      className={`relative rounded-xl overflow-hidden shadow-2xl ${className}`}
      style={{
        background: "var(--brand-card-bg, hsl(var(--card)))",
        border: "1px solid var(--brand-border, hsl(var(--border)))",
      }}
      {...wrapperProps}
    >
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: "var(--brand-border, hsl(var(--border)))" }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        <div
          className="flex-1 mx-4 px-3 py-1 rounded-md text-xs truncate"
          style={{
            backgroundColor: "var(--brand-muted, hsl(var(--muted)))",
            color: "var(--brand-muted-text, hsl(var(--muted-foreground)))",
          }}
        >
          {url}
        </div>
      </div>
      <div className="relative overflow-hidden" style={{ minHeight: 200 }}>
        {children || <DashboardPreview />}
      </div>
    </Wrapper>
  );
}

function DashboardPreview() {
  return (
    <div className="p-4 space-y-3" style={{ backgroundColor: "var(--brand-background, hsl(var(--background)))" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg" style={{ background: "var(--brand-primary, hsl(var(--primary)))" }} />
        <div className="flex-1">
          <div className="h-3 rounded-full w-24" style={{ backgroundColor: "var(--brand-muted, hsl(var(--muted)))" }} />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-6 h-6 rounded" style={{ backgroundColor: "var(--brand-muted, hsl(var(--muted)))" }} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Revenue", value: "$24.5k", color: "var(--brand-primary, hsl(var(--primary)))" },
          { label: "Users", value: "1,234", color: "var(--brand-accent, hsl(var(--primary)))" },
          { label: "Growth", value: "+18%", color: "var(--brand-secondary, hsl(var(--primary)))" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="p-3 rounded-lg border"
            style={{
              borderColor: "var(--brand-border, hsl(var(--border)))",
              backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
          >
            <p className="text-[10px] mb-1" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
              {stat.label}
            </p>
            <p className="text-sm font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>
      <div
        className="h-20 rounded-lg border overflow-hidden relative"
        style={{ borderColor: "var(--brand-border, hsl(var(--border)))" }}
      >
        <svg viewBox="0 0 300 80" className="w-full h-full">
          <defs>
            <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "var(--brand-primary, hsl(var(--primary)))", stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: "var(--brand-primary, hsl(var(--primary)))", stopOpacity: 0.02 }} />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,60 Q30,50 60,45 T120,35 T180,25 T240,30 T300,15"
            fill="none"
            stroke="var(--brand-primary, hsl(var(--primary)))"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          <path
            d="M0,60 Q30,50 60,45 T120,35 T180,25 T240,30 T300,15 L300,80 L0,80 Z"
            fill="url(#chartGrad)"
            opacity={0.5}
          />
        </svg>
      </div>
    </div>
  );
}

interface PhoneMockupProps {
  children?: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function PhoneMockup({ children, className = "", animate = true }: PhoneMockupProps) {
  const Wrapper = animate ? motion.div : "div" as any;
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, y: 40, scale: 0.95 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
      }
    : {};

  return (
    <Wrapper className={`relative mx-auto ${className}`} style={{ width: 220 }} {...wrapperProps}>
      <div
        className="rounded-[2rem] overflow-hidden border-4 shadow-2xl"
        style={{
          borderColor: "var(--brand-text, hsl(var(--foreground)))",
          backgroundColor: "var(--brand-background, hsl(var(--background)))",
        }}
      >
        <div className="flex justify-center pt-2 pb-1">
          <div
            className="w-16 h-1 rounded-full"
            style={{ backgroundColor: "var(--brand-muted, hsl(var(--muted)))" }}
          />
        </div>
        <div className="relative overflow-hidden" style={{ minHeight: 380 }}>
          {children || <MobileAppPreview />}
        </div>
      </div>
    </Wrapper>
  );
}

function MobileAppPreview() {
  return (
    <div className="p-3 space-y-3" style={{ backgroundColor: "var(--brand-background, hsl(var(--background)))" }}>
      <div className="text-center py-4">
        <div className="w-10 h-10 rounded-xl mx-auto mb-2" style={{ background: "var(--brand-primary, hsl(var(--primary)))" }} />
        <div className="h-2 rounded w-16 mx-auto" style={{ backgroundColor: "var(--brand-muted, hsl(var(--muted)))" }} />
      </div>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="flex items-center gap-2 p-2.5 rounded-xl border"
          style={{
            borderColor: "var(--brand-border, hsl(var(--border)))",
            backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
          }}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
        >
          <div className="w-8 h-8 rounded-lg" style={{ background: `var(--brand-${i === 1 ? 'primary' : i === 2 ? 'accent' : 'secondary'}, hsl(var(--primary)))`, opacity: 0.2 }} />
          <div className="flex-1 space-y-1">
            <div className="h-2 rounded w-20" style={{ backgroundColor: "var(--brand-muted, hsl(var(--muted)))" }} />
            <div className="h-1.5 rounded w-14" style={{ backgroundColor: "var(--brand-muted, hsl(var(--muted)))", opacity: 0.5 }} />
          </div>
        </motion.div>
      ))}
      <div
        className="py-2.5 rounded-xl text-center text-xs font-semibold text-white"
        style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
      >
        Get Started
      </div>
    </div>
  );
}
