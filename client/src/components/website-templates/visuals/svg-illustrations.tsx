import { motion } from "framer-motion";
import { useMemo, useId } from "react";

interface AbstractBlobProps {
  variant?: 1 | 2 | 3 | 4 | 5;
  size?: number;
  color?: string;
  opacity?: number;
  animate?: boolean;
  className?: string;
}

const blobPaths: Record<number, [string, string]> = {
  1: [
    "M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.5,81.4,29,72.4,40.8C63.4,52.6,51,61.7,37.5,69.3C24,76.9,9.3,83,-4.4,82.7C-18.1,82.3,-30.8,75.5,-43.4,67.2C-56,58.9,-68.5,49.2,-75.5,36.1C-82.5,23,-84,6.5,-81.4,-8.8C-78.8,-24.1,-72.1,-38.2,-62,-49.4C-51.9,-60.6,-38.4,-68.9,-24.5,-76.2C-10.6,-83.5,3.7,-89.8,18.2,-88.3C32.7,-86.8,47.4,-77.5,44.7,-76.4Z",
    "M42.1,-72.8C55.3,-65.5,67.1,-55.2,74.8,-42.3C82.5,-29.4,86.1,-14.7,85.2,-0.5C84.3,13.7,78.9,27.3,71,39.4C63.1,51.5,52.7,62,40.2,68.6C27.7,75.2,13.8,77.9,-0.7,79.1C-15.2,80.3,-30.4,80,-43.1,73.8C-55.8,67.6,-66,55.5,-72.8,41.8C-79.6,28.1,-83,14,-82.3,0.4C-81.6,-13.2,-76.8,-26.4,-69,-37.5C-61.2,-48.6,-50.4,-57.6,-38.2,-65.4C-26,-73.2,-13,-79.8,0.8,-81.2C14.6,-82.6,29.2,-78.8,42.1,-72.8Z",
  ],
  2: [
    "M39.5,-67.3C52.9,-61.8,66.8,-54.5,74.4,-43.1C82,-31.7,83.3,-15.8,80.9,-1.4C78.5,13.1,72.4,26.2,64.4,37.6C56.4,49,46.5,58.7,34.6,65.4C22.7,72.1,8.8,75.8,-4.7,76C-18.2,76.2,-31.2,72.9,-42.8,66C-54.4,59.1,-64.6,48.6,-71.2,36C-77.8,23.4,-80.8,8.7,-79.4,-5.4C-78,-19.5,-72.2,-33,-63.2,-43.7C-54.2,-54.4,-42,-62.3,-29.5,-68.3C-17,-74.3,-4.2,-78.4,7.6,-77.2C19.4,-76,39,-72.9,39.5,-67.3Z",
    "M43.2,-73.5C56.6,-67.2,68.7,-56.8,76,-43.6C83.3,-30.4,85.8,-15.2,84.5,-0.8C83.2,13.6,78.1,27.2,70.2,38.8C62.3,50.4,51.6,60,39.2,66.7C26.8,73.4,12.6,77.2,-1.1,78.4C-14.8,79.6,-28.1,78.2,-40.3,72.3C-52.5,66.4,-63.6,56,-70.8,43.2C-78,30.4,-81.3,15.2,-80.4,0.5C-79.5,-14.2,-74.4,-28.4,-66.2,-40.2C-58,-52,-46.7,-61.4,-34.2,-68.2C-21.7,-75,-10.8,-79.2,2.2,-82.7C15.2,-86.2,30.4,-89,43.2,-73.5Z",
  ],
  3: [
    "M31.9,-54.2C42.6,-48.4,53.4,-42.1,60.5,-32.6C67.6,-23.1,71,-10.3,70.5,2.2C70,14.7,65.6,26.9,58.4,37.1C51.2,47.3,41.2,55.5,29.6,61.3C18,67.1,4.8,70.5,-8.4,70.2C-21.6,69.9,-34.8,65.9,-45.5,58.5C-56.2,51.1,-64.4,40.3,-69.8,27.8C-75.2,15.3,-77.8,1.1,-75.5,-12C-73.2,-25.1,-66,-37.1,-55.8,-46.5C-45.6,-55.9,-32.4,-62.7,-19.4,-65.9C-6.4,-69.1,6.4,-68.7,18.2,-65C30,-61.3,40.8,-54.3,31.9,-54.2Z",
    "M35.4,-59.8C46.1,-53.7,55.4,-44.6,62.2,-33.6C69,-22.6,73.3,-9.7,72.8,2.9C72.3,15.5,67,27.7,59.2,38.1C51.4,48.5,41.1,57.1,29.2,62.8C17.3,68.5,3.8,71.3,-9.1,70.1C-22,68.9,-34.3,63.7,-44.6,55.8C-54.9,47.9,-63.2,37.3,-68.3,25C-73.4,12.7,-75.3,-1.3,-73,-14.6C-70.7,-27.9,-64.2,-40.5,-54.1,-49.3C-44,-58.1,-30.3,-63.1,-17.4,-65.4C-4.5,-67.7,7.6,-67.3,19,-64.2C30.4,-61.1,41.1,-55.3,35.4,-59.8Z",
  ],
  4: [
    "M48.2,-81.1C62.4,-73.6,73.8,-61.3,80.5,-46.8C87.2,-32.3,89.2,-15.7,86.9,-0.7C84.6,14.3,78,28.1,69.2,39.9C60.4,51.7,49.4,61.5,36.6,68.1C23.8,74.7,9.2,78.1,-4.5,77.1C-18.2,76.1,-31,70.7,-42.9,63.2C-54.8,55.7,-65.8,46.1,-72.4,33.8C-79,21.5,-81.2,6.4,-79,-7.5C-76.8,-21.4,-70.2,-34.1,-60.7,-44.1C-51.2,-54.1,-38.8,-61.4,-26,-68.8C-13.2,-76.2,-0.2,-83.7,13.3,-83.1C26.8,-82.5,40.5,-73.8,48.2,-81.1Z",
    "M45.5,-78C59,-70.3,70.7,-59.2,78.1,-45.7C85.5,-32.2,88.6,-16.1,87.2,-0.8C85.8,14.5,79.9,29,71.4,41.3C62.9,53.6,51.8,63.7,39,70.5C26.2,77.3,11.7,80.8,-2.3,80.1C-16.3,79.4,-29.8,74.5,-42.3,67.2C-54.8,59.9,-66.3,50.2,-73.4,37.6C-80.5,25,-83.2,9.5,-81.5,-5.2C-79.8,-19.9,-73.7,-33.8,-64.4,-44.7C-55.1,-55.6,-42.6,-63.5,-29.8,-71.5C-17,-79.5,-3.9,-87.6,8.6,-86.1C21.1,-84.6,35.3,-73.5,45.5,-78Z",
  ],
  5: [
    "M36.6,-63.2C48,-55.7,58.3,-47.2,65.6,-36.3C72.9,-25.4,77.2,-12.2,76.8,0.7C76.4,13.6,71.3,26.2,63.7,37C56.1,47.8,46,56.8,34.2,62.7C22.4,68.6,8.9,71.4,-4.2,71.1C-17.3,70.8,-30,67.4,-41.1,61C-52.2,54.6,-61.7,45.2,-68,33.5C-74.3,21.8,-77.4,7.8,-76,-5.6C-74.6,-19,-68.7,-31.8,-59.8,-42.1C-50.9,-52.4,-39,-60.2,-26.5,-66.6C-14,-73,0.1,-78,12.9,-76.2C25.7,-74.4,37.2,-65.8,36.6,-63.2Z",
    "M40.1,-68.4C52.2,-61.4,62.7,-51.4,69.9,-39.2C77.1,-27,81,-12.6,80.3,1.5C79.6,15.6,74.3,29.5,66,40.8C57.7,52.1,46.4,60.8,33.8,66.5C21.2,72.2,7.3,74.9,-6.4,74C-20.1,73.1,-33.6,68.6,-44.8,61C-56,53.4,-64.9,42.7,-70.6,30.2C-76.3,17.7,-78.8,3.4,-76.7,-10C-74.6,-23.4,-67.9,-35.9,-58.1,-45.4C-48.3,-54.9,-35.4,-61.4,-22.6,-67.8C-9.8,-74.2,2.9,-80.5,15.5,-79.5C28.1,-78.5,40.6,-70.2,40.1,-68.4Z",
  ],
};

