/**
 * Quality Scoring Dashboard
 * 
 * Displays quality metrics, scores, and improvements made during website generation.
 * This provides transparency into the AI-powered quality engine.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  Layout, 
  Type, 
  Palette, 
  Zap,
  Target,
  Eye
} from "lucide-react";

interface QualityScore {
  overall: number;
  layout: number;
  typography: number;
  creativity: number;
  heroImpact: number;
  contentQuality: number;
  visualDepth: number;
}

interface QualityDashboardProps {
  scores?: QualityScore;
  verdict?: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  passesGate?: boolean;
  passCount?: number;
  sectionsImproved?: number;
  genericPatterns?: string[];
  isLoading?: boolean;
  skipped?: boolean;
  error?: string;
}

const SCORE_THRESHOLDS = {
  excellent: 90,
  good: 80,
  acceptable: 70,
};

function getScoreColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.excellent) return "text-green-600";
  if (score >= SCORE_THRESHOLDS.good) return "text-blue-600";
  if (score >= SCORE_THRESHOLDS.acceptable) return "text-yellow-600";
  return "text-red-600";
}

function getScoreBadgeVariant(score: number): "default" | "secondary" | "destructive" | "outline" {
  if (score >= SCORE_THRESHOLDS.excellent) return "default";
  if (score >= SCORE_THRESHOLDS.good) return "secondary";
  if (score >= SCORE_THRESHOLDS.acceptable) return "outline";
  return "destructive";
}

function getVerdictInfo(verdict: string): { label: string; color: string; icon: typeof CheckCircle2 } {
  switch (verdict) {
    case 'excellent':
      return { label: 'Excellent', color: 'text-green-600', icon: CheckCircle2 };
    case 'good':
      return { label: 'Good', color: 'text-blue-600', icon: CheckCircle2 };
    case 'needs_improvement':
      return { label: 'Needs Improvement', color: 'text-yellow-600', icon: AlertTriangle };
    case 'poor':
      return { label: 'Poor', color: 'text-red-600', icon: XCircle };
    default:
      return { label: 'Evaluating...', color: 'text-muted-foreground', icon: Eye };
  }
}

const SCORE_ICONS = {
  overall: Sparkles,
  layout: Layout,
  typography: Type,
  creativity: Palette,
  heroImpact: Target,
  contentQuality: Eye,
  visualDepth: Zap,
};

const SCORE_LABELS: Record<keyof QualityScore, string> = {
  overall: 'Overall Quality',
  layout: 'Layout & Composition',
  typography: 'Typography Hierarchy',
  creativity: 'Creativity & Originality',
  heroImpact: 'Hero Impact',
  contentQuality: 'Content Quality',
  visualDepth: 'Visual Depth',
};

function ScoreBar({ label, score, icon: Icon }: { label: string; score: number; icon: typeof Sparkles }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}</span>
      </div>
      <Progress value={score} className="h-2" />
    </div>
  );
}

export function QualityDashboard({
  scores,
  verdict,
  passesGate = true,
  passCount = 1,
  sectionsImproved = 0,
  genericPatterns = [],
  isLoading = false,
  skipped = false,
  error,
}: QualityDashboardProps) {
  // Use actual verdict if provided, or derive from scores, or default based on state
  const effectiveVerdict = verdict || (scores ? (scores.overall >= 90 ? 'excellent' : scores.overall >= 80 ? 'good' : scores.overall >= 70 ? 'needs_improvement' : 'poor') : undefined);
  const verdictInfo = effectiveVerdict ? getVerdictInfo(effectiveVerdict) : { label: 'Unknown', color: 'text-muted-foreground', icon: Eye };
  const VerdictIcon = verdictInfo.icon;
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 animate-pulse" />
            Quality Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
            <span>Evaluating website quality...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Handle skipped/error state
  if (skipped || error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Quality Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>Quality evaluation was skipped or encountered an issue.</p>
            {error && <p className="mt-1 text-xs text-destructive">Error: {error}</p>}
            <p className="mt-2">The website content is still valid and ready for use.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!scores) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Quality Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Quality scores will appear after website generation.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Quality Engine
          </CardTitle>
          <Badge variant={getScoreBadgeVariant(scores.overall)}>
            {scores.overall}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <VerdictIcon className={`h-5 w-5 ${verdictInfo.color}`} />
            <span className={`font-semibold ${verdictInfo.color}`}>
              {verdictInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {passesGate ? (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Passes Quality Gate
              </span>
            ) : (
              <span className="flex items-center gap-1 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                Below Threshold
              </span>
            )}
          </div>
        </div>
        
        <div className="grid gap-3">
          <ScoreBar 
            label={SCORE_LABELS.heroImpact}
            score={scores.heroImpact} 
            icon={SCORE_ICONS.heroImpact}
          />
          <ScoreBar 
            label={SCORE_LABELS.contentQuality}
            score={scores.contentQuality} 
            icon={SCORE_ICONS.contentQuality}
          />
          <ScoreBar 
            label={SCORE_LABELS.creativity}
            score={scores.creativity} 
            icon={SCORE_ICONS.creativity}
          />
          <ScoreBar 
            label={SCORE_LABELS.layout}
            score={scores.layout} 
            icon={SCORE_ICONS.layout}
          />
          <ScoreBar 
            label={SCORE_LABELS.typography}
            score={scores.typography} 
            icon={SCORE_ICONS.typography}
          />
          <ScoreBar 
            label={SCORE_LABELS.visualDepth}
            score={scores.visualDepth} 
            icon={SCORE_ICONS.visualDepth}
          />
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Refinement Passes</span>
            <span className="font-medium">{passCount}</span>
          </div>
          {sectionsImproved > 0 && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Sections Improved</span>
              <span className="font-medium text-green-600">{sectionsImproved}</span>
            </div>
          )}
        </div>
        
        {genericPatterns.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium text-yellow-600 mb-2 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Generic Patterns Detected
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {genericPatterns.slice(0, 3).map((pattern, i) => (
                <li key={i} className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-yellow-500" />
                  {pattern}
                </li>
              ))}
              {genericPatterns.length > 3 && (
                <li className="text-muted-foreground">
                  +{genericPatterns.length - 3} more
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function QualityBadge({ score }: { score: number }) {
  return (
    <Badge variant={getScoreBadgeVariant(score)} className="gap-1">
      <Sparkles className="h-3 w-3" />
      {score}
    </Badge>
  );
}
