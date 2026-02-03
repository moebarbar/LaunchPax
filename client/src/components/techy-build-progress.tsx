import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Code2, 
  Sparkles, 
  Cpu, 
  Layers, 
  Palette,
  Globe,
  Zap,
  CheckCircle2,
  Circle,
  Loader2,
  Braces,
  Database,
  Image,
  Type
} from "lucide-react";

interface TechyBuildProgressProps {
  workflowType: "naming" | "brand" | "website" | "graphics";
  progress: number;
  isRunning: boolean;
}

interface BuildStep {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  codeSnippet: string;
}

const workflowSteps: Record<string, BuildStep[]> = {
  naming: [
    { id: "analyze", label: "Analyzing Business", sublabel: "Understanding your vision", icon: Cpu, codeSnippet: "const insights = await analyzeBusinessIdea(input);" },
    { id: "generate", label: "Generating Names", sublabel: "Creating unique identities", icon: Sparkles, codeSnippet: "const names = await generateBrandNames(insights);" },
    { id: "domain", label: "Checking Domains", sublabel: "Finding available domains", icon: Globe, codeSnippet: "const domains = await checkDomainAvailability(names);" },
    { id: "score", label: "Scoring Results", sublabel: "Ranking best options", icon: Layers, codeSnippet: "return rankByMemorability(names, domains);" },
  ],
  brand: [
    { id: "research", label: "Brand Research", sublabel: "Analyzing market position", icon: Database, codeSnippet: "const market = await analyzeMarketPosition(business);" },
    { id: "colors", label: "Color Palette", sublabel: "Designing color system", icon: Palette, codeSnippet: "const palette = await generateColorPalette(brand);" },
    { id: "typography", label: "Typography", sublabel: "Selecting font pairings", icon: Type, codeSnippet: "const fonts = await selectFontPairings(personality);" },
    { id: "voice", label: "Brand Voice", sublabel: "Crafting messaging", icon: Sparkles, codeSnippet: "return createBrandVoice(values, audience);" },
  ],
  website: [
    { id: "structure", label: "Planning Structure", sublabel: "Designing site architecture", icon: Layers, codeSnippet: "const structure = await planSiteArchitecture(business);" },
    { id: "content", label: "Generating Content", sublabel: "Writing compelling copy", icon: Code2, codeSnippet: "const copy = await generateWebsiteCopy(structure);" },
    { id: "sections", label: "Building Sections", sublabel: "Creating page components", icon: Braces, codeSnippet: "const sections = await buildSections(copy, design);" },
    { id: "images", label: "Sourcing Images", sublabel: "Finding perfect visuals", icon: Image, codeSnippet: "const images = await fetchStockPhotos(keywords);" },
    { id: "optimize", label: "Optimizing", sublabel: "Final polish & SEO", icon: Zap, codeSnippet: "return optimizeForConversion(website);" },
  ],
  graphics: [
    { id: "analyze", label: "Analyzing Brand", sublabel: "Understanding visual identity", icon: Palette, codeSnippet: "const identity = await analyzeBrandIdentity(brand);" },
    { id: "generate", label: "Generating Assets", sublabel: "Creating visual elements", icon: Image, codeSnippet: "const assets = await generateGraphicAssets(identity);" },
    { id: "refine", label: "Refining Quality", sublabel: "Enhancing details", icon: Sparkles, codeSnippet: "return enhanceAssetQuality(assets);" },
  ],
};

const terminalMessages: Record<string, string[]> = {
  naming: [
    "Initializing neural naming engine...",
    "Loading linguistic patterns...",
    "Analyzing semantic associations...",
    "Cross-referencing trademark databases...",
    "Evaluating phonetic appeal...",
    "Computing memorability scores...",
    "Checking domain availability...",
    "Ranking candidates by market fit...",
    "Finalizing recommendations..."
  ],
  brand: [
    "Launching brand intelligence module...",
    "Analyzing color psychology...",
    "Mapping competitive landscape...",
    "Generating palette variations...",
    "Testing contrast ratios...",
    "Evaluating font readability...",
    "Crafting brand personality...",
    "Building messaging framework...",
    "Compiling brand guidelines..."
  ],
  website: [
    "Initializing website builder...",
    "Analyzing business requirements...",
    "Mapping user journey flows...",
    "Generating page structures...",
    "Writing conversion-focused copy...",
    "Selecting section layouts...",
    "Integrating visual elements...",
    "Optimizing for performance...",
    "Applying SEO best practices...",
    "Finalizing responsive design..."
  ],
  graphics: [
    "Starting visual asset generator...",
    "Loading brand parameters...",
    "Generating hero imagery...",
    "Creating supporting graphics...",
    "Optimizing for web delivery...",
    "Finalizing asset library..."
  ],
};

