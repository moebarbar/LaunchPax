import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  ArrowRight, 
  Rocket, 
  Loader2, 
  Building2, 
  Phone, 
  Target,
  Palette,
  Check,
  X,
  Plus
} from "lucide-react";
import { Link } from "wouter";

// Step 1: Business Basics
const step1Schema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  businessIdea: z.string().min(10, "Please describe your business idea in more detail"),
  industry: z.string().optional(),
  yearsInBusiness: z.string().optional(),
  teamSize: z.string().optional(),
  location: z.string().optional(),
});

// Step 2: Contact & Social
const step2Schema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  preferredContactMethod: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  tiktok: z.string().optional(),
});

// Step 3: Services & Positioning
const step3Schema = z.object({
  services: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
  })).optional(),
  uniqueSellingPoints: z.array(z.string()).optional(),
  targetAudience: z.string().optional(),
  customerPainPoints: z.array(z.string()).optional(),
});

// Step 4: Website Goals & Brand
const step4Schema = z.object({
  primaryPurpose: z.string().optional(),
  primaryCta: z.string().optional(),
  secondaryCta: z.string().optional(),
  visualStyle: z.string().optional(),
  tone: z.string().optional(),
  inspirationUrls: z.array(z.string()).optional(),
});

const fullFormSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);

type FullFormValues = z.infer<typeof fullFormSchema>;

const industries = [
  "Technology / SaaS",
  "E-commerce",
  "Healthcare / Wellness",
  "Finance / Insurance",
  "Education",
  "Food & Beverage",
  "Real Estate",
  "Entertainment",
  "Travel / Hospitality",
  "Fashion / Beauty",
  "Fitness / Sports",
  "Consulting / Professional Services",
  "Creative / Agency",
  "Non-Profit",
  "Other",
];

const visualStyles = [
  { value: "modern", label: "Modern & Clean" },
  { value: "professional", label: "Professional & Corporate" },
  { value: "playful", label: "Playful & Fun" },
  { value: "luxury", label: "Luxury & Premium" },
  { value: "minimal", label: "Minimal & Simple" },
  { value: "bold", label: "Bold & Dynamic" },
  { value: "classic", label: "Classic & Timeless" },
];

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly & Warm" },
  { value: "casual", label: "Casual & Relaxed" },
  { value: "formal", label: "Formal & Authoritative" },
  { value: "playful", label: "Playful & Fun" },
  { value: "authoritative", label: "Expert & Trustworthy" },
];

const purposes = [
  { value: "generate_leads", label: "Generate Leads / Get Inquiries" },
  { value: "sell_products", label: "Sell Products Online" },
  { value: "provide_information", label: "Provide Information" },
  { value: "build_community", label: "Build Community" },
  { value: "showcase_work", label: "Showcase Portfolio / Work" },
  { value: "book_appointments", label: "Book Appointments / Consultations" },
];

const contactMethods = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone Call" },
  { value: "form", label: "Contact Form" },
  { value: "chat", label: "Live Chat" },
  { value: "booking", label: "Online Booking" },
];

const STEPS = [
  { id: 1, name: "Business Basics", icon: Building2, description: "Tell us about your business" },
  { id: 2, name: "Contact & Social", icon: Phone, description: "How customers can reach you" },
  { id: 3, name: "Services & Value", icon: Target, description: "What makes you unique" },
  { id: 4, name: "Goals & Style", icon: Palette, description: "Your website vision" },
];

