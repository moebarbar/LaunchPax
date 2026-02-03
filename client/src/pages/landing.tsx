import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Rocket, 
  Palette, 
  Globe, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Building2
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">LaunchPax</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm" data-testid="link-features">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm" data-testid="link-how-it-works">How it Works</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm" data-testid="link-pricing">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <a href="/api/login">
                <Button data-testid="button-login">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Business Launch</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight">
                Launch Your Business
                <span className="text-primary"> in Hours,</span>
                <br />Not Months
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                One intelligent dashboard that orchestrates naming, domains, branding, website, and marketing assets. From idea to launch-ready in a single workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/api/login">
                  <Button size="lg" className="w-full sm:w-auto" data-testid="button-hero-cta">
                    Start Building Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-demo">
                  Watch Demo
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Works without API keys</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl p-8 ring-1 ring-black/5 dark:ring-white/10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                    <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Generate Business Names</p>
                      <p className="text-xs text-muted-foreground">50+ AI-powered suggestions</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                    <div className="w-10 h-10 rounded-md bg-purple-500/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Check Domain Availability</p>
                      <p className="text-xs text-muted-foreground">Instant .com & .ai lookup</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                    <div className="w-10 h-10 rounded-md bg-pink-500/10 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Build Brand Identity</p>
                      <p className="text-xs text-muted-foreground">Colors, fonts, messaging</p>
                    </div>
                    <div className="ml-auto w-5 h-5 rounded-full border-2 border-muted" />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border opacity-60">
                    <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Launch Website</p>
                      <p className="text-xs text-muted-foreground">Ready-to-deploy pages</p>
                    </div>
                    <div className="ml-auto w-5 h-5 rounded-full border-2 border-muted" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Everything You Need to Launch
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete orchestration platform that connects to the best APIs and services, automating every step of your business launch.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">AI Name Generation</h3>
                <p className="text-muted-foreground text-sm">
                  Generate 50-150 creative business names tailored to your industry, audience, and brand tone.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Domain Availability</h3>
                <p className="text-muted-foreground text-sm">
                  Instantly check .com and .ai domains with real pricing. Find the perfect domain for your brand.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-pink-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Brand Kit Builder</h3>
                <p className="text-muted-foreground text-sm">
                  Generate complete brand identity: voice, taglines, color palette, typography, and messaging pillars.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Website Scaffold</h3>
                <p className="text-muted-foreground text-sm">
                  Generate complete website structure with copy-ready pages: Home, About, Services, Contact.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Marketing Graphics</h3>
                <p className="text-muted-foreground text-sm">
                  Ready-to-post social media templates: Instagram posts, Stories, Facebook ads with your branding.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-cyan-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Connector System</h3>
                <p className="text-muted-foreground text-sm">
                  Extensible API connector framework. Add new services and integrations as your needs grow.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              From Idea to Launch in 4 Steps
            </h2>
            <p className="text-lg text-muted-foreground">
              Our AI-powered workflow handles everything automatically.
            </p>
          </div>
          <div className="space-y-8">
            {[
              { step: 1, title: "Describe Your Business", desc: "Enter your business idea, target audience, and preferred tone. Our AI understands your vision." },
              { step: 2, title: "Generate & Select Names", desc: "Get 50+ name suggestions with instant domain availability checks. Pick your perfect match." },
              { step: 3, title: "Build Your Brand", desc: "AI generates your complete brand kit: colors, fonts, voice, taglines, and messaging pillars." },
              { step: 4, title: "Launch Ready Assets", desc: "Get website copy, page structures, and social media graphics ready to publish." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
            Ready to Launch Your Business?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of entrepreneurs who've launched faster with LaunchPad AI.
          </p>
          <a href="/api/login">
            <Button size="lg" variant="secondary" data-testid="button-footer-cta">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>

      <footer className="py-8 px-4 border-t">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Rocket className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">LaunchPad AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 LaunchPad AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
