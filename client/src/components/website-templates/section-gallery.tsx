import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { useThemeMotion } from "./motion-wrapper";
import { GradientMesh, DotGrid } from "./visuals/floating-elements";

interface GalleryImage {
  src?: string;
  alt?: string;
  caption?: string;
}

interface GalleryData {
  headline?: string;
  subheadline?: string;
  images?: GalleryImage[];
}

export default function SectionGallery({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as GalleryData;
  const images = data.images || [];
  const themeMotion = useThemeMotion();

  const getSpanClass = (index: number, total: number) => {
    if (total <= 4) return "";
    if (index === 0) return "col-span-2 row-span-2";
    if (index === 3 && total > 5) return "col-span-2";
    return "";
  };
  
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" data-testid="section-gallery">
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ opacity: 0.2 }}><GradientMesh /></div>
        <DotGrid opacity={0.015} />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {data.headline && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.duration }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
              style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}
              data-testid="text-gallery-headline">
              {data.headline}
            </h2>
            {data.subheadline && (
              <p className="text-lg sm:text-xl max-w-2xl mx-auto"
                style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}
                data-testid="text-gallery-subheadline">
                {data.subheadline}
              </p>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className={`group relative aspect-square rounded-xl overflow-hidden ${getSpanClass(index, images.length)}`}
              style={{
                backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
                border: "1px solid var(--brand-border, hsl(var(--border)))",
              }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -6, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
              data-testid={`img-gallery-item-${index}`}
            >
              {image.src ? (
                <img 
                  src={image.src} 
                  alt={image.alt || "Gallery image"} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, 
                      hsl(var(--brand-primary-hsl, var(--primary)) / 0.1) 0%, 
                      hsl(var(--brand-primary-hsl, var(--primary)) / 0.03) 100%)`
                  }}>
                  <ImageIcon className="w-12 h-12" style={{ color: "var(--brand-primary, hsl(var(--primary)))", opacity: 0.3 }} />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {image.caption && (
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <p className="text-white text-sm font-medium backdrop-blur-sm bg-black/20 rounded-lg px-3 py-2">
                    {image.caption}
                  </p>
                </div>
              )}

              <motion.div
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                style={{ backgroundColor: "var(--brand-primary, hsl(var(--primary)))" }}
              >
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
