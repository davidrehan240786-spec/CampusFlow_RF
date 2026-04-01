import * as React from "react";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  Tag, 
  Sparkles,
  Info,
  ChevronDown,
  DollarSign
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/lib/toast-context";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase/firebase";

// --- Types ---

interface ItemData {
  title: string;
  description: string;
  category: string;
  type: "sell" | "donate";
  price: string; // keep as string for input; convert to number on submit
  location: string;
  tags: string[];
}

const CATEGORIES = ["Books", "Electronics", "Clothing", "Essentials"];
const LOCATIONS = ["Library", "Cafeteria", "Block A", "North Campus", "South Hall"];
const TAG_OPTIONS = ["Urgent", "Negotiable", "Like New"];

export default function AddItemPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<ItemData>({
    title: "",
    description: "",
    category: "Books",
    type: "sell",
    price: "",
    location: "Library",
    tags: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smartAssist, setSmartAssist] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  useEffect(() => {
    if (!formData.title.trim()) {
      setSmartAssist(null);
      return;
    }
    if (formData.category === "Books") setSmartAssist("Detected: Academic Textbook");
    else if (formData.category === "Electronics") setSmartAssist("Detected: Electronic Device");
    else setSmartAssist("Detected: Item for Marketplace");
  }, [formData.title, formData.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();
    const trimmedLocation = formData.location.trim();
    const trimmedPrice = formData.price.trim();

    if (!trimmedTitle) {
      toast({
        title: "Missing Fields",
        message: "Please enter a title.",
        variant: "destructive"
      });
      return;
    }

    const priceNumber =
      formData.type === "donate" ? 0 : trimmedPrice === "" ? NaN : Number(trimmedPrice);
    if (formData.type !== "donate" && (!Number.isFinite(priceNumber) || priceNumber < 0)) {
      toast({
        title: "Invalid Price",
        message: "Please enter a valid price (or choose Donate).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: trimmedTitle,
        description: trimmedDescription,
        price: priceNumber,
        category: formData.category,
        type: formData.type,
        location: trimmedLocation,
        tags: formData.tags,
        userId: "mock-user-123",
        status: "available",
        createdAt: serverTimestamp(),
      };

      console.log("[AddItemPage] addDoc() starting", payload);
      const docRef = await addDoc(collection(db, "items"), payload);
      console.log("[AddItemPage] addDoc() success id=", docRef.id);

      toast({
        title: "Success!",
        message: "Your ad has been posted to the marketplace.",
        variant: "success"
      });
      setSuccessMessage("Posted successfully.");

      setFormData({
        title: "",
        description: "",
        category: "Books",
        type: "sell",
        price: "",
        location: "Library",
        tags: [],
      });
      setSmartAssist(null);
    } catch (error) {
      console.error("[AddItemPage] addDoc() failed:", error);
      toast({
        title: "Error",
        message: "Failed to post item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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

        {successMessage ? (
          <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-4 text-sm font-bold text-emerald-300">
            {successMessage}
          </div>
        ) : null}

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
                      {["sell", "donate"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              type: type as "sell" | "donate",
                              price: type === "donate" ? "0" : prev.price,
                            }))
                          }
                          className={cn(
                            "flex-1 rounded-xl font-bold text-sm transition-all",
                            formData.type === type ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                          )}
                        >
                          {type === "sell" ? "Sell" : "Donate"}
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
                        disabled={formData.type === "donate"}
                        value={formData.type === "donate" ? "0" : formData.price}
                        onChange={handleInputChange}
                        className="h-14 pl-10 bg-white/5 border-white/10 rounded-2xl focus:border-white/20 transition-all text-lg font-bold"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 h-14 px-6 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-sm font-bold text-white/60">
                      {formData.type === "donate" ? "Donation" : "For sale"}
                    </span>
                  </div>
                </div>
              </section>

              {/* 4. Location & Tags */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">04</div>
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

              {/* Action Buttons */}
              <div className="pt-10 flex flex-col md:flex-row gap-4">
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-16 rounded-2xl bg-white text-black hover:bg-white/90 text-lg font-black uppercase tracking-tighter shadow-[0_20px_40px_rgba(255,255,255,0.1)] disabled:opacity-50"
                >
                  {isSubmitting ? "Posting..." : "Post Item"}
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
                <div className="relative aspect-[4/3] bg-white/5 overflow-hidden flex items-center justify-center">
                  <div className="size-24 rounded-3xl bg-white/10 border border-white/10 flex items-center justify-center text-white font-black text-4xl">
                    {(formData.title.trim()[0] || formData.category[0] || "I").toUpperCase()}
                  </div>
                  
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
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Price</span>
                      <span className="text-3xl font-black text-white">
                        {formData.type === "donate" ? "FREE" : `₹${formData.price || "0"}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
                      <div className="size-2 rounded-full bg-emerald-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Verified Seller</span>
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
                    Clear titles and detailed descriptions help your listing get picked up faster.
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
