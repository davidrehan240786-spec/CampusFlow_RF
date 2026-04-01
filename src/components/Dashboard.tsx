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
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  Filter,
  ArrowUpDown,
  Flame,
  Tag,
  PlusCircle,
  TrendingUp,
  Star,
  Award,
  History,
  UserCheck,
  AlertCircle,
  ThumbsUp,
  Eye,
  Users,
  PackageCheck,
  Zap
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TextRoll } from "@/components/ui/animated-menu";
import { useAuth } from "../context/AuthContext";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  where,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";

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

const TOP_PERFORMING_ITEMS = [
  { id: 1, title: "iPhone 13 Pro", views: 450, interest: 28, status: "Trending", image: "https://picsum.photos/seed/iphone/200/200" },
  { id: 2, title: "MacBook Air M1", views: 380, interest: 15, status: "Sold", image: "https://picsum.photos/seed/macbook/200/200" },
  { id: 3, title: "Calculator TI-84", views: 210, interest: 12, status: "Trending", image: "https://picsum.photos/seed/calc/200/200" },
  { id: 4, title: "Dorm Desk Lamp", views: 180, interest: 8, status: "Trending", image: "https://picsum.photos/seed/lamp/200/200" },
];

const TRENDING_CAMPUS = [
  { id: 1, title: "Textbooks (CS101)", price: "$45", demand: "High Demand", image: "https://picsum.photos/seed/book/200/200" },
  { id: 2, title: "Electric Scooter", price: "$250", demand: "High Demand", image: "https://picsum.photos/seed/scooter/200/200" },
  { id: 3, title: "Gym Membership", price: "$30", demand: "High Demand", image: "https://picsum.photos/seed/gym/200/200" },
];

const INSIGHTS_ACTIVITY = [
  { id: 1, text: "Your item 'iPhone 13 Pro' got 12 new views", time: "2m ago", icon: Eye, color: "text-blue-400" },
  { id: 2, text: "Someone contacted you about 'MacBook Air'", time: "15m ago", icon: MessageSquare, color: "text-emerald-400" },
  { id: 3, text: "Item 'Dorm Desk Lamp' sold successfully", time: "1h ago", icon: PackageCheck, color: "text-purple-400" },
  { id: 4, text: "Your recovery success rate increased to 95%", time: "3h ago", icon: TrendingUp, color: "text-emerald-400" },
];

const RECENT_ACTIVITY = [
  { id: 1, actionKey: "dash_listed_item", userKey: "dash_you", timeKey: "dash_hours_ago", timeVal: 2, icon: ShoppingBag, color: "text-blue-500" },
  { id: 2, actionKey: "dash_reported_lost", userKey: "dash_you", timeKey: "dash_hours_ago", timeVal: 5, icon: Search, color: "text-orange-500" },
  { id: 3, actionKey: "dash_completed_meetup", userKey: "dash_you", timeKey: "dash_day_ago", timeVal: 1, icon: CheckCircle, color: "text-emerald-500" },
];

const UPCOMING_MEETUPS = [
  { id: 1, item: "Calculus Textbook", time: "Today, 2:00 PM", location: "Library Cafe", status: "Confirmed", icon: ShoppingBag },
  { id: 2, item: "Sony Headphones", time: "Tomorrow, 11:00 AM", location: "Student Union", status: "Pending", icon: ShoppingBag },
  { id: 3, item: "Dorm Desk Lamp", time: "Apr 3, 4:30 PM", location: "North Quad", status: "Confirmed", icon: PackageCheck },
];

const DUMMY_MARKETPLACE = [
  { id: 'm1', name: "Calculus Textbook (12th Ed)", price: 45, category: "Books", location: "Library", trending: true, interest: 12, status: 'available', createdAt: new Date(), image: "https://picsum.photos/seed/book/200/200", tags: ["Urgent"], sellerId: "user_1", sellerName: "Alex Johnson" },
  { id: 'm2', name: "Sony WH-1000XM4", price: 180, category: "Electronics", location: "Student Union", trending: true, interest: 25, status: 'available', createdAt: new Date(), image: "https://picsum.photos/seed/sony/200/200", tags: ["Verified Seller"], sellerId: "user_2", sellerName: "Sarah Smith" },
  { id: 'm3', name: "Dorm Desk Lamp", price: 15, category: "Dorm", location: "North Campus", trending: false, interest: 5, status: 'available', createdAt: new Date(), image: "https://picsum.photos/seed/lamp/200/200", tags: [], sellerId: "user_3", sellerName: "Mike Brown" },
  { id: 'm4', name: "Electric Scooter", price: 250, category: "Electronics", location: "South Hall", trending: true, interest: 18, status: 'available', createdAt: new Date(), image: "https://picsum.photos/seed/scooter/200/200", tags: ["Urgent"], sellerId: "user_4", sellerName: "Emily Davis" },
  { id: 'm5', name: "Mini Fridge", price: 80, category: "Dorm", location: "East Hall", trending: true, interest: 30, status: 'available', createdAt: new Date(), image: "https://picsum.photos/seed/fridge/200/200", tags: ["Verified Seller"], sellerId: "user_5", sellerName: "Chris Wilson" },
  { id: 'm6', name: "Organic Chemistry Kit", price: 35, category: "Books", location: "Science Building", trending: false, interest: 3, status: 'available', createdAt: new Date(), image: "https://picsum.photos/seed/chem/200/200", tags: [], sellerId: "user_6", sellerName: "Jessica Lee" },
];

