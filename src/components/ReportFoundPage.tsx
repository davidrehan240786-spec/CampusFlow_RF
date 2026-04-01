import * as React from "react";
import { useState, useRef } from "react";
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
  Calendar,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/lib/toast-context";

interface FoundItemData {
  title: string;
  description: string;
  category: string;
  location: string;
  dateFound: string;
  images: string[];
  tags: string[];
  collectionPoint: string;
  contactMethod: "Chat" | "Phone" | "Both";
  phoneNumber: string;
}

const CATEGORIES = ["Electronics", "Personal Items", "Documents", "Books", "Clothing", "Other"];
const LOCATIONS = ["Library", "Cafeteria", "Block A", "North Campus", "South Hall", "Gym", "Student Union"];
const TAG_OPTIONS = ["Safe with Me", "Handed to Security", "At Reception"];

export default function ReportFoundPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FoundItemData>({
    title: "",
    description: "",
    category: "Electronics",
    location: "Library",
    dateFound: new Date().toISOString().split('T')[0],
    images: [],
    tags: ["Safe with Me"],
    collectionPoint: "",
    contactMethod: "Chat",
    phoneNumber: "",
  });

  const [isUploading, setIsUploading] = useState(false);

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
    setTimeout(() => {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file as Blob));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      setIsUploading(false);
    }, 1000);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.dateFound) {
      toast({
        title: "Missing Fields",
        message: "Please fill in the required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Report Submitted",
      message: "Thank you for reporting this found item! You're a campus hero.",
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
            <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="size-4 text-emerald-500" />
            </div>
            <span className="font-black text-lg tracking-tighter uppercase">Report Found</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">Found Something?</h1>
          <p className="text-secondary font-medium">Help return a lost item to its owner by providing details below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-10">
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* 1. Item Details */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">01</div>
                  <h3 className="text-xl font-bold tracking-tight">Item Details</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-white/40">What did you find? *</Label>
                    <Input 
                      id="title"
                      name="title"
                      placeholder="e.g. Keys with a red keychain, Black Wallet"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-white/20 transition-all text-lg font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-white/40">Description (Keep it brief)</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      placeholder="Describe the item. Tip: Leave out one small detail to verify the true owner later..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-[120px] bg-white/5 border-white/10 rounded-2xl focus:border-white/20 transition-all resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* 2. Category & Time */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">02</div>
                  <h3 className="text-xl font-bold tracking-tight">Category & Time</h3>
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
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Date Found *</Label>
                    <div className="relative">
                      <Input 
                        type="date"
                        name="dateFound"
                        value={formData.dateFound}
                        onChange={handleInputChange}
                        className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl focus:border-white/20 transition-all font-bold"
                        required
                      />
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/20 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Location */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">03</div>
                  <h3 className="text-xl font-bold tracking-tight">Where was it found?</h3>
                </div>
                <div className="space-y-4">
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
                </div>
              </section>

              {/* 4. Images */}
              <section className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">04</div>
                    <h3 className="text-xl font-bold tracking-tight">Item Images</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Max 3</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "md:col-span-1 aspect-square rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-white/30 hover:bg-white/[0.02] transition-all group relative overflow-hidden",
                      formData.images.length >= 3 && "opacity-50 pointer-events-none"
                    )}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                    {isUploading ? (
                      <div className="size-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload className="size-6 text-white/20 group-hover:text-white transition-colors mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-white/40 group-hover:text-white transition-colors">Add Photo</span>
                      </>
                    )}
                  </div>
                  <AnimatePresence>
                    {formData.images.map((img, idx) => (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={idx} className="aspect-square rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group">
                        <img src={img} alt="Preview" className="size-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 size-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                          <X className="size-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>

              {/* 5. Collection Point & Status */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">05</div>
                  <h3 className="text-xl font-bold tracking-tight">Status & Collection</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Where is the item now?</Label>
                    <div className="flex flex-wrap gap-2">
                      {TAG_OPTIONS.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2",
                            formData.tags.includes(tag)
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
                          )}
                        >
                          <Tag className="size-3" /> {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Collection Point Detail</Label>
                    <Input 
                      name="collectionPoint"
                      placeholder="e.g. Library Front Desk, My Locker (B-12)"
                      value={formData.collectionPoint}
                      onChange={handleInputChange}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-white/20 transition-all font-bold"
                    />
                  </div>
                </div>
              </section>

              <div className="pt-10">
                <Button 
                  type="submit"
                  className="w-full h-16 rounded-2xl bg-white text-black hover:bg-white/90 text-lg font-black uppercase tracking-tighter shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                >
                  Submit Report
                </Button>
              </div>

            </form>
          </div>

          {/* Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Report Preview</h3>
              <Card className="glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl p-0">
                <div className="relative aspect-[4/3] bg-white/5 overflow-hidden">
                  {formData.images.length > 0 ? (
                    <img src={formData.images[0]} alt="Preview" className="size-full object-cover" />
                  ) : (
                    <div className="size-full flex flex-col items-center justify-center text-white/10">
                      <ImageIcon className="size-16 mb-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-lg bg-emerald-500 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">FOUND</span>
                    {formData.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black tracking-tight leading-tight line-clamp-2">
                      {formData.title || "Item Name"}
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
                      <MapPin className="size-3" /> {formData.location}
                      <span className="size-1 rounded-full bg-white/10" />
                      <Calendar className="size-3" /> {formData.dateFound}
                    </div>
                  </div>
                  {formData.collectionPoint && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Collection Point</span>
                      <span className="text-sm font-black text-emerald-400">{formData.collectionPoint}</span>
                    </div>
                  )}
                </div>
              </Card>
              <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 flex gap-4">
                <Info className="size-6 text-emerald-400 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-400">Security Tip</h4>
                  <p className="text-xs text-emerald-400/60 leading-relaxed font-medium">
                    When someone claims the item, ask them for a specific detail you didn't mention in the description to verify ownership.
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
