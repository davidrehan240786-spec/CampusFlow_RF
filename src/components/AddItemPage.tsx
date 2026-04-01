import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  MapPin, 
  Tag, 
  Clock, 
  MessageSquare, 
  Phone, 
  Sparkles,
  CheckCircle2,
  Info,
  ChevronDown,
  Image as ImageIcon,
  DollarSign
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/lib/toast-context";

// --- Types ---

interface ItemData {
  title: string;
  description: string;
  category: string;
  type: "Sell" | "Donate";
  price: string;
  isFree: boolean;
  images: string[];
  location: string;
  tags: string[];
  condition: "New" | "Good" | "Used";
  meetupLocation: string;
  meetupTime: string;
  allowPhone: boolean;
}

const CATEGORIES = ["Books", "Electronics", "Clothing", "Essentials"];
const LOCATIONS = ["Library", "Cafeteria", "Block A", "North Campus", "South Hall"];
const TAG_OPTIONS = ["Urgent", "Negotiable", "Like New"];
const CONDITIONS = ["New", "Good", "Used"];
const TIME_SLOTS = ["Morning (8AM - 12PM)", "Afternoon (12PM - 4PM)", "Evening (4PM - 8PM)"];

export default function AddItemPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ItemData>({
    title: "",
    description: "",
    category: "Books",
    type: "Sell",
    price: "",
    isFree: false,
    images: [],
    location: "Library",
    tags: [],
    condition: "Good",
    meetupLocation: "Library",
    meetupTime: "Afternoon (12PM - 4PM)",
    allowPhone: false,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [smartAssist, setSmartAssist] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (formData.images.length + files.length > 3) {
      toast({
        title: "Limit Exceeded",
        message: "You can only upload up to 3 images.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file as Blob));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      setIsUploading(false);
      
      // Smart Assist Trigger
      if (formData.category === "Books") setSmartAssist("Detected: Academic Textbook");
      else if (formData.category === "Electronics") setSmartAssist("Detected: Electronic Device");
      else setSmartAssist("Detected: Item for Marketplace");
    }, 1000);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    if (formData.images.length <= 1) setSmartAssist(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || (!formData.price && !formData.isFree)) {
      toast({
        title: "Missing Fields",
        message: "Please fill in the required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success!",
      message: "Your item has been posted to the marketplace.",
      variant: "success"
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-secondary hover:text-white transition-colors group"
          >
            <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-widest">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tighter uppercase">CampusFlow</span>
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">Post an Item</h1>
          <p className="text-secondary font-medium">Fill in the details to list your item in the marketplace.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-7 space-y-10">
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* 1. Basic Details */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">01</div>
                  <h3 className="text-xl font-bold tracking-tight">Basic Details</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-white/40">Item Title *</Label>
                    <Input 
                      id="title"
                      name="title"
                      placeholder="e.g. Calculus Early Transcendentals 8th Edition"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-white/20 transition-all text-lg font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-white/40">Description</Label>
                      <span className="text-[10px] font-bold text-white/20">{formData.description.length}/500</span>
                    </div>
                    <Textarea 
                      id="description"
                      name="description"
                      placeholder="Describe the condition, any missing pages, or specific details..."
                      value={formData.description}
                      onChange={handleInputChange}
                      maxLength={500}
                      className="min-h-[120px] bg-white/5 border-white/10 rounded-2xl focus:border-white/20 transition-all resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* 2. Category & Type */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">02</div>
                  <h3 className="text-xl font-bold tracking-tight">Category & Type</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Category</Label>
                    <div className="relative">
                      <select 
                        value={formData.category}
                        onChange={(e) => handleSelectChange("category", e.target.value)}
                        className="w-full h-14 pl-6 pr-12 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white appearance-none focus:outline-none focus:border-white/20 transition-all"
                      >
                        {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-white/20 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Listing Type</Label>
                    <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 h-14">
                      {["Sell", "Donate"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, type: type as any, isFree: type === "Donate" }))}
                          className={cn(
                            "flex-1 rounded-xl font-bold text-sm transition-all",
                            formData.type === type ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Pricing */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">03</div>
                  <h3 className="text-xl font-bold tracking-tight">Pricing</h3>
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-end">
                  <div className="flex-1 space-y-2 w-full">
                    <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-white/40">Price (₹)</Label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">₹</div>
                      <Input 
                        id="price"
                        name="price"
                        type="number"
                        placeholder="0.00"
                        disabled={formData.isFree}
                        value={formData.isFree ? "0" : formData.price}
                        onChange={handleInputChange}
                        className="h-14 pl-10 bg-white/5 border-white/10 rounded-2xl focus:border-white/20 transition-all text-lg font-bold"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 h-14 px-6 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group" onClick={() => setFormData(prev => ({ ...prev, isFree: !prev.isFree, type: !prev.isFree ? "Donate" : "Sell" }))}>
                    <div className={cn(
                      "size-5 rounded-md border-2 flex items-center justify-center transition-all",
                      formData.isFree ? "bg-white border-white" : "border-white/20 group-hover:border-white/40"
                    )}>
                      {formData.isFree && <CheckCircle2 className="size-3 text-black" />}
                    </div>
                    <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Mark as Free / Donation</span>
                  </div>
                </div>
              </section>

              {/* 4. Image Upload */}
              <section className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">04</div>
                    <h3 className="text-xl font-bold tracking-tight">Image Upload</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Max 3 Images</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "md:col-span-1 aspect-square rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-white/30 hover:bg-white/[0.02] transition-all group relative overflow-hidden",
                      formData.images.length >= 3 && "opacity-50 pointer-events-none"
                    )}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageUpload} 
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-white/40">Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="size-6 text-white/20 group-hover:text-white transition-colors mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-white/40 group-hover:text-white transition-colors">Add Photo</span>
                      </>
                    )}
                  </div>

                  <AnimatePresence>
                    {formData.images.map((img, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={idx} 
                        className="aspect-square rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group"
                      >
                        <img src={img} alt="Preview" className="size-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 size-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <X className="size-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {smartAssist && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <Sparkles className="size-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{smartAssist}</span>
                  </motion.div>
                )}
              </section>

              {/* 5. Location & Tags */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">05</div>
                  <h3 className="text-xl font-bold tracking-tight">Location & Tags</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Primary Location</Label>
                    <div className="relative">
                      <select 
                        value={formData.location}
                        onChange={(e) => handleSelectChange("location", e.target.value)}
                        className="w-full h-14 pl-12 pr-12 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white appearance-none focus:outline-none focus:border-white/20 transition-all"
                      >
                        {LOCATIONS.map(loc => <option key={loc} value={loc} className="bg-zinc-900">{loc}</option>)}
                      </select>
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/20 pointer-events-none" />
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-white/20 pointer-events-none" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-white flex items-center gap-2">
                        <MapPin className="size-3" /> {formData.location}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Quick Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {TAG_OPTIONS.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2",
                            formData.tags.includes(tag)
                              ? "bg-white text-black border-white"
                              : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
                          )}
                        >
                          <Tag className="size-3" /> {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. Condition */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">06</div>
                  <h3 className="text-xl font-bold tracking-tight">Item Condition</h3>
                </div>
                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 h-14">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => handleSelectChange("condition", cond)}
                      className={cn(
                        "flex-1 rounded-xl font-bold text-sm transition-all",
                        formData.condition === cond ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                      )}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </section>

              {/* 7. Meetup Preference */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">07</div>
                  <h3 className="text-xl font-bold tracking-tight">Meetup Preference</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Preferred Spot</Label>
                    <div className="relative">
                      <select 
                        value={formData.meetupLocation}
                        onChange={(e) => handleSelectChange("meetupLocation", e.target.value)}
                        className="w-full h-14 pl-12 pr-12 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white appearance-none focus:outline-none focus:border-white/20 transition-all"
                      >
                        {LOCATIONS.map(loc => <option key={loc} value={loc} className="bg-zinc-900">{loc}</option>)}
                      </select>
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/20 pointer-events-none" />
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-white/20 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Preferred Time</Label>
                    <div className="relative">
                      <select 
                        value={formData.meetupTime}
                        onChange={(e) => handleSelectChange("meetupTime", e.target.value)}
                        className="w-full h-14 pl-12 pr-12 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white appearance-none focus:outline-none focus:border-white/20 transition-all"
                      >
                        {TIME_SLOTS.map(slot => <option key={slot} value={slot} className="bg-zinc-900">{slot}</option>)}
                      </select>
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/20 pointer-events-none" />
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-white/20 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </section>

              {/* 8. Contact Preference */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">08</div>
                  <h3 className="text-xl font-bold tracking-tight">Contact Preference</h3>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <MessageSquare className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">In-App Chat</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Always Enabled</p>
                    </div>
                    <CheckCircle2 className="size-5 text-blue-400 ml-auto" />
                  </div>
                  <div 
                    className={cn(
                      "flex-1 p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group",
                      formData.allowPhone ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/10 hover:bg-white/10"
                    )}
                    onClick={() => setFormData(prev => ({ ...prev, allowPhone: !prev.allowPhone }))}
                  >
                    <div className={cn(
                      "size-10 rounded-xl flex items-center justify-center transition-all",
                      formData.allowPhone ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/20 group-hover:text-white"
                    )}>
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Phone Contact</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{formData.allowPhone ? "Enabled" : "Disabled"}</p>
                    </div>
                    <div className={cn(
                      "size-5 rounded-md border-2 flex items-center justify-center transition-all ml-auto",
                      formData.allowPhone ? "bg-emerald-500 border-emerald-500" : "border-white/20 group-hover:border-white/40"
                    )}>
                      {formData.allowPhone && <CheckCircle2 className="size-3 text-white" />}
                    </div>
                  </div>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="pt-10 flex flex-col md:flex-row gap-4">
                <Button 
                  type="submit"
                  className="flex-1 h-16 rounded-2xl bg-white text-black hover:bg-white/90 text-lg font-black uppercase tracking-tighter shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                >
                  Post Item
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => toast({ title: "Draft Saved", message: "Your listing has been saved to drafts.", variant: "default" })}
                  className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-lg font-bold"
                >
                  Save as Draft
                </Button>
              </div>

            </form>
          </div>

          {/* Live Preview Section */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Live Preview</h3>
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest animate-pulse">
                  <div className="size-1.5 rounded-full bg-emerald-400" />
                  Updating Live
                </div>
              </div>

              {/* Preview Card */}
              <motion.div 
                layout
                className="glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
              >
                <div className="relative aspect-[4/3] bg-white/5 overflow-hidden">
                  {formData.images.length > 0 ? (
                    <motion.img 
                      key={formData.images[0]}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={formData.images[0]} 
                      alt="Preview" 
                      className="size-full object-cover" 
                    />
                  ) : (
                    <div className="size-full flex flex-col items-center justify-center text-white/10">
                      <ImageIcon className="size-16 mb-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">No Image Uploaded</span>
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4">
                    <div className="size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/60">
                      <Tag className="size-5" />
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg",
                        tag === "Urgent" ? "bg-red-500" : "bg-emerald-500"
                      )}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                      {formData.category}
                    </span>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black tracking-tight leading-tight line-clamp-2">
                      {formData.title || "Your Item Title Here"}
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
                      <MapPin className="size-3" /> {formData.location}
                      <span className="size-1 rounded-full bg-white/10" />
                      {formData.condition} Condition
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Price</span>
                      <span className="text-3xl font-black text-white">
                        {formData.isFree ? "FREE" : `₹${formData.price || "0"}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
                      <div className="size-2 rounded-full bg-emerald-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Verified Seller</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <div className="flex items-center gap-3">
                        <Clock className="size-4 text-white/20" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Meetup Preference</span>
                      </div>
                      <p className="text-xs font-medium text-white/60">
                        {formData.meetupLocation} • {formData.meetupTime}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tips Card */}
              <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 flex gap-4">
                <Info className="size-6 text-blue-400 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-blue-400">Pro Tip</h4>
                  <p className="text-xs text-blue-400/60 leading-relaxed font-medium">
                    Listings with clear photos and detailed descriptions sell 3x faster. Don't forget to mention any wear and tear!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
