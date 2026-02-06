import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useThemeMotion } from "../motion-wrapper";

interface AsymmetricGridProps {
  children: ReactNode[];
  pattern?: "2-1" | "1-2" | "3-2" | "2-3" | "featured" | "masonry" | "bento";
  gap?: string;
  className?: string;
}

const patterns = {
  "2-1": "grid-cols-1 md:grid-cols-3",
  "1-2": "grid-cols-1 md:grid-cols-3",
  "3-2": "grid-cols-1 md:grid-cols-5",
  "2-3": "grid-cols-1 md:grid-cols-5",
  "featured": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  "masonry": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "bento": "grid-cols-2 md:grid-cols-4",
};

const itemPatterns = {
  "2-1": ["md:col-span-2", "md:col-span-1"],
  "1-2": ["md:col-span-1", "md:col-span-2"],
  "3-2": ["md:col-span-3", "md:col-span-2"],
  "2-3": ["md:col-span-2", "md:col-span-3"],
  "featured": ["md:col-span-2 md:row-span-2", "md:col-span-1", "md:col-span-1"],
  "masonry": [],
  "bento": [],
};

export default function AsymmetricGrid({ 
  children, 
  pattern = "2-1", 
  gap = "gap-6",
  className = ""
}: AsymmetricGridProps) {
  const themeMotion = useThemeMotion();
  const gridClass = patterns[pattern];
  const childPatterns = itemPatterns[pattern];
  
  if (pattern === "bento") {
    return (
      <div className={`grid ${gridClass} ${gap} ${className}`}>
        {children.map((child, i) => {
          const bentoPattern = getBentoPattern(i, children.length);
          return (
            <motion.div
              key={i}
              className={bentoPattern}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: themeMotion.duration }}
            >
              {child}
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`grid ${gridClass} ${gap} ${className}`}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          className={childPatterns[i % childPatterns.length] || ""}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: themeMotion.duration }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

function getBentoPattern(index: number, total: number): string {
  const bentoPatterns = [
    "col-span-2 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-2",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
  ];
  
  return bentoPatterns[index % bentoPatterns.length];
}

interface AlternatingLayoutProps {
  items: {
    content: ReactNode;
    media?: ReactNode;
  }[];
  gap?: string;
  className?: string;
}

export function AlternatingLayout({ items, gap = "space-y-24 md:space-y-32", className = "" }: AlternatingLayoutProps) {
  const themeMotion = useThemeMotion();
  return (
    <div className={`${gap} ${className}`}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
            i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
          }`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: themeMotion.durationSlow, delay: 0.1 }}
        >
          <div>{item.content}</div>
          {item.media && <div>{item.media}</div>}
        </motion.div>
      ))}
    </div>
  );
}

interface EditorialGridProps {
  children: ReactNode;
  columns?: "8-4" | "4-8" | "6-6" | "7-5" | "5-7";
  className?: string;
}

const editorialColumns = {
  "8-4": "lg:grid-cols-12 [&>*:first-child]:lg:col-span-8 [&>*:last-child]:lg:col-span-4",
  "4-8": "lg:grid-cols-12 [&>*:first-child]:lg:col-span-4 [&>*:last-child]:lg:col-span-8",
  "6-6": "lg:grid-cols-2",
  "7-5": "lg:grid-cols-12 [&>*:first-child]:lg:col-span-7 [&>*:last-child]:lg:col-span-5",
  "5-7": "lg:grid-cols-12 [&>*:first-child]:lg:col-span-5 [&>*:last-child]:lg:col-span-7",
};

export function EditorialGrid({ children, columns = "6-6", className = "" }: EditorialGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-8 lg:gap-16 ${editorialColumns[columns]} ${className}`}>
      {children}
    </div>
  );
}
