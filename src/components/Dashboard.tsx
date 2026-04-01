import * as React from "react";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  QrCode, 
  Bot, 
  Activity, 
  MessageSquare, 
  Settings,
  Bell,
  Search,
  Plus,
  Share2,
  ChevronRight,
  Send,
  Phone,
  Shield,
  Clock,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  ArrowLeft,
  ShoppingBag,
  CheckCircle,
  MapPin,
  Filter,
  ArrowUpDown,
  Flame,
  Tag,
  PlusCircle,
  TrendingUp,
  Star
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUploadCard, UploadingFile } from "@/components/ui/file-upload-card";
import { SearchBar } from "@/components/ui/search-bar";
import { useToast } from "@/lib/toast-context";

import { TextRoll } from "@/components/ui/animated-menu";

// --- Types ---

type Section = 
  | "Dashboard" 
  | "Marketplace"
  | "Lost & Found" 
  | "Trust System" 
  | "Insights"
  | "Meetups" 
  | "Chat" 
  | "Settings";

interface NavItem {
  label: Section;
  icon: React.ElementType;
  key: string;
}

// --- Mock Data ---

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, key: 'nav_dashboard' },
  { label: "Marketplace", icon: ShoppingBag, key: 'nav_marketplace' },
  { label: "Lost & Found", icon: Search, key: 'nav_lost_found' },
  { label: "Trust System", icon: Shield, key: 'nav_trust' },
  { label: "Insights", icon: Activity, key: 'nav_insights' },
  { label: "Meetups", icon: Clock, key: 'nav_meetups' },
  { label: "Chat", icon: MessageSquare, key: 'nav_chat' },
  { label: "Settings", icon: Settings, key: 'nav_settings' },
];

const INSIGHTS_DATA = [
  { time: "Mon", views: 120, interest: 45, success: 80 },
  { time: "Tue", views: 250, interest: 80, success: 85 },
  { time: "Wed", views: 480, interest: 120, success: 90 },
  { time: "Thu", views: 850, interest: 210, success: 95 },
  { time: "Fri", views: 720, interest: 180, success: 92 },
  { time: "Sat", views: 600, interest: 150, success: 88 },
];

const RECENT_ACTIVITY = [
  { id: 1, actionKey: "dash_listed_item", userKey: "dash_you", timeKey: "dash_hours_ago", timeVal: 2, icon: ShoppingBag, color: "text-blue-500" },
  { id: 2, actionKey: "dash_reported_lost", userKey: "dash_you", timeKey: "dash_hours_ago", timeVal: 5, icon: Search, color: "text-orange-500" },
  { id: 3, actionKey: "dash_completed_meetup", userKey: "dash_you", timeKey: "dash_day_ago", timeVal: 1, icon: CheckCircle, color: "text-emerald-500" },
];

// --- Components ---