const DUMMY_LOSTFOUND = [
  { id: 'lf1', name: "Blue Hydroflask", location: "Library", status: "Match Found", createdAt: new Date(), type: 'lost', description: "Blue bottle with stickers", reporterId: "user_1", reporterName: "Alex Johnson" },
  { id: 'lf2', name: "Keys with Red Keychain", location: "Gym", status: "Reported Lost", createdAt: new Date(), type: 'lost', description: "Set of 3 keys", reporterId: "user_2", reporterName: "Sarah Smith" },
  { id: 'lf3', name: "MacBook Pro Charger", location: "Cafeteria", status: "Match Found", createdAt: new Date(), type: 'found', description: "85W MagSafe charger", reporterId: "user_3", reporterName: "Mike Brown" },
  { id: 'lf4', name: "Student ID Card", location: "Main Quad", status: "Reported Found", createdAt: new Date(), type: 'found', description: "Found near the fountain", reporterId: "user_4", reporterName: "Emily Davis" },
  { id: 'lf5', name: "Black Wallet", location: "Student Union", status: "Match Found", createdAt: new Date(), type: 'lost', description: "Leather wallet with ID", reporterId: "user_5", reporterName: "Chris Wilson" },
  { id: 'lf6', name: "AirPods Case", location: "North Hall", status: "Reported Lost", createdAt: new Date(), type: 'lost', description: "White case, no buds", reporterId: "user_6", reporterName: "Jessica Lee" },
];

const DUMMY_ADS = [
  { id: 'ad1', title: "Summer Internship Fair", subtitle: "Meet top recruiters on campus next Tuesday!", color: "bg-blue-500/10", textColor: "text-blue-400", icon: Users },
  { id: 'ad2', title: "Campus Coffee Special", subtitle: "Get 50% off your second latte at Library Cafe.", color: "bg-orange-500/10", textColor: "text-orange-400", icon: Flame },
  { id: 'ad3', title: "Dorm Essentials Sale", subtitle: "Up to 40% off bedding and storage at the Campus Store.", color: "bg-purple-500/10", textColor: "text-purple-400", icon: ShoppingBag },
];

const MEETUP_HISTORY = [
  { id: 1, item: "iPhone 13 Pro", date: "Mar 28, 2024", location: "Starbucks", status: "Completed", icon: CheckCircle2 },
  { id: 2, item: "MacBook Air M1", date: "Mar 25, 2024", location: "Library", status: "Completed", icon: CheckCircle2 },
  { id: 3, item: "TI-84 Calculator", date: "Mar 20, 2024", location: "Engineering Bldg", status: "Cancelled", icon: XCircle },
];

const DUMMY_MEETUPS = [
  { id: 'm1', item: "Calculus Textbook", time: "Today, 2:00 PM", location: "Library Cafe", status: "Confirmed", buyerId: "user_1", sellerId: "current_user" },
  { id: 'm2', item: "Sony Headphones", time: "Tomorrow, 11:00 AM", location: "Student Union", status: "Pending", buyerId: "current_user", sellerId: "user_2" },
  { id: 'm3', item: "Dorm Desk Lamp", time: "Apr 3, 4:30 PM", location: "North Quad", status: "Confirmed", buyerId: "user_3", sellerId: "current_user" },
  { id: 'm4', item: "iPhone 13 Pro", time: "Mar 28, 2024", location: "Starbucks", status: "Completed", buyerId: "current_user", sellerId: "user_4" },
  { id: 'm5', item: "MacBook Air M1", time: "Mar 25, 2024", location: "Library", status: "Completed", buyerId: "user_5", sellerId: "current_user" },
  { id: 'm6', item: "TI-84 Calculator", time: "Mar 20, 2024", location: "Engineering Bldg", status: "Cancelled", buyerId: "current_user", sellerId: "user_6" },
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

const DashboardView = ({ 
  setActiveSection, 
  marketplaceItems, 
  lostFoundItems, 
  meetups,
  startChat
}: { 
  setActiveSection: (section: Section) => void,
  marketplaceItems: any[],
  lostFoundItems: any[],
  meetups: any[],
  startChat: (otherUserId: string, otherUserName: string, itemId?: string) => void
}) => {
  const activeListings = marketplaceItems.filter(i => i.status === 'available').length;
  const activeMeetups = meetups.filter(m => m.status === 'confirmed' || m.status === 'pending').length;
  const lostFoundMatches = lostFoundItems.filter(i => i.status === 'Match Found').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DUMMY_ADS.map((ad) => (
          <Card key={ad.id} className={cn("border-white/5 relative overflow-hidden group", ad.color)}>
            <div className="absolute top-0 right-0 p-2">
              <Badge variant="outline" className="bg-white/5 text-[8px] uppercase tracking-widest border-white/10 opacity-50">Sponsored</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className={cn("size-10 rounded-xl bg-white/10 flex items-center justify-center", ad.textColor)}>
                <ad.icon className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">{ad.title}</h4>
                <p className="text-[11px] text-secondary leading-tight mt-0.5">{ad.subtitle}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveSection("Marketplace")}>
          <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <ShoppingBag className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Total Listings</p>
            <p className="text-2xl font-bold text-white tracking-tight">{activeListings} Active</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveSection("Chat")}>
          <div className="size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <MessageSquare className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Active Chats</p>
            <p className="text-2xl font-bold text-white tracking-tight">5 New</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveSection("Trust System")}>
          <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Shield className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Trust Score</p>
            <p className="text-2xl font-bold text-white tracking-tight">98%</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveSection("Lost & Found")}>
          <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
            <Search className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Lost & Found</p>
            <p className="text-2xl font-bold text-white tracking-tight">{lostFoundMatches} Matches</p>
          </div>
        </Card>
      </div>

    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white/80 flex items-center gap-2 tracking-tight">
          <Bell className="size-5 text-white/40" />
          Recent Matches & Marketplace Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lostFoundItems.filter(i => i.status === 'Match Found').slice(0, 3).map((item) => (
            <Card key={item.id} className="border-emerald-500/20 bg-emerald-500/5 group hover:border-emerald-500/40">
              <div className="flex items-start justify-between mb-4">
                <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Search className="size-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60">Match Found</span>
              </div>
              <h4 className="font-bold text-white mb-3 tracking-tight truncate">{item.name}</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-sm font-medium text-white">Location</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest bg-blue-500/20 text-blue-400">
                    {item.location}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 p-0 h-auto font-bold text-xs uppercase tracking-widest"
                  onClick={() => setActiveSection("Lost & Found")}
                >
                  View Details <ChevronRight className="size-3 ml-1" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/40 hover:text-white hover:bg-white/5 p-0 h-auto font-bold text-xs uppercase tracking-widest ml-auto"
                  onClick={() => startChat(item.reporterId, item.reporterName, item.id)}
                >
                  <MessageSquare className="size-3 mr-1" /> Chat
                </Button>
              </div>
            </Card>
          ))}
          {marketplaceItems.filter(i => i.trending).slice(0, 3).map((item) => (
            <Card key={item.id} className="border-white/10 glass group hover:border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <ShoppingBag className="size-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Trending Item</span>
              </div>
              <h4 className="font-bold text-white mb-1 tracking-tight truncate">{item.name}</h4>
              <p className="text-sm text-secondary line-clamp-1">{item.interest} students interested</p>
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:text-white/80 hover:bg-white/5 p-0 h-auto font-bold text-xs uppercase tracking-widest"
                  onClick={() => setActiveSection("Marketplace")}
                >
                  View Listing <ChevronRight className="size-3 ml-1" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/40 hover:text-white hover:bg-white/5 p-0 h-auto font-bold text-xs uppercase tracking-widest ml-auto"
                  onClick={() => startChat(item.sellerId, item.sellerName, item.id)}
                >
                  <MessageSquare className="size-3 mr-1" /> Chat
                </Button>
              </div>
            </Card>
          ))}
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