export function AbstractBlob({
  variant = 1,
  size = 300,
  color = "var(--brand-primary, hsl(var(--primary)))",
  opacity = 0.1,
  animate = false,
  className = "",
}: AbstractBlobProps) {
  const [pathA, pathB] = blobPaths[variant] || blobPaths[1];

  return (
    <svg
      viewBox="-100 -100 200 200"
      width={size}
      height={size}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      {animate ? (
        <motion.path
          d={pathA}
          fill={color}
          opacity={opacity}
          animate={{ d: [pathA, pathB, pathA] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <path d={pathA} fill={color} opacity={opacity} />
      )}
    </svg>
  );
}

interface WavesDividerProps {
  variant?: "smooth" | "sharp" | "layered" | "organic";
  position?: "top" | "bottom";
  color?: string;
  height?: number;
  className?: string;
  flip?: boolean;
}

const wavePaths: Record<string, string[]> = {
  smooth: [
    "M0,50 C200,90 400,10 600,50 C800,90 1000,30 1200,50 L1200,120 L0,120 Z",
  ],
  sharp: [
    "M0,80 L150,30 L300,70 L450,20 L600,60 L750,10 L900,50 L1050,25 L1200,55 L1200,120 L0,120 Z",
  ],
  layered: [
    "M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z",
    "M0,70 C200,40 500,90 800,50 C1000,30 1100,70 1200,55 L1200,120 L0,120 Z",
    "M0,80 C400,50 700,95 1000,65 C1100,55 1150,75 1200,70 L1200,120 L0,120 Z",
  ],
  organic: [
    "M0,55 C100,80 200,30 350,65 C500,100 650,25 800,55 C950,85 1100,35 1200,60 L1200,120 L0,120 Z",
  ],
};

export function WavesDivider({
  variant = "smooth",
  position = "bottom",
  color = "var(--brand-background-alt, hsl(var(--muted)))",
  height = 80,
  className = "",
  flip = false,
}: WavesDividerProps) {
  const paths = wavePaths[variant] || wavePaths.smooth;
  const shouldFlipY = position === "top";
  const shouldFlipX = flip;

  let transform = "";
  if (shouldFlipY) transform += "scaleY(-1) ";
  if (shouldFlipX) transform += "scaleX(-1) ";

  return (
    <div
      className={`absolute left-0 right-0 pointer-events-none ${className} ${
        position === "top" ? "top-0" : "bottom-0"
      }`}
      style={{ height, lineHeight: 0 }}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full block"
        aria-hidden="true"
        style={{ transform: transform.trim() || undefined }}
      >
        {variant === "layered"
          ? paths.map((d, i) => (
              <path
                key={i}
                d={d}
                fill={color}
                opacity={1 - i * 0.25}
              />
            ))
          : <path d={paths[0]} fill={color} />
        }
      </svg>
    </div>
  );
}

interface GeometricPatternProps {
  pattern?: "circles" | "hexagons" | "triangles" | "lines" | "cross";
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

export function GeometricPattern({
  pattern = "circles",
  size = 40,
  color = "var(--brand-border, hsl(var(--border)))",
  opacity = 0.05,
  className = "",
}: GeometricPatternProps) {
  const patternId = useId();

  const patternContent = useMemo(() => {
    switch (pattern) {
      case "circles":
        return (
          <circle cx={size / 2} cy={size / 2} r={size * 0.15} fill={color} />
        );
      case "hexagons": {
        const r = size * 0.3;
        const cx = size / 2;
        const cy = size / 2;
        const points = Array.from({ length: 6 }, (_, i) => {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
        }).join(" ");
        return <polygon points={points} fill="none" stroke={color} strokeWidth="1" />;
      }
      case "triangles": {
        const h = size * 0.35;
        const cx = size / 2;
        const cy = size / 2;
        return (
          <polygon
            points={`${cx},${cy - h} ${cx - h * 0.866},${cy + h * 0.5} ${cx + h * 0.866},${cy + h * 0.5}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
        );
      }
      case "lines":
        return (
          <>
            <line x1="0" y1={size} x2={size} y2="0" stroke={color} strokeWidth="1" />
          </>
        );
      case "cross": {
        const mid = size / 2;
        const arm = size * 0.25;
        return (
          <>
            <line x1={mid - arm} y1={mid} x2={mid + arm} y2={mid} stroke={color} strokeWidth="1" />
            <line x1={mid} y1={mid - arm} x2={mid} y2={mid + arm} stroke={color} strokeWidth="1" />
          </>
        );
      }
      default:
        return null;
    }
  }, [pattern, size, color]);

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          {patternContent}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

interface DecorativeCirclesProps {
  count?: number;
  maxSize?: number;
  className?: string;
  animate?: boolean;
}

const circleColors = [
  "var(--brand-primary, hsl(var(--primary)))",
  "var(--brand-secondary, hsl(var(--primary)))",
  "var(--brand-accent, hsl(var(--primary)))",
];

function seededLayout(count: number, maxSize: number) {
  const positions = [
    { cx: 25, cy: 30 },
    { cx: 70, cy: 20 },
    { cx: 50, cy: 65 },
    { cx: 15, cy: 70 },
    { cx: 80, cy: 55 },
    { cx: 40, cy: 15 },
    { cx: 60, cy: 85 },
  ];
  return Array.from({ length: count }, (_, i) => {
    const pos = positions[i % positions.length];
    const sizeFactor = 0.4 + (((i * 37 + 13) % 17) / 17) * 0.6;
    return {
      cx: pos.cx,
      cy: pos.cy,
      r: (maxSize / 2) * sizeFactor,
      opacity: 0.04 + (i % 3) * 0.03,
      color: circleColors[i % circleColors.length],
    };
  });
}

export function DecorativeCircles({
  count = 5,
  maxSize = 200,
  className = "",
  animate = false,
}: DecorativeCirclesProps) {
  const clampedCount = Math.max(3, Math.min(7, count));
  const circles = useMemo(() => seededLayout(clampedCount, maxSize), [clampedCount, maxSize]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {circles.map((c, i) =>
        animate ? (
          <motion.circle
            key={i}
            cx={c.cx}
            cy={c.cy}
            r={c.r / 3}
            fill={c.color}
            opacity={c.opacity}
            animate={{
              cx: [c.cx, c.cx + (i % 2 === 0 ? 3 : -3), c.cx],
              cy: [c.cy, c.cy + (i % 2 === 0 ? -2 : 2), c.cy],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ) : (
          <circle
            key={i}
            cx={c.cx}
            cy={c.cy}
            r={c.r / 3}
            fill={c.color}
            opacity={c.opacity}
          />
        )
      )}
    </svg>
  );
}

interface AbstractLinesProps {
  variant?: "curved" | "straight" | "wavy" | "diagonal";
  count?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  className?: string;
  animate?: boolean;
}

function generateLinePaths(
  variant: string,
  count: number,
  viewW: number,
  viewH: number
): string[] {
  const paths: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / Math.max(count - 1, 1);
    switch (variant) {
      case "curved": {
        const y1 = viewH * 0.1 + t * viewH * 0.8;
        const cp1x = viewW * 0.25;
        const cp1y = y1 - 40 + i * 10;
        const cp2x = viewW * 0.75;
        const cp2y = y1 + 40 - i * 10;
        paths.push(`M0,${y1} C${cp1x},${cp1y} ${cp2x},${cp2y} ${viewW},${y1}`);
        break;
      }
      case "straight": {
        const y = viewH * 0.1 + t * viewH * 0.8;
        paths.push(`M0,${y} L${viewW},${y}`);
        break;
      }
      case "wavy": {
        const baseY = viewH * 0.1 + t * viewH * 0.8;
        const amp = 15 + i * 3;
        const segments = 6;
        const segW = viewW / segments;
        let d = `M0,${baseY}`;
        for (let s = 0; s < segments; s++) {
          const x1 = segW * s + segW * 0.5;
          const y1 = baseY + (s % 2 === 0 ? -amp : amp);
          const x2 = segW * (s + 1);
          const y2 = baseY;
          d += ` Q${x1},${y1} ${x2},${y2}`;
        }
        paths.push(d);
        break;
      }
      case "diagonal": {
        const offset = t * viewW * 0.8;
        paths.push(`M${offset},0 L${viewW},${viewH - offset * (viewH / viewW)}`);
        if (i < count - 1) {
          paths.push(`M0,${offset * (viewH / viewW)} L${viewW - offset},${viewH}`);
        }
        break;
      }
    }
  }
  return paths;
}

export function AbstractLines({
  variant = "curved",
  count = 5,
  color = "var(--brand-primary, hsl(var(--primary)))",
  strokeWidth = 1,
  opacity = 0.1,
  className = "",
  animate = false,
}: AbstractLinesProps) {
  const viewW = 400;
  const viewH = 300;
  const paths = useMemo(
    () => generateLinePaths(variant, count, viewW, viewH),
    [variant, count]
  );

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      preserveAspectRatio="none"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      {paths.map((d, i) =>
        animate ? (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2 + i * 0.5,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ) : (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )
      )}
    </svg>
  );
}

interface IconGridProps {
  icons?: string[];
  columns?: number;
  rows?: number;
  iconSize?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

type ShapeRenderer = (cx: number, cy: number, s: number, color: string) => JSX.Element;

const shapeRenderers: Record<string, ShapeRenderer> = {
  circle: (cx, cy, s, color) => (
    <circle cx={cx} cy={cy} r={s * 0.4} fill="none" stroke={color} strokeWidth="1.5" />
  ),
  square: (cx, cy, s, color) => (
    <rect
      x={cx - s * 0.35}
      y={cy - s * 0.35}
      width={s * 0.7}
      height={s * 0.7}
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      rx="2"
    />
  ),
  triangle: (cx, cy, s, color) => {
    const h = s * 0.4;
    return (
      <polygon
        points={`${cx},${cy - h} ${cx - h * 0.866},${cy + h * 0.5} ${cx + h * 0.866},${cy + h * 0.5}`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
    );
  },
  star: (cx, cy, s, color) => {
    const outerR = s * 0.4;
    const innerR = s * 0.18;
    const points = Array.from({ length: 10 }, (_, i) => {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");
    return <polygon points={points} fill="none" stroke={color} strokeWidth="1.5" />;
  },
  heart: (cx, cy, s, color) => {
    const sc = s * 0.02;
    return (
      <path
        d={`M${cx},${cy + 4 * sc} C${cx},${cy + 2 * sc} ${cx - 5 * sc},${cy - 3 * sc} ${cx - 10 * sc},${cy - 3 * sc} C${cx - 17 * sc},${cy - 3 * sc} ${cx - 17 * sc},${cy + 5 * sc} ${cx - 17 * sc},${cy + 5 * sc} C${cx - 17 * sc},${cy + 12 * sc} ${cx - 5 * sc},${cy + 18 * sc} ${cx},${cy + 22 * sc} C${cx + 5 * sc},${cy + 18 * sc} ${cx + 17 * sc},${cy + 12 * sc} ${cx + 17 * sc},${cy + 5 * sc} C${cx + 17 * sc},${cy + 5 * sc} ${cx + 17 * sc},${cy - 3 * sc} ${cx + 10 * sc},${cy - 3 * sc} C${cx + 5 * sc},${cy - 3 * sc} ${cx},${cy + 2 * sc} ${cx},${cy + 4 * sc} Z`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        transform={`translate(0, ${-s * 0.15})`}
      />
    );
  },
  arrow: (cx, cy, s, color) => {
    const h = s * 0.35;
    return (
      <g>
        <line x1={cx} y1={cy + h} x2={cx} y2={cy - h} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <polyline
          points={`${cx - h * 0.6},${cy - h * 0.3} ${cx},${cy - h} ${cx + h * 0.6},${cy - h * 0.3}`}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  },
};

const defaultShapes = ["circle", "square", "triangle", "star", "heart", "arrow"];

export function IconGrid({
  icons,
  columns = 4,
  rows = 3,
  iconSize = 24,
  color = "var(--brand-primary, hsl(var(--primary)))",
  opacity = 0.06,
  className = "",
}: IconGridProps) {
  const shapes = icons || defaultShapes;
  const cellW = iconSize * 2;
  const cellH = iconSize * 2;
  const viewW = columns * cellW;
  const viewH = rows * cellH;

  const cells = useMemo(() => {
    const result: { x: number; y: number; shape: string; rotation: number; offsetX: number; offsetY: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const idx = r * columns + c;
        const shape = shapes[idx % shapes.length];
        const rotation = ((idx * 17 + 7) % 30) - 15;
        const offsetX = ((idx * 13 + 3) % 8) - 4;
        const offsetY = ((idx * 11 + 5) % 8) - 4;
        result.push({
          x: c * cellW + cellW / 2 + offsetX,
          y: r * cellH + cellH / 2 + offsetY,
          shape,
          rotation,
          offsetX,
          offsetY,
        });
      }
    }
    return result;
  }, [columns, rows, shapes]);

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      preserveAspectRatio="xMidYMid meet"
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ opacity, width: "100%", height: "100%" }}
    >
      {cells.map((cell, i) => {
        const renderer = shapeRenderers[cell.shape] || shapeRenderers.circle;
        return (
          <g key={i} transform={`rotate(${cell.rotation}, ${cell.x}, ${cell.y})`}>
            {renderer(cell.x, cell.y, iconSize, color)}
          </g>
        );
      })}
    </svg>
  );
}

interface GradientShapeProps {
  shape?: "circle" | "diamond" | "hexagon" | "triangle" | "star";
  size?: number;
  gradientAngle?: number;
  className?: string;
  animate?: boolean;
}

function getShapeElement(
  shape: string,
  size: number,
  gradientId: string
): JSX.Element {
  const half = size / 2;
  const fill = `url(#${gradientId})`;

  switch (shape) {
    case "circle":
      return <circle cx={half} cy={half} r={half * 0.9} fill={fill} />;
    case "diamond": {
      const pts = `${half},${half * 0.1} ${half * 1.9},${half} ${half},${half * 1.9} ${half * 0.1},${half}`;
      return <polygon points={pts} fill={fill} />;
    }
    case "hexagon": {
      const r = half * 0.85;
      const points = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        return `${half + r * Math.cos(angle)},${half + r * Math.sin(angle)}`;
      }).join(" ");
      return <polygon points={points} fill={fill} />;
    }
    case "triangle": {
      const pts = `${half},${half * 0.1} ${half * 1.85},${half * 1.85} ${half * 0.15},${half * 1.85}`;
      return <polygon points={pts} fill={fill} />;
    }
    case "star": {
      const outerR = half * 0.9;
      const innerR = half * 0.4;
      const points = Array.from({ length: 10 }, (_, i) => {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        return `${half + r * Math.cos(angle)},${half + r * Math.sin(angle)}`;
      }).join(" ");
      return <polygon points={points} fill={fill} />;
    }
    default:
      return <circle cx={half} cy={half} r={half * 0.9} fill={fill} />;
  }
}

export function GradientShape({
  shape = "circle",
  size = 400,
  gradientAngle = 135,
  className = "",
  animate = false,
}: GradientShapeProps) {
  const gradientId = useId();

  const angleRad = (gradientAngle * Math.PI) / 180;
  const x1 = 50 - Math.cos(angleRad) * 50;
  const y1 = 50 - Math.sin(angleRad) * 50;
  const x2 = 50 + Math.cos(angleRad) * 50;
  const y2 = 50 + Math.sin(angleRad) * 50;

  const shapeEl = getShapeElement(shape, size, gradientId);

  const svgContent = (
    <>
      <defs>
        <linearGradient
          id={gradientId}
          x1={`${x1}%`}
          y1={`${y1}%`}
          x2={`${x2}%`}
          y2={`${y2}%`}
        >
          <stop
            offset="0%"
            style={{ stopColor: "var(--brand-primary, hsl(var(--primary)))" }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "var(--brand-secondary, hsl(var(--primary)))" }}
          />
        </linearGradient>
      </defs>
      {shapeEl}
    </>
  );

  if (animate) {
    return (
      <motion.svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className={`pointer-events-none ${className}`}
        aria-hidden="true"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ overflow: "visible" }}
      >
        {svgContent}
      </motion.svg>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      {svgContent}
    </svg>
  );
}