const Card = ({ children, className, glow = false, ...props }: { children: React.ReactNode, className?: string, glow?: boolean } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(
    "glass relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/10",
    glow && "shadow-[0_0_30px_rgba(99,102,241,0.1)]",
    className
  )} {...props}>
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle, action, className }: { title: string, subtitle?: string, action?: React.ReactNode, className?: string }) => (
  <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">{title}</h2>
      {subtitle && <p className="text-secondary mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// --- Section Views ---

const DashboardView = ({ setActiveSection }: { setActiveSection: (section: Section) => void }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <ShoppingBag className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Total Listings</p>
            <p className="text-2xl font-bold text-white tracking-tight">12 Active</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <MessageSquare className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Active Chats</p>
            <p className="text-2xl font-bold text-white tracking-tight">5 New</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Shield className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Trust Score</p>
            <p className="text-2xl font-bold text-white tracking-tight">98%</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
            <Search className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Lost & Found</p>
            <p className="text-2xl font-bold text-white tracking-tight">3 Matches</p>
          </div>
        </Card>
      </div>

    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white/80 flex items-center gap-2 tracking-tight">
          <Bell className="size-5 text-white/40" />
          Recent Matches
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-emerald-500/20 bg-emerald-500/5 group hover:border-emerald-500/40">
            <div className="flex items-start justify-between mb-4">
              <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Search className="size-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60">95% Match Found</span>
            </div>
            <h4 className="font-bold text-white mb-3 tracking-tight">Blue Hydroflask</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-sm font-medium text-white">Location</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest bg-blue-500/20 text-blue-400">
                  Library
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-sm font-medium text-white">Found by</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest bg-emerald-500/20 text-emerald-400">
                  Verified Student
                </span>
              </div>
            </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 p-0 h-auto font-bold text-xs uppercase tracking-widest"
                onClick={() => setActiveSection("Lost & Found")}
              >
                View Details <ChevronRight className="size-3 ml-1" />
              </Button>
          </Card>
          <Card className="border-white/10 glass group hover:border-white/20">
            <div className="flex items-start justify-between mb-4">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <ShoppingBag className="size-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Trending Item</span>
            </div>
            <h4 className="font-bold text-white mb-1 tracking-tight">Calculus Textbook</h4>
            <p className="text-sm text-secondary">3 students are currently interested in this item.</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-4 text-white hover:text-white/80 hover:bg-white/5 p-0 h-auto font-bold text-xs uppercase tracking-widest"
              onClick={() => setActiveSection("Marketplace")}
            >
              View Listing <ChevronRight className="size-3 ml-1" />
            </Button>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white/80 tracking-tight">Recent Activity</h3>
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-white/5">
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn("size-10 rounded-xl bg-white/5 flex items-center justify-center", item.color)}>
                    <item.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white tracking-tight">
                      {item.actionKey === "dash_listed_item" ? "Listed new item" : item.actionKey === "dash_reported_lost" ? "Reported lost item" : "Completed meetup"}
                    </p>
                    <p className="text-xs text-secondary">for You</p>
                  </div>
                </div>
                <span className="text-xs text-white/20 font-medium">{item.timeVal} {item.timeKey === "dash_hours_ago" ? "hours ago" : "day ago"}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  </div>
  );
};