const MarketplaceView = ({ 
  setActiveSection, 
  items,
  startChat
}: { 
  setActiveSection: (section: Section) => void,
  items: any[],
  startChat: (otherUserId: string, otherUserName: string, itemId?: string) => void
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Added");
  const [priceRange, setPriceRange] = useState(500);
  const [activeLocation, setActiveLocation] = useState("All");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const categories = ["All", "Books", "Electronics", "Dorm", "Clothing"];
  const locations = ["All", "Library", "North Campus", "South Hall", "Student Union"];
  const tags = ["Urgent", "Verified Seller"];

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
    const matchesTags = activeTags.length === 0 || activeTags.every(tag => item.tags?.includes(tag));
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice && matchesTags;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "Price: Low → High") return a.price - b.price;
    if (sortBy === "Price: High → Low") return b.price - a.price;
    if (sortBy === "Trending") return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
    // Handle Firestore Timestamp or Date
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
    return dateB.getTime() - dateA.getTime();
  });

  const trendingItems = items.filter(item => item.trending);
  const recentlyAdded = [...items].sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
    return dateB.getTime() - dateA.getTime();
  }).slice(0, 4);

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

      {/* Promotional Ad */}
      <Card className="bg-indigo-500/10 border-indigo-500/20 p-6 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <Badge className="bg-indigo-500 text-white border-none text-[10px] uppercase tracking-widest px-3">Featured</Badge>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="size-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Zap className="size-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white tracking-tight">Upgrade to CampusFlow Pro</h3>
            <p className="text-sm text-indigo-300/60 mt-1">Get unlimited listings, priority support, and verified seller status for just $2.99/month.</p>
          </div>
          <Button className="bg-white text-black hover:bg-white/90 rounded-xl px-8 font-bold h-12">Learn More</Button>
        </div>
      </Card>

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
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="size-8 text-white/20 hover:text-white rounded-lg"
                            onClick={() => startChat(item.sellerId, item.sellerName, item.id)}
                          >
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

