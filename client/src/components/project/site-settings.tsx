import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Save, 
  Loader2, 
  Building2, 
  Phone, 
  Share2, 
  MousePointer,
  Clock,
  Target,
  Plus,
  X,
  Settings
} from "lucide-react";
import type { Project, BusinessProfile } from "@shared/schema";

const settingsSchema = z.object({
  // Business Basics
  businessName: z.string().optional(),
  tagline: z.string().optional(),
  
  // Contact Info
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  
  // CTAs
  primaryCta: z.string().optional(),
  secondaryCta: z.string().optional(),
  ctaLink: z.string().optional(),
  
  // Preferred Contact
  preferredContactMethod: z.string().optional(),
  responseTime: z.string().optional(),
  
  // Social Links
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  
  // Business Hours
  mondayHours: z.string().optional(),
  tuesdayHours: z.string().optional(),
  wednesdayHours: z.string().optional(),
  thursdayHours: z.string().optional(),
  fridayHours: z.string().optional(),
  saturdayHours: z.string().optional(),
  sundayHours: z.string().optional(),
  hoursNote: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SiteSettingsProps {
  project: Project;
}

const contactMethods = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone Call" },
  { value: "form", label: "Contact Form" },
  { value: "chat", label: "Live Chat" },
  { value: "booking", label: "Online Booking" },
];

export function SiteSettings({ project }: SiteSettingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("contact");
  
  const profile = project.businessProfile as BusinessProfile | undefined;

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      businessName: profile?.businessName || project.name || "",
      tagline: profile?.tagline || "",
      email: profile?.contactInfo?.email || "",
      phone: profile?.contactInfo?.phone || "",
      address: profile?.contactInfo?.address || "",
      primaryCta: profile?.websiteGoals?.primaryCta || "",
      secondaryCta: profile?.websiteGoals?.secondaryCta || "",
      ctaLink: "",
      preferredContactMethod: profile?.preferredContactMethod || "",
      responseTime: profile?.responseTime || "",
      instagram: profile?.socialLinks?.instagram || "",
      facebook: profile?.socialLinks?.facebook || "",
      linkedin: profile?.socialLinks?.linkedin || "",
      twitter: profile?.socialLinks?.twitter || "",
      tiktok: profile?.socialLinks?.tiktok || "",
      youtube: profile?.socialLinks?.youtube || "",
      mondayHours: profile?.businessHours?.monday || "",
      tuesdayHours: profile?.businessHours?.tuesday || "",
      wednesdayHours: profile?.businessHours?.wednesday || "",
      thursdayHours: profile?.businessHours?.thursday || "",
      fridayHours: profile?.businessHours?.friday || "",
      saturdayHours: profile?.businessHours?.saturday || "",
      sundayHours: profile?.businessHours?.sunday || "",
      hoursNote: profile?.businessHours?.note || "",
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      // Merge form data back into businessProfile structure
      const updatedProfile: BusinessProfile = {
        ...profile,
        businessName: data.businessName,
        tagline: data.tagline,
        contactInfo: {
          ...profile?.contactInfo,
          email: data.email,
          phone: data.phone,
          address: data.address,
        },
        socialLinks: {
          ...profile?.socialLinks,
          instagram: data.instagram,
          facebook: data.facebook,
          linkedin: data.linkedin,
          twitter: data.twitter,
          tiktok: data.tiktok,
          youtube: data.youtube,
        },
        preferredContactMethod: data.preferredContactMethod as any,
        responseTime: data.responseTime,
        websiteGoals: {
          ...profile?.websiteGoals,
          primaryCta: data.primaryCta,
          secondaryCta: data.secondaryCta,
        },
        businessHours: {
          monday: data.mondayHours,
          tuesday: data.tuesdayHours,
          wednesday: data.wednesdayHours,
          thursday: data.thursdayHours,
          friday: data.fridayHours,
          saturday: data.saturdayHours,
          sunday: data.sundayHours,
          note: data.hoursNote,
        },
      };

      const response = await apiRequest("PATCH", `/api/projects/${project.id}`, {
        businessProfile: updatedProfile,
        name: data.businessName || project.name,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", project.id] });
      toast({
        title: "Settings saved",
        description: "Your site settings have been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    updateSettings.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Site Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Edit your business info, contact details, and social links. These apply across your entire website.
          </p>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={updateSettings.isPending}
          data-testid="button-save-settings"
        >
          {updateSettings.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="contact" className="flex items-center gap-1" data-testid="tab-contact">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Contact</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-1" data-testid="tab-social">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Social</span>
              </TabsTrigger>
              <TabsTrigger value="cta" className="flex items-center gap-1" data-testid="tab-cta">
                <MousePointer className="w-4 h-4" />
                <span className="hidden sm:inline">Buttons</span>
              </TabsTrigger>
              <TabsTrigger value="hours" className="flex items-center gap-1" data-testid="tab-hours">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Hours</span>
              </TabsTrigger>
            </TabsList>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="w-5 h-5" />
                    Business Information
                  </CardTitle>
                  <CardDescription>
                    Basic information that appears throughout your website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Business Name"
                            {...field}
                            data-testid="input-business-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagline / Slogan</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="A short, memorable phrase about your business"
                            {...field}
                            data-testid="input-tagline"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="w-5 h-5" />
                    Contact Details
                  </CardTitle>
                  <CardDescription>
                    How customers can reach you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="contact@yourbusiness.com"
                              {...field}
                              data-testid="input-settings-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(555) 123-4567"
                              {...field}
                              data-testid="input-settings-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="123 Main Street&#10;City, State 12345"
                            className="min-h-[80px]"
                            {...field}
                            data-testid="input-settings-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="preferredContactMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Contact Method</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-contact-method">
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {contactMethods.map((method) => (
                                <SelectItem key={method.value} value={method.value}>
                                  {method.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Determines the main CTA style
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="responseTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Response Time</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Within 24 hours"
                              {...field}
                              data-testid="input-response-time"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Tab */}
            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Share2 className="w-5 h-5" />
                    Social Media Links
                  </CardTitle>
                  <CardDescription>
                    Connect your social profiles - these appear in your website header and footer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="@yourbusiness or full URL"
                              {...field}
                              data-testid="input-settings-instagram"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="facebook.com/yourbusiness"
                              {...field}
                              data-testid="input-settings-facebook"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="linkedin.com/company/yourbusiness"
                              {...field}
                              data-testid="input-settings-linkedin"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter / X</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="@yourbusiness"
                              {...field}
                              data-testid="input-settings-twitter"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tiktok"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TikTok</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="@yourbusiness"
                              {...field}
                              data-testid="input-settings-tiktok"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="youtube"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="youtube.com/@yourbusiness"
                              {...field}
                              data-testid="input-settings-youtube"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CTAs Tab */}
            <TabsContent value="cta" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MousePointer className="w-5 h-5" />
                    Call-to-Action Buttons
                  </CardTitle>
                  <CardDescription>
                    Customize the buttons that appear throughout your website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="primaryCta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Button Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Get Started, Book Now, Contact Us"
                            {...field}
                            data-testid="input-primary-cta"
                          />
                        </FormControl>
                        <FormDescription>
                          The main action button - appears in hero and navigation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryCta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Button Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Learn More, View Services, See Pricing"
                            {...field}
                            data-testid="input-secondary-cta"
                          />
                        </FormControl>
                        <FormDescription>
                          An alternative action for visitors who want more info first
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Preview</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button data-testid="preview-primary-cta">
                        {form.watch("primaryCta") || "Get Started"}
                      </Button>
                      <Button variant="outline" data-testid="preview-secondary-cta">
                        {form.watch("secondaryCta") || "Learn More"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hours Tab */}
            <TabsContent value="hours" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5" />
                    Business Hours
                  </CardTitle>
                  <CardDescription>
                    Let customers know when you're available
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                    <FormField
                      key={day}
                      control={form.control}
                      name={`${day}Hours` as any}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-4">
                            <FormLabel className="w-24 capitalize">{day}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 9:00 AM - 5:00 PM or Closed"
                                {...field}
                                data-testid={`input-${day}-hours`}
                                className="flex-1"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <FormField
                    control={form.control}
                    name="hoursNote"
                    render={({ field }) => (
                      <FormItem className="pt-4 border-t">
                        <FormLabel>Additional Note</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., By appointment only, Holiday hours may vary"
                            {...field}
                            data-testid="input-hours-note"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