const MarketplaceView = ({ setActiveSection }: { setActiveSection: (section: Section) => void }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Added");
  const [priceRange, setPriceRange] = useState(100);
  const [activeLocation, setActiveLocation] = useState("All");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const categories = ["All", "Books", "Electronics", "Dorm", "Clothing"];
  const locations = ["All", "Library", "North Campus", "South Hall", "Student Union"];
  const tags = ["Urgent", "Verified Seller"];

  const items = [
    { 
      id: 1,
      name: "Calculus Early Transcendentals", 
      category: "Books", 
      price: 45, 
      location: "North Campus", 
      image: "https://picsum.photos/seed/book1/400/300",
      tags: ["Verified Seller"],
      trending: true,
      date: new Date(2024, 2, 12)
    },
    { 
      id: 2,
      name: "Sony WH-1000XM4 Headphones", 
      category: "Electronics", 
      price: 120, 
      location: "Library", 
      image: "https://picsum.photos/seed/sony/400/300",
      tags: ["Urgent"],
      trending: true,
      date: new Date(2024, 2, 28)
    },
    { 
      id: 3,
      name: "Modern Dorm Desk Lamp", 
      category: "Dorm", 
      price: 15, 
      location: "South Hall", 
      image: "https://picsum.photos/seed/lamp/400/300",
      tags: [],
      trending: false,
      date: new Date(2024, 0, 15)
    },
    { 
      id: 4,
      name: "North Face Winter Jacket", 
      category: "Clothing", 
      price: 60, 
      location: "Student Union", 
      image: "https://picsum.photos/seed/jacket/400/300",
      tags: ["Verified Seller"],
      trending: false,
      date: new Date(2023, 11, 5)
    },
    { 
      id: 5,
      name: "TI-84 Plus CE Calculator", 
      category: "Electronics", 
      price: 30, 
      location: "Science Block", 
      image: "https://picsum.photos/seed/calc/400/300",
      tags: ["Urgent"],
      trending: true,
      date: new Date(2023, 10, 20)
    },
    { 
      id: 6,
      name: "Organic Chemistry Model Kit", 
      category: "Books", 
      price: 25, 
      location: "Library", 
      image: "https://picsum.photos/seed/chem/400/300",
      tags: [],
      trending: false,
      date: new Date(2024, 3, 1)
    },
  ];

  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesLocation = activeLocation === "All" || item.location === activeLocation;
    const matchesPrice = item.price <= priceRange;
    const matchesTags = activeTags.length === 0 || activeTags.every(tag => item.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice && matchesTags;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "Price: Low → High") return a.price - b.price;
    if (sortBy === "Price: High → Low") return b.price - a.price;
    if (sortBy === "Trending") return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
    return b.date.getTime() - a.date.getTime();
  });

  const trendingItems = items.filter(item => item.trending);
  const recentlyAdded = items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SectionHeader 
            title="Campus Marketplace" 
            subtitle="Buy and sell items within your verified student network." 
            className="mb-0"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setActiveSection("Insights")}
            className="rounded-xl px-6 font-bold border-white/5 bg-white/5 hover:bg-white/10 gap-2 h-12"
          >
            <Activity className="size-4" /> Insights
          </Button>
          <Button 
            className="rounded-xl px-6 font-bold bg-white text-black hover:bg-white/90 gap-2 h-12"
            onClick={() => navigate("/add-item")}
          >
            <PlusCircle className="size-4" /> Post Item
          </Button>
        </div>
      </div>

      {/* Search and Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/30" />
          <Input 
            placeholder="Search items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl focus:border-white/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/30" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white appearance-none focus:outline-none focus:border-white/20"
            >
              <option className="bg-zinc-900">Recently Added</option>
              <option className="bg-zinc-900">Price: Low → High</option>
              <option className="bg-zinc-900">Price: High → Low</option>
              <option className="bg-zinc-900">Trending</option>
            </select>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className={cn(
              "h-14 w-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10",
              isFilterVisible && "bg-white/20 border-white/30"
            )}
          >
            <Filter className="size-5" />
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <AnimatePresence>
        {isFilterVisible && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-white/[0.02] border-white/5 p-6 rounded-3xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Categories */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                          activeCategory === cat 
                            ? "bg-white text-black border-white" 
                            : "bg-white/5 text-white/60 border-white/5 hover:border-white/20"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Price Range</Label>
                    <span className="text-xs font-bold text-white">Under ${priceRange}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="500" 
                    step="10"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>

                {/* Location & Tags */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Location</Label>
                  <select 
                    value={activeLocation}
                    onChange={(e) => setActiveLocation(e.target.value)}
                    className="w-full h-10 px-4 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white focus:outline-none"
                  >
                    {locations.map(loc => (
                      <option key={loc} className="bg-zinc-900">{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-wrap gap-4 items-center">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tags:</Label>
                <div className="flex gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2",
                        activeTags.includes(tag)
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-white/5 text-white/60 border-white/5 hover:border-white/20"
                      )}
                    >
                      <Tag className="size-3" /> {tag}
                    </button>
                  ))}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setActiveCategory("All");
                    setActiveLocation("All");
                    setPriceRange(500);
                    setActiveTags([]);
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white"
                >
                  Reset Filters
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Chips */}
      {(activeCategory !== "All" || activeLocation !== "All" || priceRange < 500 || activeTags.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {activeCategory !== "All" && (
            <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-white flex items-center gap-2">
              {activeCategory} <X className="size-3 cursor-pointer" onClick={() => setActiveCategory("All")} />
            </div>
          )}
          {activeLocation !== "All" && (
            <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-white flex items-center gap-2">
              {activeLocation} <X className="size-3 cursor-pointer" onClick={() => setActiveLocation("All")} />
            </div>
          )}
          {priceRange < 500 && (
            <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-white flex items-center gap-2">
              Under ${priceRange} <X className="size-3 cursor-pointer" onClick={() => setPriceRange(500)} />
            </div>
          )}
          {activeTags.map(tag => (
            <div key={tag} className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 flex items-center gap-2">
              {tag} <X className="size-3 cursor-pointer" onClick={() => toggleTag(tag)} />
            </div>
          ))}
        </div>
      )}

      {/* Trending Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="size-5 text-orange-500" /> Trending Items
          </h3>
          <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white">View All</Button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
          {trendingItems.map((item) => (
            <div key={item.id} className="min-w-[280px] group">
              <Card className="p-0 overflow-hidden border-white/5 hover:border-white/20 transition-all duration-500">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button className="size-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-red-500 transition-colors">
                      <Heart className="size-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 rounded-lg bg-orange-500 text-[10px] font-black uppercase text-white shadow-lg">Trending</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white text-sm leading-tight group-hover:text-primary transition-colors">{item.name}</h4>
                    <span className="font-black text-white text-lg">${item.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="size-3" /> {item.location}</span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Added Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="size-5 text-blue-500" /> Recently Added
          </h3>
          <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white">View All</Button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
          {recentlyAdded.map((item) => (
            <div key={item.id} className="min-w-[280px] group">
              <Card className="p-0 overflow-hidden border-white/5 hover:border-white/20 transition-all duration-500">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 right-3">
                    <button className="size-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-red-500 transition-colors">
                      <Heart className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">{item.name}</h4>
                    <span className="font-black text-white text-lg">${item.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="size-3" /> {item.location}</span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="size-5 text-white/40" /> All Listings
          </h3>
          <p className="text-xs font-medium text-white/40">{sortedItems.length} items found</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Post Item Card */}
          <button 
            onClick={() => navigate("/add-item")}
            className="group relative h-full min-h-[320px] rounded-[2rem] border-2 border-dashed border-white/10 hover:border-white/30 hover:bg-white/[0.02] transition-all duration-500 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="size-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <Plus className="size-8 text-white/40 group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-bold text-white mb-2">Post an Item</h4>
            <p className="text-xs text-white/40 font-medium">Clear out your dorm and earn some extra cash.</p>
          </button>

          {sortedItems.length > 0 ? (
            sortedItems.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={item.id} 
                className="group relative"
              >
                <Card className="p-0 overflow-hidden border-white/5 hover:border-white/20 transition-all duration-500 h-full flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button className="bg-white text-black hover:bg-white/90 font-bold rounded-xl px-6">
                        View Details
                      </Button>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button className="size-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-red-500 transition-colors">
                        <Heart className="size-4" />
                      </button>
                    </div>

                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {item.tags.map(tag => (
                        <span key={tag} className={cn(
                          "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest text-white shadow-lg",
                          tag === "Urgent" ? "bg-red-500" : "bg-emerald-500"
                        )}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-white text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">{item.name}</h4>
                    </div>
                    
                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white text-xl">${item.price}</span>
                        <div className="flex items-center gap-1 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                          <MapPin className="size-3" /> {item.location}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{item.category}</span>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="size-8 text-white/20 hover:text-white rounded-lg">
                            <MessageSquare className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="size-20 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                <ShoppingBag className="size-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">No items found</h4>
                <p className="text-sm text-white/40 max-w-xs mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setActiveCategory("All");
                  setActiveLocation("All");
                  setPriceRange(500);
                  setActiveTags([]);
                  setSearchQuery("");
                }}
                className="rounded-xl border-white/10 hover:bg-white/5"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/add-item")}
        className="fixed bottom-8 right-8 size-16 rounded-full bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.2)] flex items-center justify-center z-50 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white via-white to-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Plus className="size-8 relative z-10" />
      </motion.button>
    </div>
  );
};

const LostFoundView = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"All" | "Lost" | "Found">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const items = [
    { 
      id: 1,
      name: "Blue Hydroflask", 
      description: "32oz wide mouth with a small dent on the bottom. Has a 'NASA' sticker.",
      type: "Lost",
      status: "Match Found", 
      location: "Library", 
      category: "Essentials",
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10", 
      border: "border-emerald-500/20", 
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.1)]",
      match: "95%",
      date: "2 hours ago"
    },
    { 
      id: 2,
      name: "Sony WH-1000XM4", 
      description: "Black noise-cancelling headphones left in a silver case.",
      type: "Lost",
      status: "Searching", 
      location: "Cafeteria", 
      category: "Electronics",
      color: "text-blue-400", 
      bg: "bg-blue-500/10", 
      border: "border-blue-500/20", 
      match: "88%",
      date: "5 hours ago"
    },
    { 
      id: 3,
      name: "Calculus Early Transcendentals", 
      description: "9th Edition by James Stewart. Name 'Alex' written on the first page.",
      type: "Found",
      status: "Reported Found", 
      location: "Student Union", 
      category: "Books",
      color: "text-orange-400", 
      bg: "bg-orange-500/10", 
      border: "border-orange-500/20", 
      match: null,
      date: "1 day ago"
    },
    { 
      id: 4,
      name: "Car Keys with Keychain", 
      description: "Toyota key with a red leather keychain and a small flashlight.",
      type: "Found",
      status: "Reported Found", 
      location: "Gym", 
      category: "Essentials",
      color: "text-orange-400", 
      bg: "bg-orange-500/10", 
      border: "border-orange-500/20", 
      match: null,
      date: "3 hours ago"
    }
  ];

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === "All" || item.type === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "All" || item.location === locationFilter;
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    
    return matchesTab && matchesSearch && matchesLocation && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeader 
          title="Lost & Found" 
          subtitle="Smart recovery system for campus belongings."
          className="mb-0"
        />
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => toast({ title: "Report Lost", message: "Opening lost item report form...", variant: "default" })}
            className="bg-white text-black hover:bg-white/90 rounded-xl px-6 gap-2 font-bold h-12"
          >
            <Search className="size-4" /> Report Lost
          </Button>
          <Button 
            onClick={() => toast({ title: "Report Found", message: "Opening found item report form...", variant: "default" })}
            variant="outline"
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl px-6 gap-2 font-bold h-12"
          >
            <CheckCircle className="size-4" /> Report Found
          </Button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-full lg:w-auto">
          {(["All", "Lost", "Found"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 lg:flex-none px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                activeTab === tab 
                  ? "bg-white text-black shadow-lg" 
                  : "text-white/40 hover:text-white/60"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/30" />
          <Input 
            placeholder="Search items, descriptions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-12 bg-white/5 border-white/10 rounded-2xl focus:border-white/20 transition-all"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
          <MapPin className="size-4 text-white/40" />
          <select 
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-transparent text-sm font-bold text-white focus:outline-none appearance-none cursor-pointer"
          >
            <option className="bg-zinc-900" value="All">All Locations</option>
            <option className="bg-zinc-900">Library</option>
            <option className="bg-zinc-900">Cafeteria</option>
            <option className="bg-zinc-900">Gym</option>
            <option className="bg-zinc-900">Student Union</option>
          </select>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
          <Tag className="size-4 text-white/40" />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent text-sm font-bold text-white focus:outline-none appearance-none cursor-pointer"
          >
            <option className="bg-zinc-900" value="All">All Categories</option>
            <option className="bg-zinc-900">Books</option>
            <option className="bg-zinc-900">Electronics</option>
            <option className="bg-zinc-900">Essentials</option>
            <option className="bg-zinc-900">Clothing</option>
          </select>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
          <Activity className="size-4 text-white/40" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-sm font-bold text-white focus:outline-none appearance-none cursor-pointer"
          >
            <option className="bg-zinc-900" value="All">All Status</option>
            <option className="bg-zinc-900">Searching</option>
            <option className="bg-zinc-900">Reported Found</option>
            <option className="bg-zinc-900">Match Found</option>
          </select>
        </div>

        {(locationFilter !== "All" || categoryFilter !== "All" || statusFilter !== "All" || searchQuery) && (
          <Button 
            variant="ghost" 
            onClick={() => {
              setLocationFilter("All");
              setCategoryFilter("All");
              setStatusFilter("All");
              setSearchQuery("");
            }}
            className="text-white/40 hover:text-white text-xs font-bold"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={cn(
                "group border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden relative",
                item.status === "Match Found" && cn("border-emerald-500/30", item.glow)
              )}>
                <div className="flex flex-col lg:flex-row gap-6 p-2">
                  {/* Icon/Image Placeholder */}
                  <div className={cn(
                    "size-24 lg:size-32 rounded-3xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-105",
                    item.bg, item.color
                  )}>
                    <Search className="size-10 lg:size-12 opacity-50" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-xl font-bold text-white tracking-tight">{item.name}</h4>
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            item.type === "Lost" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          )}>
                            {item.type}
                          </span>
                        </div>
                        <p className="text-sm text-secondary line-clamp-2 max-w-2xl">{item.description}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                          item.color, item.bg, item.border
                        )}>
                          {item.status}
                        </span>
                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{item.date}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-white/60">
                        <MapPin className="size-3.5" />
                        {item.location}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-white/60">
                        <Tag className="size-3.5" />
                        {item.category}
                      </div>
                      {item.match && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                          <TrendingUp className="size-3.5" />
                          {item.match} Match Confidence
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex lg:flex-col justify-end gap-2 lg:border-l lg:border-white/5 lg:pl-6">
                    <Button variant="outline" className="flex-1 lg:flex-none h-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold">
                      View Details
                    </Button>
                    {item.status === "Match Found" && (
                      <Button className="flex-1 lg:flex-none h-10 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold">
                        Claim Item
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Search className="size-10 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white">No items found</h3>
            <p className="text-secondary max-w-xs mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTab("All");
                setLocationFilter("All");
                setCategoryFilter("All");
                setStatusFilter("All");
                setSearchQuery("");
              }}
              className="rounded-xl border-white/10 hover:bg-white/5"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => toast({ title: "Add Report", message: "Opening report creation modal...", variant: "default" })}
        className="fixed bottom-8 right-8 size-16 rounded-full bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.2)] flex items-center justify-center z-50 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white via-white to-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Plus className="size-8 relative z-10" />
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </motion.button>
    </div>
  );
};

