import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, Users, DollarSign, BarChart3, Clock, Zap } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  icon?: React.ReactNode;
  delay?: number;
  color?: string;
}

export function MetricCard({ label, value, change, icon, delay = 0, color }: MetricCardProps) {
  const primaryColor = color || "var(--brand-primary, hsl(var(--primary)))";

  return (
    <motion.div
      className="p-4 rounded-xl border backdrop-blur-sm"
      style={{
        backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
        borderColor: "var(--brand-border, hsl(var(--border)))",
      }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
            <div style={{ color: primaryColor }}>{icon}</div>
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <AnimatedValue value={value} delay={delay} />
        {change && (
          <motion.span
            className="text-xs font-medium px-1.5 py-0.5 rounded-md mb-0.5"
            style={{
              backgroundColor: change.startsWith("+")
                ? "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)"
                : "var(--brand-muted, hsl(var(--muted)))",
              color: change.startsWith("+")
                ? "var(--brand-primary, hsl(var(--primary)))"
                : "var(--brand-muted-text, hsl(var(--muted-foreground)))",
            }}
            initial={{ opacity: 0, x: -5 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.3 }}
          >
            {change}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

function AnimatedValue({ value, delay = 0 }: { value: string; delay?: number }) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(numericValue) || hasAnimated) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        const prefix = value.match(/^[^0-9]*/)?.[0] || "";
        const suffix = value.match(/[^0-9.]*$/)?.[0] || "";
        const duration = 1500;
        const startTime = performance.now();

        const update = (time: number) => {
          const progress = Math.min((time - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          const current = Math.floor(eased * numericValue);
          const formatted = numericValue >= 1000 ? current.toLocaleString() : current.toString();
          setDisplayValue(prefix + formatted + suffix);
          if (progress < 1) requestAnimationFrame(update);
          else setDisplayValue(value);
        };

        setTimeout(() => requestAnimationFrame(update), delay * 1000);
      }
    }, { threshold: 0.3 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, delay, hasAnimated]);

  return (
    <div ref={ref} className="text-2xl font-bold" style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
      {displayValue}
    </div>
  );
}

interface MetricsGridProps {
  metrics?: { label: string; value: string; change?: string; icon?: string }[];
  className?: string;
}

export function MetricsGrid({ metrics, className = "" }: MetricsGridProps) {
  const defaultMetrics = [
    { label: "Active Users", value: "12,847", change: "+24%", icon: "users" },
    { label: "Revenue", value: "$48.2k", change: "+18%", icon: "dollar" },
    { label: "Response Time", value: "45ms", change: "-12%", icon: "clock" },
    { label: "Conversion", value: "3.8%", change: "+0.5%", icon: "chart" },
  ];

  const items = metrics || defaultMetrics;

  const iconMap: Record<string, React.ReactNode> = {
    users: <Users className="w-4 h-4" />,
    dollar: <DollarSign className="w-4 h-4" />,
    clock: <Clock className="w-4 h-4" />,
    chart: <BarChart3 className="w-4 h-4" />,
    trending: <TrendingUp className="w-4 h-4" />,
    zap: <Zap className="w-4 h-4" />,
  };

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {items.map((metric, i) => (
        <MetricCard
          key={i}
          label={metric.label}
          value={metric.value}
          change={metric.change}
          icon={metric.icon ? iconMap[metric.icon] : undefined}
          delay={0.1 + i * 0.1}
        />
      ))}
    </div>
  );
}

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  className?: string;
}

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 6,
  color = "var(--brand-primary, hsl(var(--primary)))",
  label,
  className = "",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--brand-muted, hsl(var(--muted)))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference - (value / 100) * circumference }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-sm font-bold" style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
          {value}%
        </span>
        {label && (
          <span className="block text-[9px]" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
