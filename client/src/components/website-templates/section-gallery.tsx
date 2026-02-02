import type { SectionContent } from "@shared/schema";
import { Image as ImageIcon } from "lucide-react";

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
  
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {data.headline && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-gallery-headline">{data.headline}</h2>
            {data.subheadline && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-gallery-subheadline">{data.subheadline}</p>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="group relative aspect-square rounded-lg overflow-hidden bg-card border" data-testid={`img-gallery-item-${index}`}>
              {image.src ? (
                <img 
                  src={image.src} 
                  alt={image.alt || "Gallery image"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <ImageIcon className="w-12 h-12 text-primary/30" />
                </div>
              )}
              {image.caption && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