const workflowTitles: Record<string, string> = {
  naming: "Generating Business Names",
  brand: "Creating Brand Identity",
  website: "Building Your Website",
  graphics: "Designing Graphics",
};

export default function TechyBuildProgress({ workflowType, progress, isRunning }: TechyBuildProgressProps) {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [codeVisible, setCodeVisible] = useState(false);
  
  const steps = workflowSteps[workflowType] || workflowSteps.website;
  const messages = terminalMessages[workflowType] || terminalMessages.website;
  const title = workflowTitles[workflowType] || "Building...";
  
  const activeStep = useMemo(() => {
    const stepProgress = 100 / steps.length;
    return Math.min(Math.floor(progress / stepProgress), steps.length - 1);
  }, [progress, steps.length]);
  
  useEffect(() => {
    if (activeStep !== currentStep) {
      setCurrentStep(activeStep);
      setCodeVisible(true);
      setTimeout(() => setCodeVisible(false), 2000);
    }
  }, [activeStep, currentStep]);
  
  useEffect(() => {
    if (!isRunning) return;
    
    const messageIndex = Math.floor((progress / 100) * messages.length);
    const newLines = messages.slice(0, Math.min(messageIndex + 1, messages.length));
    
    if (newLines.length > terminalLines.length) {
      setTerminalLines(newLines);
    }
  }, [progress, isRunning, messages, terminalLines.length]);
  
  useEffect(() => {
    if (!isRunning) {
      setTerminalLines([]);
      setCurrentStep(0);
    }
  }, [isRunning]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <Cpu className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium">AI Engine Active</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">Watch the magic happen in real-time</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Build Steps
            </h3>
            <span className="text-sm font-mono text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="space-y-3">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isComplete = index < activeStep;
              const StepIcon = step.icon;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isActive 
                      ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/10" 
                      : isComplete 
                        ? "bg-muted/50 border-muted" 
                        : "bg-card border-border opacity-50"
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : isComplete 
                        ? "bg-green-500/20 text-green-500" 
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <StepIcon className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {step.sublabel}
                    </p>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      className="absolute right-4"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="rounded-xl overflow-hidden border bg-zinc-950 text-zinc-100">
            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-zinc-400 font-mono ml-2">
                launchpax-engine
              </span>
              <Terminal className="w-4 h-4 text-zinc-400 ml-auto" />
            </div>
            
            <div className="p-4 h-[280px] overflow-y-auto font-mono text-sm">
              <AnimatePresence mode="popLayout">
                {terminalLines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-2 mb-2"
                  >
                    <span className="text-green-400">→</span>
                    <span className="text-zinc-300">{line}</span>
                    {index === terminalLines.length - 1 && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="text-green-400"
                      >
                        ▊
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {terminalLines.length === 0 && (
                <div className="flex items-center gap-2 text-zinc-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Initializing...</span>
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {codeVisible && steps[activeStep] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl overflow-hidden border bg-zinc-950"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-zinc-400 font-mono">
                    engine.ts
                  </span>
                </div>
                <div className="p-4">
                  <code className="text-sm font-mono">
                    <span className="text-purple-400">await</span>{" "}
                    <span className="text-blue-300">{steps[activeStep].codeSnippet.split("(")[0]}</span>
                    <span className="text-zinc-400">(</span>
                    <span className="text-amber-300">...</span>
                    <span className="text-zinc-400">)</span>
                    <span className="text-zinc-400">;</span>
                  </code>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="font-mono font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 50%, hsl(var(--primary)) 100%)",
              backgroundSize: "200% 100%",
            }}
            initial={{ width: 0 }}
            animate={{ 
              width: `${progress}%`,
              backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
            }}
            transition={{
              width: { duration: 0.5 },
              backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
            }}
          />
        </div>
        <div className="flex justify-center gap-8 pt-2">
          {steps.map((step, index) => {
            const isComplete = index <= activeStep;
            return (
              <div 
                key={step.id}
                className={`flex items-center gap-1 text-xs ${
                  isComplete ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
