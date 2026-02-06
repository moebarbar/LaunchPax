import { cn } from "@/lib/utils";
import type { SectionContent, GlobalContent, SiteSettings } from "@shared/schema";
import type { SelectedElement } from "@/pages/visual-editor";
import { EditableText } from "./editable-elements";
import { EditableImage } from "./editable-elements";

interface EditableSectionProps {
  section: SectionContent;
  sectionIndex: number;
  selectedElement: SelectedElement | null;
  onElementClick: (element: SelectedElement) => void;
  siteSettings?: SiteSettings | null;
  globalContent?: GlobalContent | null;
}

export function EditableSection({
  section,
  sectionIndex,
  selectedElement,
  onElementClick,
  siteSettings,
  globalContent,
}: EditableSectionProps) {
  const isSelected = selectedElement?.sectionId === section.id && selectedElement?.type === "section";
  const basePath = `pages[0].sections[${sectionIndex}]`;
  const data = (section.data || {}) as Record<string, any>;

  return (
    <div
      className={cn(
        "relative transition-all duration-200",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onElementClick({
            type: "section",
            sectionId: section.id,
            sectionIndex,
            path: basePath,
            value: section,
            label: `${formatType(section.type)} Section`,
          });
        }
      }}
      data-testid={`editable-section-${sectionIndex}`}
    >
      {renderEditableContent(section, sectionIndex, basePath, data, selectedElement, onElementClick, siteSettings, globalContent)}
    </div>
  );
}