const TrustSystemView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <SectionHeader title="Student Trust System" subtitle="Verified student network for safe campus transactions." />
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div className="flex flex-col items-center justify-center p-8 glass rounded-[3rem] border border-white/10">
        <div className="p-4 bg-white rounded-3xl mb-6">
          <QrCode className="size-64 text-black" />
        </div>
        <p className="text-white font-bold text-xl mb-2">Your Trust ID</p>
        <p className="text-secondary text-sm font-medium">Verified Student • Score: 98%</p>
      </div>

      <div className="space-y-6">
        <Card className="glass border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Verification Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Public Trust Score</p>
                <p className="text-sm text-secondary">Show your score on listings</p>
              </div>
              <Checkbox id="public-score" defaultChecked className="size-6 rounded-lg border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Trust Level</Label>
              <div className="grid grid-cols-3 gap-2">
                {["Bronze", "Silver", "Gold"].map((level) => (
                  <Button key={level} variant="outline" className={cn(
                    "rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold",
                    level === "Gold" && "border-white/40 bg-white/10 text-white"
                  )}>
                    {level}
                  </Button>
                ))}
              </div>
            </div>
            <div className="pt-4 flex gap-3">
              <Button className="flex-1 h-12 rounded-xl bg-white text-black hover:bg-white/90 font-bold gap-2">
                <Share2 className="size-4" /> Share Profile
              </Button>
              <Button variant="outline" className="flex-1 h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold">
                View Badges
              </Button>
            </div>
          </div>
        </Card>
        
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
          <Shield className="size-5 text-emerald-400" />
          <p className="text-xs text-white/40 font-medium">Your identity is verified via student email and campus ID.</p>
        </div>
      </div>
    </div>
  </div>
);

