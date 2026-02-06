import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface ChecklistItem {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  status?: "complete" | "active" | "pending";
}

interface ChecklistPanelProps {
  items: ChecklistItem[];
  className?: string;
}

export function ChecklistPanel({ items, className = "" }: ChecklistPanelProps) {
  return (
    <motion.div
      className={`rounded-2xl overflow-hidden shadow-2xl border ${className}`}
      style={{
        backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
        borderColor: "var(--brand-border, hsl(var(--border)))",
      }}
      initial={{ opacity: 0, x: 40, rotateY: -5 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="p-2 space-y-1.5">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl transition-colors"
            style={{
              backgroundColor: item.status === "active"
                ? "hsl(var(--brand-primary-hsl, var(--primary)) / 0.06)"
                : "transparent",
            }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + index * 0.12, duration: 0.5 }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: item.status === "active"
                  ? "var(--brand-primary, hsl(var(--primary)))"
                  : "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)",
              }}
            >
              {item.icon || (
                <div
                  className="w-5 h-5 rounded"
                  style={{
                    background: item.status === "active"
                      ? "rgba(255,255,255,0.3)"
                      : "var(--brand-primary, hsl(var(--primary)))",
                    opacity: item.status === "active" ? 1 : 0.4,
                  }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}
              >
                {item.title}
              </p>
              {item.subtitle && (
                <p
                  className="text-xs truncate"
                  style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}
                >
                  {item.subtitle}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              {item.status === "complete" ? (
                <motion.div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#22c55e" }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.12, type: "spring", stiffness: 300 }}
                >
                  <Check className="w-3.5 h-3.5 text-white" />
                </motion.div>
              ) : item.status === "active" ? (
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }} />
              ) : (
                <div
                  className="w-6 h-6 rounded-full border-2"
                  style={{ borderColor: "var(--brand-border, hsl(var(--border)))" }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

interface StepIndicatorProps {
  steps: string[];
  currentStep?: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep = 0, className = "" }: StepIndicatorProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-1">
          <motion.div
            className="flex items-center justify-center rounded-full text-xs font-bold"
            style={{
              width: 28,
              height: 28,
              backgroundColor: index <= currentStep
                ? "var(--brand-primary, hsl(var(--primary)))"
                : "var(--brand-muted, hsl(var(--muted)))",
              color: index <= currentStep
                ? "white"
                : "var(--brand-muted-text, hsl(var(--muted-foreground)))",
            }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, type: "spring" }}
          >
            {index < currentStep ? <Check className="w-3.5 h-3.5" /> : index + 1}
          </motion.div>
          {index < steps.length - 1 && (
            <div className="w-8 h-0.5" style={{
              backgroundColor: index < currentStep
                ? "var(--brand-primary, hsl(var(--primary)))"
                : "var(--brand-muted, hsl(var(--muted)))",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}