const LostFoundView = ({ 
  setActiveSection, 
  items,
  startChat
}: { 
  setActiveSection: (section: Section) => void,
  items: any[],
  startChat: (otherUserId: string, otherUserName: string, itemId?: string) => void
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"All" | "Lost" | "Found">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Added");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === "All" || item.type === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (item.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "All" || item.location === locationFilter;
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    
    return matchesTab && matchesSearch && matchesLocation && matchesCategory && matchesStatus;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "Recently Added") {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    }
    if (sortBy === "Name: A-Z") return a.name.localeCompare(b.name);
    if (sortBy === "Name: Z-A") return b.name.localeCompare(a.name);
    return 0;
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
            onClick={() => navigate("/report-lost")}
            className="bg-white text-black hover:bg-white/90 rounded-xl px-6 gap-2 font-bold h-12"
          >
            <Search className="size-4" /> Report Lost
          </Button>
          <Button 
            onClick={() => navigate("/report-found")}
            variant="outline"
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl px-6 gap-2 font-bold h-12"
          >
            <CheckCircle className="size-4" /> Report Found
          </Button>
        </div>
      </div>

      {/* Promotional Ad */}
      <Card className="bg-emerald-500/10 border-emerald-500/20 p-6 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <Badge className="bg-emerald-500 text-white border-none text-[10px] uppercase tracking-widest px-3">Safety Tip</Badge>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="size-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Shield className="size-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white tracking-tight">Always Meet in Public Spaces</h3>
            <p className="text-sm text-emerald-300/60 mt-1">For your safety, we recommend meeting at the designated "Safe Zones" marked on the campus map.</p>
          </div>
          <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-xl px-8 font-bold h-12">View Safe Zones</Button>
        </div>
      </Card>

      {/* Tabs & Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-full lg:w-auto shrink-0">
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
            className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl focus:border-white/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative w-full lg:w-64">
            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/30" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white appearance-none focus:outline-none focus:border-white/20"
            >
              <option className="bg-zinc-900">Recently Added</option>
              <option className="bg-zinc-900">Name: A-Z</option>
              <option className="bg-zinc-900">Name: Z-A</option>
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

      {/* Filters Row */}
      <AnimatePresence>
        {isFilterVisible && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-3 pt-2">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items Grid */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {sortedItems.map((item) => (
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
                    <Button 
                      onClick={() => startChat(item.reporterId, item.reporterName, item.id)}
                      className="flex-1 lg:flex-none h-10 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs font-bold"
                    >
                      <MessageSquare className="size-3.5 mr-2" /> Chat
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

const TRUST_INSIGHTS = [
  { label: "Successful Trades", value: "48", icon: ShoppingBag, color: "text-blue-400" },
  { label: "Return Rate", value: "100%", icon: ArrowUpDown, color: "text-emerald-400" },
  { label: "Community Activity", value: "High", icon: Activity, color: "text-purple-400" },
];

const TRUST_RECENT_ACTIVITY = [
  { id: 1, text: "Completed 3 trades this week", time: "2 days ago", icon: CheckCircle },
  { id: 2, text: "Verified student email", time: "1 month ago", icon: UserCheck },
  { id: 3, text: "Received 5-star rating", time: "1 week ago", icon: Star },
];

const TrustSystemView = () => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
    <SectionHeader 
      title="Student Trust System" 
      subtitle="Verified student network for safe campus transactions." 
    />
    
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Trust Card */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="glass border-white/10 p-8 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1.5 py-1 px-3">
              <Shield className="size-3" /> Verified Student
            </Badge>
          </div>
          
          <div className="relative mb-6">
            <div className="size-32 rounded-full bg-white/10 p-1 ring-4 ring-white/5 group-hover:ring-white/10 transition-all duration-500">
              <div className="size-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                <User className="size-16 text-white/20" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 size-10 rounded-full bg-emerald-500 border-4 border-black flex items-center justify-center text-white shadow-lg">
              <CheckCircle className="size-5" />
            </div>
          </div>

          <div className="space-y-1 mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">Sarah Johnson</h3>
            <p className="text-secondary text-sm font-medium">Computer Science • Class of 2025</p>
          </div>

          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Trust Score</span>
              <span className="text-2xl font-black text-white">98%</span>
            </div>
            <Progress value={98} className="h-3 bg-white/5" />
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
              <span>Bronze</span>
              <span className="text-white/60">Gold Level</span>
              <span>Platinum</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mt-8">
            <Button className="bg-white text-black hover:bg-white/90 font-bold rounded-xl h-12 gap-2">
              <Share2 className="size-4" /> Share ID
            </Button>
            <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl h-12">
              Edit Profile
            </Button>
          </div>
        </Card>

        <Card className="glass border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="size-5 text-emerald-400" />
            <h4 className="font-bold text-white">Earned Badges</h4>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ThumbsUp className="size-4" />
              <span className="text-xs font-bold">Trusted Seller</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Activity className="size-4" />
              <span className="text-xs font-bold">Active User</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <UserCheck className="size-4" />
              <span className="text-xs font-bold">Early Adopter</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Trust Insights & Activity */}
      <div className="lg:col-span-7 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRUST_INSIGHTS.map((insight, i) => (
            <Card key={i} className="glass border-white/10 p-5 space-y-4">
              <div className={cn("size-10 rounded-xl bg-white/5 flex items-center justify-center", insight.color)}>
                <insight.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{insight.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{insight.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="glass border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <History className="size-5 text-white/40" />
              <h4 className="font-bold text-white">Recent Trust Activity</h4>
            </div>
            <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white">
              View History
            </Button>
          </div>
          <div className="space-y-4">
            {TRUST_RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                    <activity.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{activity.text}</p>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{activity.time}</p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-white/10" />
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass border-white/10 p-6">
            <h4 className="font-bold text-white mb-4">Verification Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Public Trust Score</p>
                  <p className="text-[10px] text-white/40">Show your score on listings</p>
                </div>
                <Checkbox id="public-score" defaultChecked className="size-5 rounded-lg border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Verified Status</p>
                  <p className="text-[10px] text-white/40">Display verification badge</p>
                </div>
                <Checkbox id="verified-status" defaultChecked className="size-5 rounded-lg border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
              </div>
            </div>
          </Card>

          <Card className="glass border-emerald-500/20 bg-emerald-500/5 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="size-6 text-emerald-400" />
              <h4 className="font-bold text-white">Safe User Status</h4>
            </div>
            <p className="text-sm text-emerald-400/80 font-medium leading-relaxed">
              No reports found. You are currently recognized as a safe and reliable member of the campus community.
            </p>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

const InsightsView = ({ 
  marketplaceItems, 
  lostFoundItems 
}: { 
  marketplaceItems: any[],
  lostFoundItems: any[]
}) => {
  const totalViews = marketplaceItems.reduce((acc, item) => acc + (item.views || 0), 0);
  const totalInterest = marketplaceItems.reduce((acc, item) => acc + (item.interest || 0), 0);
  const itemsSold = marketplaceItems.filter(item => item.status === "sold").length;
  const recoverySuccess = lostFoundItems.length > 0 
    ? Math.round((lostFoundItems.filter(item => item.status === "Resolved").length / lostFoundItems.length) * 100) 
    : 0;

  const topPerforming = [...marketplaceItems]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  const trendingOnCampus = marketplaceItems.filter(item => item.trending).slice(0, 6);

  return (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
    <SectionHeader title="Marketplace Insights" subtitle="Track your listing performance and campus trends." />
    
    {/* Quick Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="glass border-white/10 p-6 space-y-4">
        <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
          <Eye className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-black text-white">{totalViews}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total Views</p>
        </div>
      </Card>
      <Card className="glass border-white/10 p-6 space-y-4">
        <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
          <Users className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-black text-white">{totalInterest}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Interested Users</p>
        </div>
      </Card>
      <Card className="glass border-white/10 p-6 space-y-4">
        <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
          <PackageCheck className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-black text-white">{itemsSold}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Items Sold</p>
        </div>
      </Card>
      <Card className="glass border-white/10 p-6 space-y-4">
        <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
          <TrendingUp className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-black text-white">{recoverySuccess}%</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Recovery Success</p>
        </div>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Top Performing Items */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight">Top Performing Items</h3>
          <Button variant="link" className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topPerforming.length > 0 ? (
            topPerforming.map((item) => (
              <Card key={item.id} className="glass border-white/10 p-4 flex gap-4 group hover:border-white/20 transition-all">
                <div className="size-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                  <img src={item.image || "https://picsum.photos/seed/item/200/200"} alt={item.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white text-sm truncate max-w-[120px]">{item.name}</h4>
                      <Badge variant="outline" className={cn(
                        "text-[8px] px-1.5 py-0 h-4 font-bold uppercase tracking-widest",
                        item.trending ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      )}>
                        {item.trending ? "Trending" : "Active"}
                      </Badge>
                    </div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.views || 0} Views • {item.interest || 0} Interested</p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="size-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">High Interest</span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-white/20 font-bold uppercase tracking-widest text-xs">
              No performance data available yet.
            </div>
          )}
        </div>

        {/* Trending on Campus */}
        <div className="pt-4 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white tracking-tight">Trending on Campus</h3>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Updates</span>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {trendingOnCampus.length > 0 ? (
              trendingOnCampus.map((item) => (
                <Card key={item.id} className="glass border-white/10 p-4 flex items-center gap-4 min-w-[280px] hover:border-white/20 transition-all">
                  <div className="size-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                    <img src={item.image || "https://picsum.photos/seed/item/200/200"} alt={item.name} className="size-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm mb-1">{item.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold">${item.price}</span>
                      <Badge className="bg-white/5 text-white/60 border-white/10 text-[8px] font-bold uppercase tracking-widest">
                        High Demand
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="w-full py-10 text-center text-white/20 font-bold uppercase tracking-widest text-xs">
                No trending items at the moment.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="lg:col-span-4 space-y-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity</h3>
        <Card className="glass border-white/10 p-6">
          <div className="space-y-6">
            {INSIGHTS_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex gap-4 group cursor-pointer">
                <div className={cn("size-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors", activity.color)}>
                  <activity.icon className="size-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white/80 leading-tight group-hover:text-white transition-colors">{activity.text}</p>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-8 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl h-12">
            View Full History
          </Button>
        </Card>

        {/* Action Card */}
        <Card className="bg-blue-600 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <TrendingUp className="size-20" />
          </div>
          <div className="relative z-10 space-y-4">
            <h4 className="text-xl font-black text-white leading-tight">Boost Your Listings</h4>
            <p className="text-white/80 text-sm font-medium">Items with high-quality photos get 3x more views on campus.</p>
            <Button className="bg-white text-blue-600 hover:bg-white/90 font-bold rounded-xl w-full">
              Optimize Now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  </div>
);
};

const RescheduleModal = ({ meetup, onClose }: { meetup: any, onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-md glass border-white/10 p-8 space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="size-6" />
        </button>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white tracking-tight">Reschedule Meetup</h3>
          <p className="text-sm text-white/40">Change the time or location for your exchange of <span className="text-white font-bold">{meetup.item}</span>.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">New Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
              <Input className="bg-white/5 border-white/10 pl-10 rounded-xl h-12 text-sm" defaultValue={meetup.location} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">New Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                <Input className="bg-white/5 border-white/10 pl-10 rounded-xl h-12 text-xs" placeholder="Select date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">New Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                <Input className="bg-white/5 border-white/10 pl-10 rounded-xl h-12 text-xs" placeholder="Select time" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl h-12" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl h-12" onClick={onClose}>
            Save Changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CancelModal = ({ meetup, onClose }: { meetup: any, onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-md glass border-white/10 p-8 space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="size-6" />
        </button>

        <div className="size-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-2">
          <AlertCircle className="size-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white tracking-tight">Cancel Meetup?</h3>
          <p className="text-sm text-white/40 leading-relaxed">
            Are you sure you want to cancel the meetup for <span className="text-white font-bold">{meetup.item}</span>? This will notify the other student.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl h-12" onClick={onClose}>
            Keep Meetup
          </Button>
          <Button className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl h-12" onClick={onClose}>
            Yes, Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MeetupView = ({ 
  setActiveSection, 
  meetups 
}: { 
  setActiveSection: (section: Section) => void,
  meetups: any[]
}) => {
  const [selectedMeetup, setSelectedMeetup] = React.useState<any>(null);
  const [modalType, setModalType] = React.useState<'reschedule' | 'cancel' | null>(null);

  const handleOpenModal = (meetup: any, type: 'reschedule' | 'cancel') => {
    setSelectedMeetup(meetup);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setSelectedMeetup(null);
    setModalType(null);
  };

  const upcomingMeetups = meetups.filter(m => m.status === "Scheduled" || m.status === "Pending" || m.status === "Confirmed");
  const pastMeetups = meetups.filter(m => m.status === "Completed" || m.status === "Cancelled");

  return (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
    <SectionHeader title="Campus Meetups" subtitle="Schedule and manage safe meetups for item exchanges." />
    
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Schedule & Upcoming */}
      <div className="lg:col-span-8 space-y-8">
        {/* Upcoming Meetups */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white tracking-tight">Upcoming Meetups</h3>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold uppercase tracking-widest text-[10px]">
              {upcomingMeetups.length} Scheduled
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingMeetups.map((meetup) => (
              <Card key={meetup.id} className="glass border-white/10 p-5 group hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                    <Calendar className="size-6" />
                  </div>
                  <Badge className={cn(
                    "text-[8px] font-bold uppercase tracking-widest",
                    meetup.status === "Confirmed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                  )}>
                    {meetup.status}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-white leading-tight">{meetup.item}</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-white/40">
                      <Clock className="size-3.5" />
                      <span className="text-xs font-medium">{meetup.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40">
                      <MapPin className="size-3.5" />
                      <span className="text-xs font-medium">{meetup.location}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                  <Button 
                    variant="ghost" 
                    className="flex-1 h-9 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5"
                    onClick={() => handleOpenModal(meetup, 'reschedule')}
                  >
                    Reschedule
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="flex-1 h-9 text-[10px] font-bold uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-400/5"
                    onClick={() => handleOpenModal(meetup, 'cancel')}
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Meetup History */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white tracking-tight">Meetup History</h3>
          <Card className="glass border-white/10 overflow-hidden">
            <div className="divide-y divide-white/5">
              {pastMeetups.map((history) => (
                <div key={history.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "size-10 rounded-xl flex items-center justify-center",
                      history.status === "Completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    )}>
                      <History className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{history.item}</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{history.time} • {history.location}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity",
                    history.status === "Completed" ? "border-emerald-500/20 text-emerald-400" : "border-red-500/20 text-red-400"
                  )}>
                    {history.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Right Column: Schedule Form */}
      <div className="lg:col-span-4 space-y-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Schedule Meetup</h3>
        <Card className="glass border-white/10 p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Select Item</Label>
              <div className="relative">
                <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                <Input className="bg-white/5 border-white/10 pl-10 rounded-xl h-12 text-sm" placeholder="What are you exchanging?" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                <Input className="bg-white/5 border-white/10 pl-10 rounded-xl h-12 text-sm" placeholder="Verified safe zone..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                  <Input className="bg-white/5 border-white/10 pl-10 rounded-xl h-12 text-xs" placeholder="Select date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                  <Input className="bg-white/5 border-white/10 pl-10 rounded-xl h-12 text-xs" placeholder="Select time" />
                </div>
              </div>
            </div>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl h-14 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            Confirm Meetup
          </Button>
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex gap-3">
            <Shield className="size-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium text-emerald-400/80 leading-relaxed">
              All meetups are monitored for safety. Meet in well-lit, public areas as suggested by the app.
            </p>
          </div>
        </Card>

        {/* Quick Tips */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Safe Exchange Tips</h4>
          <div className="space-y-3">
            {[
              "Always meet during daylight hours",
              "Bring a friend if possible",
              "Verify item before payment",
              "Use digital payments for safety"
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                <div className="size-1 rounded-full bg-blue-500" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Modals */}
    <AnimatePresence>
      {modalType === 'reschedule' && selectedMeetup && (
        <RescheduleModal meetup={selectedMeetup} onClose={handleCloseModal} />
      )}
      {modalType === 'cancel' && selectedMeetup && (
        <CancelModal meetup={selectedMeetup} onClose={handleCloseModal} />
      )}
    </AnimatePresence>
  </div>
);
};

const DUMMY_CONVERSATIONS = [
  { 
    id: 'dummy_1', 
    participants: ['me', 'user_1'], 
    participantNames: { 'me': 'Me', 'user_1': 'Alex Rivera' },
    lastMessage: "Is the textbook still available?",
    lastMessageTimestamp: { toDate: () => new Date(Date.now() - 3600000) },
    isDummy: true
  },
  { 
    id: 'dummy_2', 
    participants: ['me', 'user_2'], 
    participantNames: { 'me': 'Me', 'user_2': 'Sarah Smith' },
    lastMessage: "I found your keys near the gym!",
    lastMessageTimestamp: { toDate: () => new Date(Date.now() - 86400000) },
    isDummy: true
  },
  { 
    id: 'dummy_3', 
    participants: ['me', 'support'], 
    participantNames: { 'me': 'Me', 'support': 'CampusFlow Support' },
    lastMessage: "Your item has been successfully listed.",
    lastMessageTimestamp: { toDate: () => new Date(Date.now() - 172800000) },
    isDummy: true
  },
  { 
    id: 'dummy_4', 
    participants: ['me', 'user_4'], 
    participantNames: { 'me': 'Me', 'user_4': 'Jordan Lee' },
    lastMessage: "Is the price negotiable?",
    lastMessageTimestamp: { toDate: () => new Date(Date.now() - 10800000) },
    isDummy: true
  }
];

const DUMMY_MESSAGES_MAP: Record<string, any[]> = {
  'dummy_1': [
    { id: 'm1', senderId: 'user_1', text: "Hi! I saw your listing for the Calculus textbook. Is it still available?", timestamp: { toDate: () => new Date(Date.now() - 4000000) } },
    { id: 'm2', senderId: 'me', text: "Yes, it is! I can meet at the Library Cafe today if you're interested.", timestamp: { toDate: () => new Date(Date.now() - 3800000) } },
    { id: 'm3', senderId: 'user_1', text: "That works for me! Does 2:00 PM sound good?", timestamp: { toDate: () => new Date(Date.now() - 3600000) } }
  ],
  'dummy_2': [
    { id: 'm4', senderId: 'user_2', text: "Hey, I think I found your keys with the red keychain near the gym entrance.", timestamp: { toDate: () => new Date(Date.now() - 87000000) } },
    { id: 'm5', senderId: 'me', text: "Oh my god, thank you! I've been looking everywhere for them.", timestamp: { toDate: () => new Date(Date.now() - 86800000) } },
    { id: 'm6', senderId: 'user_2', text: "No problem! I left them at the front desk of the Student Union.", timestamp: { toDate: () => new Date(Date.now() - 86400000) } }
  ],
  'dummy_3': [
    { id: 'm7', senderId: 'support', text: "Welcome to CampusFlow! Your account is now verified.", timestamp: { toDate: () => new Date(Date.now() - 173000000) } },
    { id: 'm8', senderId: 'support', text: "Your item 'Calculus Textbook' has been successfully listed in the Marketplace.", timestamp: { toDate: () => new Date(Date.now() - 172800000) } }
  ],
  'dummy_4': [
    { id: 'm9', senderId: 'user_4', text: "Hey! I'm interested in the bike you listed. Is the price negotiable?", timestamp: { toDate: () => new Date(Date.now() - 11000000) } },
    { id: 'm10', senderId: 'me', text: "Hi Jordan! I could go down a bit if you can pick it up today.", timestamp: { toDate: () => new Date(Date.now() - 10900000) } },
    { id: 'm11', senderId: 'user_4', text: "I can definitely do that. Where should we meet?", timestamp: { toDate: () => new Date(Date.now() - 10800000) } }
  ]
};

const ChatView = ({ user, initialChatId }: { user: any, initialChatId?: string | null }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const conversationsQuery = query(
      collection(db, "conversations"),
      where("participants", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
      const realConvs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConversations(realConvs);
      
      // Select the initial chat if provided, or the first one if none is selected
      if (initialChatId) {
        const initialConv = realConvs.find(c => c.id === initialChatId);
        if (initialConv) {
          setSelectedConversation(initialConv);
        }
      } else if (realConvs.length > 0 && !selectedConversation) {
        setSelectedConversation(realConvs[0]);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "conversations");
    });

    return () => unsubscribe();
  }, [user, initialChatId]);

  useEffect(() => {
    if (!selectedConversation) return;

    const messagesQuery = query(
      collection(db, `conversations/${selectedConversation.id}/messages`),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      
      // Scroll to bottom
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `conversations/${selectedConversation.id}/messages`);
    });

    return () => unsubscribe();
  }, [selectedConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const messageText = newMessage.trim();
    setNewMessage("");

    try {
      const messageData = {
        conversationId: selectedConversation.id,
        senderId: user.uid,
        text: messageText,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, `conversations/${selectedConversation.id}/messages`), messageData);
      
      // Update last message in conversation
      await updateDoc(doc(db, "conversations", selectedConversation.id), {
        lastMessage: messageText,
        lastMessageTimestamp: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `conversations/${selectedConversation.id}/messages`);
    }
  };

  const getOtherParticipantName = (conv: any) => {
    if (!conv.participantNames) return "Unknown User";
    const otherId = conv.participants.find((id: string) => id !== user.uid);
    return conv.participantNames[otherId] || "Unknown User";
  };

  const filteredConversations = conversations.filter(conv => 
    getOtherParticipantName(conv).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader title="Campus Chat" subtitle="Direct communication with buyers, sellers, and finders." />
      
      <div className="flex-1 flex gap-6 overflow-hidden">
        <Card className="w-80 hidden lg:flex flex-col p-0 border-white/5 bg-black/20">
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
              <Input 
                className="bg-white/5 border-white/5 pl-10 rounded-xl h-10 text-sm" 
                placeholder="Search chats..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="size-8 text-white/10 mx-auto mb-2" />
                <p className="text-xs text-white/20">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => setSelectedConversation(chat)}
                  className={cn(
                    "p-4 flex items-center gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors",
                    selectedConversation?.id === chat.id && "bg-white/5 border-r-2 border-white"
                  )}
                >
                  <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <User className="size-6 text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-sm font-bold text-white truncate">{getOtherParticipantName(chat)}</h4>
                      <span className="text-[10px] text-white/20">
                        {chat.lastMessageTimestamp?.toDate ? chat.lastMessageTimestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 truncate">{chat.lastMessage || "No messages yet"}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="flex-1 flex flex-col p-0 overflow-hidden border-white/5 bg-black/20">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <User className="size-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{getOtherParticipantName(selectedConversation)}</h4>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Active Chat</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="text-white/20 hover:text-white"><Phone className="size-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-white/20 hover:text-white"><Settings className="size-4" /></Button>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20">
                    <MessageSquare className="size-12 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">Start the conversation</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.senderId === user.uid;
                    return (
                      <div key={msg.id || i} className={cn("flex gap-4", isMe && "justify-end")}>
                        {!isMe && (
                          <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                            <User className="size-5 text-white/40" />
                          </div>
                        )}
                        <div className={cn(
                          "rounded-2xl p-4 max-w-[70%] border",
                          isMe 
                            ? "bg-white text-black border-white rounded-tr-none" 
                            : "bg-white/5 text-white/80 border-white/5 rounded-tl-none"
                        )}>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <span className={cn(
                            "text-[8px] mt-1 block opacity-40",
                            isMe ? "text-black" : "text-white"
                          )}>
                            {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5 bg-white/[0.02]">
                <div className="relative">
                  <Input 
                    className="h-14 bg-black/40 border-white/10 rounded-2xl pl-6 pr-14 text-white" 
                    placeholder="Type a message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button 
                    type="submit"
                    size="icon" 
                    disabled={!newMessage.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-50"
                  >
                    <Send className="size-5" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-20">
              <MessageSquare className="size-20 mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">No Chat Selected</h3>
              <p className="text-sm max-w-xs">Select a conversation from the list to start messaging.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const SettingsView = ({ profile }: { profile: any }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <SectionHeader title="Settings" subtitle="View your account details and security" />
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-6">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Full Name</Label>
              <Input className="bg-white/5 border-white/5 rounded-xl h-12 text-white/60" value={profile?.displayName || "N/A"} readOnly />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Email Address</Label>
              <Input className="bg-white/5 border-white/5 rounded-xl h-12 text-white/60" value={profile?.email || "N/A"} readOnly />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Role</Label>
              <Input className="bg-white/5 border-white/5 rounded-xl h-12 text-white/60 capitalize" value={profile?.role || "user"} readOnly />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">User ID</Label>
              <Input className="bg-white/5 border-white/5 rounded-xl h-12 text-white/60" value={profile?.uid || "N/A"} readOnly />
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

// --- Main Dashboard Component ---

export default function Dashboard() {
  const { user, profile, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [marketplaceItems, setMarketplaceItems] = useState<any[]>([]);
  const [lostFoundItems, setLostFoundItems] = useState<any[]>([]);
  const [meetups, setMeetups] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Real-time listener for Marketplace
    const marketplaceQuery = query(collection(db, "marketplace"), orderBy("createdAt", "desc"));
    const unsubscribeMarketplace = onSnapshot(marketplaceQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMarketplaceItems(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "marketplace");
    });

    // Real-time listener for Lost & Found
    const lostFoundQuery = query(collection(db, "lostfound"), orderBy("createdAt", "desc"));
    const unsubscribeLostFound = onSnapshot(lostFoundQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLostFoundItems(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "lostfound");
    });

    // Real-time listener for Meetups
    const meetupsQuery = query(collection(db, "meetups"), orderBy("time", "asc"));
    const unsubscribeMeetups = onSnapshot(meetupsQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Filter meetups where user is either buyer or seller
      const userMeetups = items.filter((m: any) => m.buyerId === user.uid || m.sellerId === user.uid);
      setMeetups(userMeetups);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "meetups");
    });

    return () => {
      unsubscribeMarketplace();
      unsubscribeLostFound();
      unsubscribeMeetups();
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const startChat = async (otherUserId: string, otherUserName: string, itemId?: string) => {
    if (!user) return;
    
    try {
      // Check if conversation exists
      const q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", user.uid)
      );
      
      const snapshot = await getDocs(collection(db, "conversations")); // Simple fetch for now, or use the query
      // Better query: where participants contains user.uid AND participants contains otherUserId
      // Firestore doesn't support multiple array-contains. 
      // We can filter client-side or use a composite key.
      
      const conversations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      let conversation = conversations.find(c => c.participants.includes(user.uid) && c.participants.includes(otherUserId));
      
      if (!conversation) {
        // Create new conversation
        const newConv = {
          participants: [user.uid, otherUserId],
          participantNames: {
            [user.uid]: profile?.displayName || user.displayName || "User",
            [otherUserId]: otherUserName
          },
          updatedAt: serverTimestamp(),
          lastMessage: "Started a new chat",
          lastMessageTimestamp: serverTimestamp(),
          itemId: itemId || null
        };
        const docRef = await addDoc(collection(db, "conversations"), newConv);
        setSelectedChatId(docRef.id);
      } else {
        setSelectedChatId(conversation.id);
      }
      
      setActiveSection("Chat");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "conversations");
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Dashboard": 
        return <DashboardView setActiveSection={setActiveSection} marketplaceItems={marketplaceItems} lostFoundItems={lostFoundItems} meetups={meetups} startChat={startChat} />;
      case "Marketplace": 
        return <MarketplaceView setActiveSection={setActiveSection} items={marketplaceItems} startChat={startChat} />;
      case "Lost & Found": 
        return <LostFoundView setActiveSection={setActiveSection} items={lostFoundItems} startChat={startChat} />;
      case "Trust System": 
        return <TrustSystemView profile={profile} />;
      case "Insights": 
        return <InsightsView marketplaceItems={marketplaceItems} lostFoundItems={lostFoundItems} />;
      case "Meetups": 
        return <MeetupView setActiveSection={setActiveSection} meetups={meetups} />;
      case "Chat": 
        return <ChatView user={user} initialChatId={selectedChatId} />;
      case "Settings": 
        return <SettingsView profile={profile} />;
      default: 
        return <DashboardView setActiveSection={setActiveSection} marketplaceItems={marketplaceItems} lostFoundItems={lostFoundItems} meetups={meetups} startChat={startChat} />;
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
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-secondary hover:text-red-400 hover:bg-red-500/5 transition-all group"
          >
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
            <h1 className="text-xl font-bold text-white tracking-tight">Welcome back, {profile?.displayName || "Student"}</h1>
            <p className="text-xs text-secondary font-medium">You have {marketplaceItems.filter(i => i.status === 'available').length} active listings.</p>
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
              <div className="size-full rounded-[11px] bg-black flex items-center justify-center overflow-hidden">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt={profile.displayName} className="size-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="size-5 text-white" />
                )}
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