const InsightsView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <SectionHeader title="Marketplace Insights" subtitle="Track your listing performance and campus trends." />
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center justify-between mb-4">
          <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShoppingBag className="size-6" />
          </div>
          <span className="text-xs font-bold text-emerald-400">+12%</span>
        </div>
        <p className="text-3xl font-bold text-white">850 <span className="text-sm font-medium text-white/40">Views</span></p>
        <p className="text-xs text-white/40 mt-1">Total Listing Views</p>
      </Card>
      <Card className="border-white/10 bg-white/5 glass">
        <div className="flex items-center justify-between mb-4">
          <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
            <MessageSquare className="size-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">+5%</span>
        </div>
        <p className="text-3xl font-bold text-white">210 <span className="text-sm font-medium text-secondary">Inquiries</span></p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">Interested Users</p>
      </Card>
      <Card className="border-blue-500/20 bg-blue-500/5">
        <div className="flex items-center justify-between mb-4">
          <div className="size-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Search className="size-6" />
          </div>
          <span className="text-xs font-bold text-blue-400">95%</span>
        </div>
        <p className="text-3xl font-bold text-white">95 <span className="text-sm font-medium text-white/40">%</span></p>
        <p className="text-xs text-white/40 mt-1">Recovery Success Rate</p>
      </Card>
    </div>

      <Card className="h-[400px] p-6 glass border-white/10">
      <h3 className="text-lg font-bold text-white mb-6">Listing Views History</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={INSIGHTS_DATA}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis dataKey="time" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area type="monotone" dataKey="views" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  </div>
);

