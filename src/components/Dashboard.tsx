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
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
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

const SectionHeader = ({ title, subtitle, action }: { title: string, subtitle?: string, action?: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
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
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const handleFilesSelected = (files: File[]) => {
    const newFiles = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadingFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload for each file
    newFiles.forEach((fileObj) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id ? { ...f, progress: 100, status: "completed" } : f
            )
          );
          toast({
            title: "Item Listed",
            message: `${fileObj.file.name} listed successfully`,
            variant: "success",
          });
        } else {
          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === fileObj.id ? { ...f, progress } : f))
          );
        }
      }, 500);
    });
  };

  const handleFileRemove = (id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const items = [
    { name: "Calculus Textbook", type: "Textbooks", date: "Mar 12, 2024", price: "$45", location: "North Campus" },
    { name: "Sony Headphones", type: "Electronics", date: "Feb 28, 2024", price: "$120", location: "Library" },
    { name: "Dorm Desk Lamp", type: "Dorm Decor", date: "Jan 15, 2024", price: "$15", location: "South Hall" },
    { name: "Winter Jacket", type: "Clothing", date: "Dec 05, 2023", price: "$60", location: "Student Union" },
    { name: "Scientific Calculator", type: "Electronics", date: "Nov 20, 2023", price: "$30", location: "Science Block" },
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All Items" || item.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-start">
        <Button 
          variant="outline" 
          onClick={() => setActiveSection("Insights")}
          className="rounded-xl px-6 whitespace-nowrap font-bold border-white/5 bg-white/5 hover:bg-white/10 gap-2"
        >
          <Activity className="size-4" /> View Insights
        </Button>
      </div>
      <SectionHeader title="Campus Marketplace" subtitle="Buy and sell items within your verified student network." />
      
      <FileUploadCard 
        onFilesSelected={handleFilesSelected}
        onFileRemove={handleFileRemove}
        uploadingFiles={uploadingFiles}
        className="max-w-none"
      />

      <div className="space-y-6">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
          {["All Items", "Textbooks", "Electronics", "Dorm Decor", "Clothing"].map((cat) => (
            <Button 
              key={cat} 
              variant={activeCategory === cat ? "default" : "outline"} 
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-xl px-6 whitespace-nowrap font-bold",
                activeCategory === cat ? "bg-white text-black hover:bg-white/90" : "border-white/5 bg-white/5 hover:bg-white/10"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, i) => (
              <Card key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                    <ShoppingBag className="size-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm tracking-tight">{item.name}</h4>
                    <p className="text-xs text-secondary">{item.type} • {item.price}</p>
                    <p className="text-[10px] text-white/30 mt-1 flex items-center gap-1">
                      <MapPin className="size-3" /> {item.location}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="text-white/20 hover:text-white">
                    <MessageSquare className="size-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-emerald-400/40 hover:text-emerald-400"
                    onClick={() => {
                      toast({
                        title: "Interested",
                        message: `Notifying seller of your interest in ${item.name}...`,
                        variant: "default",
                      });
                    }}
                  >
                    <Heart className="size-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-secondary font-medium">
              No items found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LostFoundView = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader 
        title="Lost & Found" 
        subtitle="Report lost items and browse found items near you."
        action={<Button className="bg-white text-black hover:bg-white/90 rounded-xl px-6 gap-2 font-bold"><Plus className="size-4" /> Report Lost</Button>}
      />
      <div className="grid grid-cols-1 gap-4">
        {[
          { name: "Blue Hydroflask", status: "Match Found", location: "Library", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", match: "95%" },
          { name: "Sony Headphones", status: "Searching", location: "Cafeteria", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", match: "88%" },
          { name: "Keys with Keychain", status: "Reported Found", location: "Gym", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", match: "N/A" },
        ].map((item, i) => (
          <Card key={i} className={cn("border-l-4", item.border)}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center", item.bg, item.color)}>
                  <Search className="size-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white tracking-tight">{item.name}</h4>
                  <p className="text-sm text-secondary">Status: <span className={cn("font-bold", item.color)}>{item.status}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Location</p>
                  <p className="text-sm text-white/60 font-medium">{item.location}</p>
                </div>
                {item.match !== "N/A" && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Match Confidence</p>
                    <p className="text-sm text-emerald-400 font-bold">{item.match}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
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