export default function NewProjectPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { selectProject } = useSelectedProject();
  const [currentStep, setCurrentStep] = useState(1);
  const [newService, setNewService] = useState({ name: "", description: "" });
  const [newUsp, setNewUsp] = useState("");
  const [newPainPoint, setNewPainPoint] = useState("");
  const [newInspiration, setNewInspiration] = useState("");

  const form = useForm<FullFormValues>({
    resolver: zodResolver(fullFormSchema),
    defaultValues: {
      name: "",
      businessIdea: "",
      industry: "",
      yearsInBusiness: "",
      teamSize: "",
      location: "",
      email: "",
      phone: "",
      address: "",
      preferredContactMethod: "",
      instagram: "",
      facebook: "",
      linkedin: "",
      twitter: "",
      tiktok: "",
      services: [],
      uniqueSellingPoints: [],
      targetAudience: "",
      customerPainPoints: [],
      primaryPurpose: "",
      primaryCta: "",
      secondaryCta: "",
      visualStyle: "",
      tone: "",
      inspirationUrls: [],
    },
  });

  const createProject = useMutation({
    mutationFn: async (data: FullFormValues) => {
      // Transform flat form data to project + businessProfile structure
      const projectData = {
        name: data.name,
        businessIdea: data.businessIdea,
        industry: data.industry,
        location: data.location,
        targetAudience: data.targetAudience,
        tone: data.tone,
        businessProfile: {
          businessName: data.name,
          yearsInBusiness: data.yearsInBusiness ? parseInt(data.yearsInBusiness) : undefined,
          teamSize: data.teamSize as any,
          services: data.services,
          uniqueSellingPoints: data.uniqueSellingPoints,
          customerPainPoints: data.customerPainPoints,
          targetAudience: data.targetAudience,
          preferredContactMethod: data.preferredContactMethod as any,
          contactInfo: {
            email: data.email,
            phone: data.phone,
            address: data.address,
          },
          socialLinks: {
            instagram: data.instagram,
            facebook: data.facebook,
            linkedin: data.linkedin,
            twitter: data.twitter,
            tiktok: data.tiktok,
          },
          websiteGoals: {
            primaryPurpose: data.primaryPurpose as any,
            primaryCta: data.primaryCta,
            secondaryCta: data.secondaryCta,
          },
          brandPreferences: {
            visualStyle: data.visualStyle as any,
            inspirationUrls: data.inspirationUrls,
          },
          communicationTone: data.tone as any,
        },
      };
      const response = await apiRequest("POST", "/api/projects", projectData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project created!",
        description: "Your new project is ready. Let's start building!",
      });
      selectProject(data.id);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateCurrentStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const result = await form.trigger(fields as any);
    return result;
  };

  const getFieldsForStep = (step: number): (keyof FullFormValues)[] => {
    switch (step) {
      case 1:
        return ["name", "businessIdea", "industry", "yearsInBusiness", "teamSize", "location"];
      case 2:
        return ["email", "phone", "address", "preferredContactMethod", "instagram", "facebook", "linkedin", "twitter", "tiktok"];
      case 3:
        return ["services", "uniqueSellingPoints", "targetAudience", "customerPainPoints"];
      case 4:
        return ["primaryPurpose", "primaryCta", "secondaryCta", "visualStyle", "tone", "inspirationUrls"];
      default:
        return [];
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: FullFormValues) => {
    createProject.mutate(data);
  };

  const addService = () => {
    if (newService.name.trim()) {
      const current = form.getValues("services") || [];
      form.setValue("services", [...current, { ...newService }]);
      setNewService({ name: "", description: "" });
    }
  };

  const removeService = (index: number) => {
    const current = form.getValues("services") || [];
    form.setValue("services", current.filter((_, i) => i !== index));
  };

  const addUsp = () => {
    if (newUsp.trim()) {
      const current = form.getValues("uniqueSellingPoints") || [];
      form.setValue("uniqueSellingPoints", [...current, newUsp.trim()]);
      setNewUsp("");
    }
  };

  const removeUsp = (index: number) => {
    const current = form.getValues("uniqueSellingPoints") || [];
    form.setValue("uniqueSellingPoints", current.filter((_, i) => i !== index));
  };

  const addPainPoint = () => {
    if (newPainPoint.trim()) {
      const current = form.getValues("customerPainPoints") || [];
      form.setValue("customerPainPoints", [...current, newPainPoint.trim()]);
      setNewPainPoint("");
    }
  };

  const removePainPoint = (index: number) => {
    const current = form.getValues("customerPainPoints") || [];
    form.setValue("customerPainPoints", current.filter((_, i) => i !== index));
  };

  const addInspiration = () => {
    if (newInspiration.trim()) {
      const current = form.getValues("inspirationUrls") || [];
      form.setValue("inspirationUrls", [...current, newInspiration.trim()]);
      setNewInspiration("");
    }
  };

  const removeInspiration = (index: number) => {
    const current = form.getValues("inspirationUrls") || [];
    form.setValue("inspirationUrls", current.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Create New Project</h1>
            <p className="text-muted-foreground">
              Tell us about your business to generate a personalized website
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep >= step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium hidden sm:block ${
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.name}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-2 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const StepIcon = STEPS[currentStep - 1].icon;
                return <StepIcon className="w-5 h-5" />;
              })()}
              {STEPS[currentStep - 1].name}
            </CardTitle>
            <CardDescription>
              {STEPS[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Business Basics */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business / Project Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Bella's Bakery, TechFlow Solutions"
                              {...field}
                              data-testid="input-project-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessIdea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Describe Your Business *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us what your business does, who you serve, and what makes you special. The more detail, the better!"
                              className="min-h-[120px]"
                              {...field}
                              data-testid="input-business-idea"
                            />
                          </FormControl>
                          <FormDescription>
                            This helps our AI understand your business and generate relevant content
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-industry">
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {industries.map((industry) => (
                                  <SelectItem key={industry} value={industry}>
                                    {industry}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location / Market</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., New York, NY or Global"
                                {...field}
                                data-testid="input-location"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="yearsInBusiness"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years in Business</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-years">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0">Just starting</SelectItem>
                                <SelectItem value="1">Less than 1 year</SelectItem>
                                <SelectItem value="2">1-2 years</SelectItem>
                                <SelectItem value="5">3-5 years</SelectItem>
                                <SelectItem value="10">5-10 years</SelectItem>
                                <SelectItem value="15">10+ years</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="teamSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Size</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-team-size">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="solo">Just me (Solo)</SelectItem>
                                <SelectItem value="small">2-10 people</SelectItem>
                                <SelectItem value="medium">11-50 people</SelectItem>
                                <SelectItem value="large">51-200 people</SelectItem>
                                <SelectItem value="enterprise">200+ people</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Contact & Social */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Contact Information
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="contact@yourbusiness.com"
                                  {...field}
                                  data-testid="input-email"
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
                                  data-testid="input-phone"
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
                            <FormLabel>Business Address (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Main St, City, State ZIP"
                                {...field}
                                data-testid="input-address"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferredContactMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Contact Method</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-contact-method">
                                  <SelectValue placeholder="How should customers reach you?" />
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
                              This determines the primary call-to-action on your website
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Social Media (Optional)
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="instagram"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instagram</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="@yourbusiness"
                                  {...field}
                                  data-testid="input-instagram"
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
                                  data-testid="input-facebook"
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
                                  data-testid="input-linkedin"
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
                              <FormLabel>Twitter/X</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="@yourbusiness"
                                  {...field}
                                  data-testid="input-twitter"
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
                                  data-testid="input-tiktok"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Services & Value */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* Services */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Your Services / Products
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          placeholder="Service name (e.g., Web Design)"
                          value={newService.name}
                          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                          data-testid="input-new-service-name"
                          className="flex-1"
                        />
                        <Input
                          placeholder="Brief description (optional)"
                          value={newService.description}
                          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                          data-testid="input-new-service-desc"
                          className="flex-1"
                        />
                        <Button type="button" onClick={addService} size="icon" data-testid="button-add-service">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {(form.watch("services") || []).map((service, index) => (
                          <Badge key={index} variant="secondary" className="py-1 px-3 gap-1">
                            {service.name}
                            {service.description && (
                              <span className="text-muted-foreground ml-1">- {service.description}</span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeService(index)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Unique Selling Points */}
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        What Makes You Unique?
                      </h3>
                      <FormDescription>
                        List your key differentiators (e.g., "20+ years experience", "Same-day delivery")
                      </FormDescription>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a unique selling point"
                          value={newUsp}
                          onChange={(e) => setNewUsp(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUsp())}
                          data-testid="input-new-usp"
                          className="flex-1"
                        />
                        <Button type="button" onClick={addUsp} size="icon" data-testid="button-add-usp">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {(form.watch("uniqueSellingPoints") || []).map((usp, index) => (
                          <Badge key={index} variant="outline" className="py-1 px-3 gap-1">
                            {usp}
                            <button
                              type="button"
                              onClick={() => removeUsp(index)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-4 pt-4 border-t">
                      <FormField
                        control={form.control}
                        name="targetAudience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Audience</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your ideal customer (e.g., Small business owners aged 30-50 who need help with digital marketing)"
                                className="min-h-[80px]"
                                {...field}
                                data-testid="input-target-audience"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Customer Pain Points */}
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Customer Pain Points
                      </h3>
                      <FormDescription>
                        What problems do you solve for your customers?
                      </FormDescription>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., Struggling to get online visibility"
                          value={newPainPoint}
                          onChange={(e) => setNewPainPoint(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPainPoint())}
                          data-testid="input-new-pain-point"
                          className="flex-1"
                        />
                        <Button type="button" onClick={addPainPoint} size="icon" data-testid="button-add-pain-point">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {(form.watch("customerPainPoints") || []).map((point, index) => (
                          <Badge key={index} variant="outline" className="py-1 px-3 gap-1">
                            {point}
                            <button
                              type="button"
                              onClick={() => removePainPoint(index)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Goals & Style */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="primaryPurpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Main Website Goal</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-purpose">
                                <SelectValue placeholder="What's the primary purpose?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {purposes.map((purpose) => (
                                <SelectItem key={purpose.value} value={purpose.value}>
                                  {purpose.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
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
                              The main action you want visitors to take
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
                                placeholder="e.g., Learn More, View Services"
                                {...field}
                                data-testid="input-secondary-cta"
                              />
                            </FormControl>
                            <FormDescription>
                              An alternative action for visitors
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="visualStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Visual Style</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-visual-style">
                                  <SelectValue placeholder="Choose a style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {visualStyles.map((style) => (
                                  <SelectItem key={style.value} value={style.value}>
                                    {style.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Communication Tone</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-tone">
                                  <SelectValue placeholder="Choose a tone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {tones.map((tone) => (
                                  <SelectItem key={tone.value} value={tone.value}>
                                    {tone.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Inspiration URLs */}
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Inspiration Websites (Optional)
                      </h3>
                      <FormDescription>
                        Share websites you admire - competitors or others whose design you like
                      </FormDescription>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com"
                          value={newInspiration}
                          onChange={(e) => setNewInspiration(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInspiration())}
                          data-testid="input-new-inspiration"
                          className="flex-1"
                        />
                        <Button type="button" onClick={addInspiration} size="icon" data-testid="button-add-inspiration">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {(form.watch("inspirationUrls") || []).map((url, index) => (
                          <Badge key={index} variant="outline" className="py-1 px-3 gap-1">
                            {url}
                            <button
                              type="button"
                              onClick={() => removeInspiration(index)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <div>
                    {currentStep > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        data-testid="button-back-step"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                    ) : (
                      <Link href="/dashboard">
                        <Button type="button" variant="outline" data-testid="button-cancel">
                          Cancel
                        </Button>
                      </Link>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {currentStep < 4 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => form.handleSubmit(onSubmit)()}
                        disabled={createProject.isPending}
                        data-testid="button-skip"
                      >
                        Skip & Create
                      </Button>
                    )}
                    
                    {currentStep < 4 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        data-testid="button-next-step"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={createProject.isPending}
                        data-testid="button-create"
                      >
                        {createProject.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Rocket className="w-4 h-4 mr-2" />
                            Create Project
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