function renderEditableContent(
  section: SectionContent,
  sectionIndex: number,
  basePath: string,
  data: Record<string, any>,
  selectedElement: SelectedElement | null,
  onElementClick: (element: SelectedElement) => void,
  siteSettings?: SiteSettings | null,
  globalContent?: GlobalContent | null,
) {
  const isDark = (siteSettings as any)?.colorScheme === "dark";
  const bgColor = siteSettings?.backgroundColor || (isDark ? "#0f172a" : "#ffffff");
  const textColor = siteSettings?.textColor || (isDark ? "#e2e8f0" : "#1a1a2e");
  const mutedColor = siteSettings?.mutedTextColor || (isDark ? "#94a3b8" : "#6b7280");
  const primaryColor = siteSettings?.primaryColor || "#3b82f6";
  const surfaceColor = siteSettings?.surfaceColor || (isDark ? "#1e293b" : "#f8fafc");

  const commonProps = { selectedElement, onElementClick, basePath, sectionId: section.id, sectionIndex };

  switch (section.type) {
    case "hero":
      return (
        <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden" style={{ backgroundColor: bgColor, color: textColor, minHeight: "70vh", display: "flex", alignItems: "center" }}>
          {data.image && (
            <div className="absolute inset-0">
              <EditableImage
                src={data.image}
                alt={data.headline || "Hero image"}
                path={`${basePath}.data.image`}
                label="Hero Image"
                className="w-full h-full object-cover"
                {...commonProps}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
            </div>
          )}
          <div className="relative z-10 max-w-6xl mx-auto w-full">
            {data.badge && (
              <EditableText value={data.badge} path={`${basePath}.data.badge`} label="Badge" className="inline-block text-sm font-medium px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }} {...commonProps} />
            )}
            <EditableText value={data.headline || "Headline"} path={`${basePath}.data.headline`} label="Headline" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6" style={{ color: data.image ? "#ffffff" : textColor, letterSpacing: "-0.035em" }} {...commonProps} />
            <EditableText value={data.subheadline || data.statement || ""} path={`${basePath}.data.subheadline`} label="Subheadline" className="text-lg sm:text-xl max-w-2xl leading-relaxed mb-8" style={{ color: data.image ? "rgba(255,255,255,0.85)" : mutedColor }} {...commonProps} />
            <div className="flex flex-wrap gap-4">
              {data.ctaText && (
                <EditableText value={data.ctaText} path={`${basePath}.data.ctaText`} label="CTA Button" className="inline-block px-8 py-3.5 rounded-lg font-semibold text-white" style={{ backgroundColor: primaryColor }} {...commonProps} />
              )}
              {data.secondaryCtaText && (
                <EditableText value={data.secondaryCtaText} path={`${basePath}.data.secondaryCtaText`} label="Secondary CTA" className="inline-block px-8 py-3.5 rounded-lg font-semibold border-2" style={{ borderColor: data.image ? "rgba(255,255,255,0.3)" : `${primaryColor}40`, color: data.image ? "#ffffff" : textColor }} {...commonProps} />
              )}
            </div>
          </div>
        </section>
      );

    case "features":
      return (
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: surfaceColor, color: textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <EditableText value={data.headline || "Features"} path={`${basePath}.data.headline`} label="Section Headline" className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textColor }} {...commonProps} />
              {data.subheadline && <EditableText value={data.subheadline} path={`${basePath}.data.subheadline`} label="Section Subheadline" className="text-lg max-w-2xl mx-auto" style={{ color: mutedColor }} {...commonProps} />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(data.items || []).map((item: any, i: number) => (
                <div key={i} className="rounded-xl p-6" style={{ backgroundColor: bgColor, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                  <EditableText value={item.title || `Feature ${i + 1}`} path={`${basePath}.data.items[${i}].title`} label={`Feature ${i + 1} Title`} className="text-lg font-semibold mb-2" style={{ color: textColor }} {...commonProps} />
                  <EditableText value={item.description || ""} path={`${basePath}.data.items[${i}].description`} label={`Feature ${i + 1} Description`} className="text-sm leading-relaxed" style={{ color: mutedColor }} {...commonProps} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "testimonials":
      return (
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: bgColor, color: textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <EditableText value={data.headline || "Testimonials"} path={`${basePath}.data.headline`} label="Section Headline" className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textColor }} {...commonProps} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(data.items || []).map((item: any, i: number) => (
                <div key={i} className="rounded-xl p-6 border" style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }}>
                  <EditableText value={item.quote || item.description || ""} path={`${basePath}.data.items[${i}].quote`} label={`Testimonial ${i + 1} Quote`} className="text-sm italic leading-relaxed mb-4" style={{ color: mutedColor }} {...commonProps} />
                  <EditableText value={item.name || item.title || ""} path={`${basePath}.data.items[${i}].name`} label={`Testimonial ${i + 1} Name`} className="text-sm font-semibold" style={{ color: textColor }} {...commonProps} />
                  {(item.role || item.company) && (
                    <EditableText value={item.role || item.company || ""} path={`${basePath}.data.items[${i}].role`} label={`Testimonial ${i + 1} Role`} className="text-xs" style={{ color: mutedColor }} {...commonProps} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "cta":
      return (
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}>
          <div className="max-w-4xl mx-auto text-center">
            <EditableText value={data.headline || "Ready to get started?"} path={`${basePath}.data.headline`} label="CTA Headline" className="text-3xl sm:text-4xl font-bold mb-4 text-white" {...commonProps} />
            {data.subheadline && <EditableText value={data.subheadline} path={`${basePath}.data.subheadline`} label="CTA Subheadline" className="text-lg mb-8 text-white/80" {...commonProps} />}
            {data.ctaText && <EditableText value={data.ctaText} path={`${basePath}.data.ctaText`} label="CTA Button" className="inline-block px-8 py-3.5 rounded-lg font-semibold bg-white" style={{ color: primaryColor }} {...commonProps} />}
          </div>
        </section>
      );

    case "pricing":
      return (
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: surfaceColor, color: textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <EditableText value={data.headline || "Pricing"} path={`${basePath}.data.headline`} label="Section Headline" className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textColor }} {...commonProps} />
              {data.subheadline && <EditableText value={data.subheadline} path={`${basePath}.data.subheadline`} label="Section Subheadline" className="text-lg" style={{ color: mutedColor }} {...commonProps} />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(data.tiers || data.items || []).map((tier: any, i: number) => (
                <div key={i} className={cn("rounded-xl p-8 border", tier.highlighted && "ring-2")} style={{ backgroundColor: bgColor, borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)", ...(tier.highlighted ? { ringColor: primaryColor } : {}) }}>
                  <EditableText value={tier.name || tier.title || `Plan ${i + 1}`} path={`${basePath}.data.${data.tiers ? "tiers" : "items"}[${i}].name`} label={`Plan ${i + 1} Name`} className="text-lg font-semibold mb-2" style={{ color: textColor }} {...commonProps} />
                  <EditableText value={tier.price || ""} path={`${basePath}.data.${data.tiers ? "tiers" : "items"}[${i}].price`} label={`Plan ${i + 1} Price`} className="text-3xl font-bold mb-4" style={{ color: primaryColor }} {...commonProps} />
                  <EditableText value={tier.description || ""} path={`${basePath}.data.${data.tiers ? "tiers" : "items"}[${i}].description`} label={`Plan ${i + 1} Description`} className="text-sm mb-6" style={{ color: mutedColor }} {...commonProps} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "contact":
      return (
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: bgColor, color: textColor }}>
          <div className="max-w-4xl mx-auto text-center">
            <EditableText value={data.headline || "Contact Us"} path={`${basePath}.data.headline`} label="Contact Headline" className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textColor }} {...commonProps} />
            {data.subheadline && <EditableText value={data.subheadline} path={`${basePath}.data.subheadline`} label="Contact Subheadline" className="text-lg mb-8" style={{ color: mutedColor }} {...commonProps} />}
            {data.email && <EditableText value={data.email} path={`${basePath}.data.email`} label="Email" className="text-lg mb-2" style={{ color: primaryColor }} {...commonProps} />}
            {data.phone && <EditableText value={data.phone} path={`${basePath}.data.phone`} label="Phone" className="text-lg mb-2" style={{ color: textColor }} {...commonProps} />}
            {data.address && <EditableText value={data.address} path={`${basePath}.data.address`} label="Address" className="text-sm" style={{ color: mutedColor }} {...commonProps} />}
          </div>
        </section>
      );

    case "team":
      return (
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: surfaceColor, color: textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <EditableText value={data.headline || "Our Team"} path={`${basePath}.data.headline`} label="Section Headline" className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textColor }} {...commonProps} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(data.members || data.items || []).map((member: any, i: number) => (
                <div key={i} className="text-center rounded-xl p-6" style={{ backgroundColor: bgColor }}>
                  {member.image && <EditableImage src={member.image} alt={member.name || ""} path={`${basePath}.data.${data.members ? "members" : "items"}[${i}].image`} label={`Team Member ${i + 1} Photo`} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" {...commonProps} />}
                  <EditableText value={member.name || member.title || ""} path={`${basePath}.data.${data.members ? "members" : "items"}[${i}].name`} label={`Member ${i + 1} Name`} className="font-semibold mb-1" style={{ color: textColor }} {...commonProps} />
                  <EditableText value={member.role || member.description || ""} path={`${basePath}.data.${data.members ? "members" : "items"}[${i}].role`} label={`Member ${i + 1} Role`} className="text-sm" style={{ color: mutedColor }} {...commonProps} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "faq":
      return (
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: bgColor, color: textColor }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <EditableText value={data.headline || "FAQ"} path={`${basePath}.data.headline`} label="Section Headline" className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textColor }} {...commonProps} />
            </div>
            <div className="space-y-4">
              {(data.items || []).map((item: any, i: number) => (
                <div key={i} className="rounded-xl p-6 border" style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }}>
                  <EditableText value={item.question || item.title || ""} path={`${basePath}.data.items[${i}].question`} label={`FAQ ${i + 1} Question`} className="font-semibold mb-2" style={{ color: textColor }} {...commonProps} />
                  <EditableText value={item.answer || item.description || ""} path={`${basePath}.data.items[${i}].answer`} label={`FAQ ${i + 1} Answer`} className="text-sm leading-relaxed" style={{ color: mutedColor }} {...commonProps} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "stats":
      return (
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: surfaceColor, color: textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <EditableText value={data.headline || "By the Numbers"} path={`${basePath}.data.headline`} label="Section Headline" className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textColor }} {...commonProps} />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {(data.items || []).map((stat: any, i: number) => (
                <div key={i} className="text-center">
                  <EditableText value={stat.value || stat.title || ""} path={`${basePath}.data.items[${i}].value`} label={`Stat ${i + 1} Value`} className="text-4xl font-bold mb-2" style={{ color: primaryColor }} {...commonProps} />
                  <EditableText value={stat.label || stat.description || ""} path={`${basePath}.data.items[${i}].label`} label={`Stat ${i + 1} Label`} className="text-sm" style={{ color: mutedColor }} {...commonProps} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "services":
      return (
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: bgColor, color: textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <EditableText value={data.headline || "Our Services"} path={`${basePath}.data.headline`} label="Section Headline" className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textColor }} {...commonProps} />
              {data.subheadline && <EditableText value={data.subheadline} path={`${basePath}.data.subheadline`} label="Section Subheadline" className="text-lg" style={{ color: mutedColor }} {...commonProps} />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(data.items || []).map((service: any, i: number) => (
                <div key={i} className="rounded-xl p-6" style={{ backgroundColor: surfaceColor }}>
                  <EditableText value={service.title || ""} path={`${basePath}.data.items[${i}].title`} label={`Service ${i + 1} Title`} className="text-lg font-semibold mb-2" style={{ color: textColor }} {...commonProps} />
                  <EditableText value={service.description || ""} path={`${basePath}.data.items[${i}].description`} label={`Service ${i + 1} Description`} className="text-sm leading-relaxed" style={{ color: mutedColor }} {...commonProps} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "text":
    case "story":
    case "brand_story":
      return (
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: bgColor, color: textColor }}>
          <div className="max-w-4xl mx-auto">
            {data.headline && <EditableText value={data.headline} path={`${basePath}.data.headline`} label="Headline" className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: textColor }} {...commonProps} />}
            {data.subheadline && <EditableText value={data.subheadline} path={`${basePath}.data.subheadline`} label="Subheadline" className="text-lg mb-4" style={{ color: mutedColor }} {...commonProps} />}
            {data.body && <EditableText value={data.body} path={`${basePath}.data.body`} label="Body Text" className="text-base leading-relaxed whitespace-pre-line" style={{ color: mutedColor }} {...commonProps} />}
          </div>
        </section>
      );

    case "gallery":
      return (
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: surfaceColor, color: textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <EditableText value={data.headline || "Gallery"} path={`${basePath}.data.headline`} label="Section Headline" className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textColor }} {...commonProps} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(data.images || data.items || []).map((img: any, i: number) => (
                <div key={i} className="rounded-lg overflow-hidden aspect-square">
                  <EditableImage
                    src={typeof img === "string" ? img : img.url || img.image || ""}
                    alt={typeof img === "string" ? `Gallery ${i + 1}` : img.alt || img.title || `Gallery ${i + 1}`}
                    path={`${basePath}.data.${data.images ? "images" : "items"}[${i}]${typeof img === "string" ? "" : ".url"}`}
                    label={`Gallery Image ${i + 1}`}
                    className="w-full h-full object-cover"
                    {...commonProps}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "process":
      return (
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: bgColor, color: textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <EditableText value={data.headline || "Our Process"} path={`${basePath}.data.headline`} label="Section Headline" className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textColor }} {...commonProps} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(data.steps || data.items || []).map((step: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold" style={{ backgroundColor: primaryColor }}>{i + 1}</div>
                  <EditableText value={step.title || ""} path={`${basePath}.data.${data.steps ? "steps" : "items"}[${i}].title`} label={`Step ${i + 1} Title`} className="font-semibold mb-2" style={{ color: textColor }} {...commonProps} />
                  <EditableText value={step.description || ""} path={`${basePath}.data.${data.steps ? "steps" : "items"}[${i}].description`} label={`Step ${i + 1} Description`} className="text-sm" style={{ color: mutedColor }} {...commonProps} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    default:
      return (
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: bgColor, color: textColor }}>
          <div className="max-w-6xl mx-auto">
            {data.headline && <EditableText value={data.headline} path={`${basePath}.data.headline`} label="Headline" className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textColor }} {...commonProps} />}
            {data.subheadline && <EditableText value={data.subheadline} path={`${basePath}.data.subheadline`} label="Subheadline" className="text-lg mb-4" style={{ color: mutedColor }} {...commonProps} />}
            {data.body && <EditableText value={data.body} path={`${basePath}.data.body`} label="Body" className="leading-relaxed" style={{ color: mutedColor }} {...commonProps} />}
            {data.items && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {(data.items || []).map((item: any, i: number) => (
                  <div key={i} className="p-6 rounded-xl" style={{ backgroundColor: surfaceColor }}>
                    <EditableText value={item.title || ""} path={`${basePath}.data.items[${i}].title`} label={`Item ${i + 1} Title`} className="font-semibold mb-2" style={{ color: textColor }} {...commonProps} />
                    <EditableText value={item.description || ""} path={`${basePath}.data.items[${i}].description`} label={`Item ${i + 1} Description`} className="text-sm" style={{ color: mutedColor }} {...commonProps} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );
  }
}

function formatType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