const MeetupView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <SectionHeader title="Campus Meetups" subtitle="Schedule and manage safe meetups for item exchanges." />
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col items-center justify-center space-y-8 py-12">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="size-64 rounded-full bg-blue-600 shadow-[0_0_80px_rgba(37,99,235,0.4)] flex items-center justify-center text-white relative group"
        >
          <div className="absolute inset-0 rounded-full border-8 border-white/20 animate-ping duration-[2000ms]" />
          <div className="flex flex-col items-center">
            <Clock className="size-20 mb-2" />
            <span className="text-2xl font-black uppercase tracking-tighter">Meetup</span>
          </div>
        </motion.button>
        <p className="text-white/60 font-medium text-center max-w-xs">Schedule a secure meetup at a verified campus location.</p>
      </div>

      <div className="space-y-6">
        <Card className="glass border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <MapPin className="size-8 text-white" />
            <h4 className="font-bold text-lg text-white">Verified Meetup Spots</h4>
          </div>
          <p className="text-sm font-medium text-secondary mb-6">Choose from safe, high-traffic campus locations for your exchange.</p>
          <Button className="w-full bg-white text-black hover:bg-white/90 font-bold rounded-xl h-12">Browse Safe Zones</Button>
        </Card>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest">Upcoming Meetups</h4>
          {[
            { item: "Calculus Textbook", time: "Today, 2:00 PM", location: "Library Cafe" },
            { item: "Sony Headphones", time: "Tomorrow, 11:00 AM", location: "Student Union" },
          ].map((meetup, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{meetup.item}</p>
                <p className="text-xs text-white/40">{meetup.time} • {meetup.location}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-white/40 hover:text-white">
                <ChevronRight className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ChatView = () => (
  <div className="h-[calc(100vh-12rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
    <SectionHeader title="Campus Chat" subtitle="Direct communication with buyers, sellers, and finders." />
    
    <div className="flex-1 flex gap-6 overflow-hidden">
      <Card className="w-80 hidden lg:flex flex-col p-0 border-white/5">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
            <Input className="bg-white/5 border-white/5 pl-10 rounded-xl h-10 text-sm" placeholder="Search chats..." />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {[
            { name: "Alex Rivera", last: "Is the textbook still available?", time: "10:24 AM", active: true },
            { name: "CampusFlow Support", last: "Your item has been listed...", time: "Yesterday", active: false },
            { name: "Jordan Smith", last: "I found your keys!", time: "Mon", active: false },
          ].map((chat, i) => (
            <div key={i} className={cn(
              "p-4 flex items-center gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors",
              chat.active && "bg-white/5 border-r-2 border-white"
            )}>
              <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <User className="size-6 text-white/40" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-sm font-bold text-white truncate">{chat.name}</h4>
                  <span className="text-[10px] text-white/20">{chat.time}</span>
                </div>
                <p className="text-xs text-white/40 truncate">{chat.last}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden border-white/5">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <User className="size-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Alex Rivera</h4>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="text-white/20 hover:text-white"><Phone className="size-4" /></Button>
            <Button size="icon" variant="ghost" className="text-white/20 hover:text-white"><Settings className="size-4" /></Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          <div className="flex gap-4">
            <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <User className="size-5 text-white/40" />
            </div>
            <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[70%] border border-white/5">
              <p className="text-sm text-white/80 leading-relaxed">Hi! I saw your listing for the Calculus textbook. Is it still available?</p>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <div className="bg-white text-black rounded-2xl rounded-tr-none p-4 max-w-[70%]">
              <p className="text-sm font-medium leading-relaxed">Yes, it is! I can meet at the Library Cafe today if you're interested.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <User className="size-5 text-white/40" />
            </div>
            <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[70%] border border-white/5">
              <p className="text-sm text-white/80 leading-relaxed">That works for me! Does 2:00 PM sound good?</p>
            </div>
          </div>
        </div>

          <div className="p-6 border-t border-white/5 bg-white/[0.02]">
          <div className="relative">
            <Input className="h-14 bg-black/40 border-white/10 rounded-2xl pl-6 pr-14 text-white" placeholder="Type a message..." />
            <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-white text-black hover:bg-white/90">
              <Send className="size-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const SettingsView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <SectionHeader title="Settings" subtitle="Manage your account preferences and security" />
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-6">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Full Name</Label>
              <Input className="bg-white/5 border-white/5 rounded-xl h-12" defaultValue="Sarah Johnson" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Email Address</Label>
              <Input className="bg-white/5 border-white/5 rounded-xl h-12" defaultValue="sarah.j@example.com" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Phone Number</Label>
              <Input className="bg-white/5 border-white/5 rounded-xl h-12" defaultValue="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Location</Label>
              <Input className="bg-white/5 border-white/5 rounded-xl h-12" defaultValue="San Francisco, CA" />
            </div>
          </div>
          <Button className="mt-8 bg-white text-black hover:bg-white/90 rounded-xl px-8 font-bold">Save Changes</Button>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-white mb-6">Security</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Two-Factor Authentication</p>
                <p className="text-sm text-secondary">Add an extra layer of security to your account</p>
              </div>
              <Checkbox className="size-6 rounded-lg border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
            </div>
            <div className="pt-4">
              <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 rounded-xl">Change Password</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-6">Notifications</h3>
          <div className="space-y-4">
            {[
              { label: "Marketplace Alerts", desc: "New matches for your lost items" },
              { label: "Chat Messages", desc: "Direct messages from buyers and sellers" },
              { label: "Trust Updates", desc: "When your trust score changes" },
              { label: "Campus Insights", desc: "Weekly marketplace trend reports" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-[10px] text-white/40">{item.desc}</p>
                </div>
                <Checkbox defaultChecked className="size-5 rounded-md border-white/10 data-[state=checked]:bg-white data-[state=checked]:text-black" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-red-500/5 border-red-500/20">
          <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
          <p className="text-sm text-white/40 mb-6">Irreversibly delete your account and all campus data.</p>
          <Button variant="outline" className="w-full border-red-500/20 hover:bg-red-500/10 text-red-400 font-bold rounded-xl">Delete Account</Button>
        </Card>
      </div>
    </div>
  </div>
);

// --- Main Dashboard Component ---

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "Dashboard": return <DashboardView setActiveSection={setActiveSection} />;
      case "Marketplace": return <MarketplaceView setActiveSection={setActiveSection} />;
      case "Lost & Found": return <LostFoundView />;
      case "Trust System": return <TrustSystemView />;
      case "Insights": return <InsightsView />;
      case "Meetups": return <MeetupView />;
      case "Chat": return <ChatView />;
      case "Settings": return <SettingsView />;
      default: return <DashboardView setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-white/5 bg-black/40 backdrop-blur-2xl p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <ShoppingBag className="size-6 text-black" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">CampusFlow</span>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveSection(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
                activeSection === item.label 
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                  : "text-secondary hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "size-5 transition-transform group-hover:scale-110",
                activeSection === item.label ? "text-black" : "text-secondary"
              )} />
              <TextRoll className="font-bold text-sm tracking-wide">{item.label}</TextRoll>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
          <Link 
            to="/" 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-secondary hover:text-white hover:bg-white/5 transition-all group"
          >
            <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
            <TextRoll className="font-bold text-sm tracking-wide">Back to Home</TextRoll>
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-secondary hover:text-red-400 hover:bg-red-500/5 transition-all group">
            <LogOut className="size-5 group-hover:translate-x-1 transition-transform" />
            <TextRoll className="font-bold text-sm tracking-wide">Logout</TextRoll>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-t border-white/5 z-50 px-4 flex items-center justify-between">
        {NAV_ITEMS.slice(0, 5).map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveSection(item.label)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeSection === item.label ? "text-white" : "text-secondary"
            )}
          >
            <item.icon className="size-6" />
            <TextRoll className="text-[10px] font-bold uppercase tracking-tighter">{item.label.split(' ')[0]}</TextRoll>
          </button>
        ))}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="flex flex-col items-center gap-1 text-secondary"
        >
          <Menu className="size-6" />
          <TextRoll className="text-[10px] font-bold uppercase tracking-tighter">More</TextRoll>
        </button>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-black border-l border-white/5 z-[70] p-6 lg:hidden"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="text-xl font-black tracking-tighter uppercase">Menu</span>
                <Button size="icon" variant="ghost" onClick={() => setIsSidebarOpen(false)}>
                  <X className="size-6" />
                </Button>
              </div>
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveSection(item.label);
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
                      activeSection === item.label 
                        ? "bg-white text-black" 
                        : "text-secondary hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="size-5" />
                    <TextRoll className="font-bold text-sm tracking-wide">{item.label}</TextRoll>
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto no-scrollbar relative">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-bottom border-white/5 px-6 md:px-10 py-6 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white tracking-tight">Welcome back, Student</h1>
            <p className="text-xs text-secondary font-medium">You have 3 new marketplace matches today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <SearchBar placeholder="Search data..." />
            </div>
            <Button size="icon" variant="ghost" className="relative text-secondary hover:text-white">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 bg-white rounded-full border-2 border-black" />
            </Button>
            <div className="size-10 rounded-xl bg-white/10 p-[1px]">
              <div className="size-full rounded-[11px] bg-black flex items-center justify-center">
                <User className="size-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Section Content */}
        <div className="px-6 md:px-10 py-8 pb-32 lg:pb-10 max-w-7xl mx-auto">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
