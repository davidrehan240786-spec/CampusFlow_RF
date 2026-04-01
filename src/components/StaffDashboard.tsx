import * as React from "react";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  AlertTriangle, 
  Bot, 
  Activity, 
  AlertCircle, 
  MessageSquare, 
  Settings,
  Bell,
  Search,
  Plus,
  ChevronRight,
  Send,
  Phone,
  Shield,
  Clock,
  Heart,
  Thermometer,
  Droplets,
  User,
  Menu,
  X,
  LogOut,
  ArrowLeft,
  Download,
  StickyNote,
  Star,
  Zap
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, 
  Line, 
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
import { SearchBar } from "@/components/ui/search-bar";
import { useToast } from "@/lib/toast-context";


import { db, handleFirestoreError, OperationType } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

// --- Types ---

type Section = 
  | "Dashboard" 
  | "Students"
  | "Listings" 
  | "Activity"
  | "Meetups" 
  | "Chat" 
  | "Settings";

interface NavItem {
  label: Section;
  icon: React.ElementType;
}

// --- Mock Data ---

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Students", icon: Users },
  { label: "Listings", icon: FileText },
  { label: "Activity", icon: Activity },
  { label: "Meetups", icon: Clock },
  { label: "Chat", icon: MessageSquare },
  { label: "Settings", icon: Settings },
];

const STUDENTS = [
  { id: "S1", name: "Sarah Johnson", major: "Computer Science", lastActive: "2 days ago", status: "Active", trustScore: 94 },
  { id: "S2", name: "Michael Chen", major: "Business", lastActive: "5 hours ago", status: "Flagged", trustScore: 62 },
  { id: "S3", name: "Emma Wilson", major: "Design", lastActive: "1 day ago", status: "Active", trustScore: 88 },
  { id: "S4", name: "James Miller", major: "Engineering", lastActive: "3 days ago", status: "Inactive", trustScore: 75 },
];

const ACTIVITY_DATA = [
  { time: "00:00", listings: 12, meetups: 5, reports: 2 },
  { time: "04:00", listings: 8, meetups: 2, reports: 0 },
  { time: "08:00", listings: 25, meetups: 10, reports: 1 },
  { time: "12:00", listings: 45, meetups: 22, reports: 4 },
  { time: "16:00", listings: 38, meetups: 18, reports: 3 },
  { time: "20:00", listings: 20, meetups: 12, reports: 1 },
];

const RECENT_ACTIVITY = [
  { id: 1, action: "Verified Listing", student: "Sarah Johnson", time: "2 hours ago", icon: Shield, color: "text-blue-500" },
  { id: 2, action: "Resolved Report", student: "Michael Chen", time: "5 hours ago", icon: AlertTriangle, color: "text-orange-500" },
  { id: 3, action: "Approved Meetup", student: "Emma Wilson", time: "1 day ago", icon: Clock, color: "text-emerald-500" },
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

const NavItemComponent = ({ item, activeSection, setActiveSection }: { item: NavItem, activeSection: Section, setActiveSection: (s: Section) => void }) => {
  return (
    <button
      onClick={() => setActiveSection(item.label)}
      className={cn(
        "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
        activeSection === item.label 
          ? "bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
          : "text-secondary hover:text-white hover:bg-white/5"
      )}
    >
      <item.icon className={cn(
        "size-5 transition-transform group-hover:scale-110",
        activeSection === item.label ? "text-black" : "text-white/40"
      )} />
      <span className="text-sm tracking-tight">{item.label}</span>
    </button>
  );
};

// --- Section Views ---

const DashboardView = ({ setActiveSection }: { setActiveSection: (section: Section) => void }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
            <AlertCircle className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Active Reports</p>
            <p className="text-2xl font-bold text-white tracking-tight">12 Pending</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Users className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Verified Students</p>
            <p className="text-2xl font-bold text-white tracking-tight">1,240 Total</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <FileText className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">New Listings</p>
            <p className="text-2xl font-bold text-white tracking-tight">45 Today</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/40">
            <Activity className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Platform Trust Score</p>
            <p className="text-2xl font-bold text-white tracking-tight">92/100</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white/80 flex items-center gap-2 tracking-tight">
              <Users className="size-5 text-white/40" />
              Recent Students
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STUDENTS.slice(0, 2).map((student) => (
                <Card key={student.id} className={cn(
                  "border-white/10 glass group hover:border-white/20",
                  student.status === "Flagged" && "border-red-500/20 bg-red-500/5"
                )}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "size-10 rounded-xl flex items-center justify-center",
                      student.status === "Flagged" ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white"
                    )}>
                      <User className="size-5" />
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      student.status === "Flagged" ? "text-red-400" : "text-white/40"
                    )}>
                      {student.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white mb-1 tracking-tight">{student.name}</h4>
                  <p className="text-sm text-secondary">{student.major} • {student.lastActive}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          student.trustScore > 80 ? "bg-emerald-500" : student.trustScore > 60 ? "bg-orange-500" : "bg-red-500"
                        )}
                        style={{ width: `${student.trustScore}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-white/40">{student.trustScore}% Trust</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-4 text-white hover:text-white/80 hover:bg-white/5 p-0 h-auto font-bold text-xs uppercase tracking-widest"
                    onClick={() => setActiveSection("Students")}
                  >
                    View Profile <ChevronRight className="size-3 ml-1" />
                  </Button>
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
                          {item.action}
                        </p>
                        <p className="text-xs text-secondary">for {item.student}</p>
                      </div>
                    </div>
                    <span className="text-xs text-white/20 font-medium">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="glass border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start gap-3 h-12 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white font-bold">
                <Shield className="size-4 text-blue-400" /> Verify Student
              </Button>
              <Button className="w-full justify-start gap-3 h-12 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white font-bold">
                <AlertTriangle className="size-4 text-orange-400" /> Review Reports
              </Button>
              <Button className="w-full justify-start gap-3 h-12 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white font-bold">
                <Plus className="size-4 text-emerald-400" /> Post Announcement
              </Button>
            </div>
          </Card>

          <Card className="glass border-white/10 bg-indigo-500/5">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="size-6 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Trust Insights</h3>
            </div>
            <p className="text-sm text-secondary mb-4">Monitor campus trust levels and identify potential marketplace risks automatically.</p>
            <Button 
              variant="outline" 
              className="w-full rounded-xl border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 font-bold"
            >
              Review Analytics
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StudentsView = ({ students }: { students: any[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader 
        title="Student Directory" 
        subtitle="Manage and monitor student activity and trust scores."
        action={
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
              <Input 
                className="bg-white/5 border-white/5 pl-10 rounded-xl h-10 text-sm" 
                placeholder="Search students..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-white text-black hover:bg-white/90 rounded-xl px-6 font-bold">Find Student</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.filter(p => (p.displayName || p.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
          <Card key={student.id} className="group hover:border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-white/10 transition-colors overflow-hidden">
                {student.photoURL ? (
                  <img src={student.photoURL} alt={student.displayName} className="size-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="size-8" />
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-white tracking-tight">{student.displayName || student.name || "Unknown User"}</h4>
                <p className="text-sm text-secondary">ID: {student.id.substring(0, 8)}... • {student.major || "Student"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Last Active</p>
                <p className="text-sm text-white/80 font-medium">{student.lastActive || "Recently"}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Status</p>
                <p className={cn(
                  "text-sm font-bold",
                  student.status === "Flagged" ? "text-red-400" : "text-emerald-400"
                )}>{student.status || "Active"}</p>
              </div>
            </div>
            <Button className="w-full rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white font-bold">
              View Full Profile
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ListingsView = ({ marketplaceItems, lostFoundItems }: { marketplaceItems: any[], lostFoundItems: any[] }) => {
  const allListings = [
    ...marketplaceItems.map(i => ({ ...i, type: 'Sale' })),
    ...lostFoundItems.map(i => ({ ...i, type: i.type === 'lost' ? 'Lost' : 'Found' }))
  ].sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader title="Marketplace Listings" subtitle="Review and moderate campus marketplace items." />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Recent Listings</h3>
              <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white">View All</Button>
            </div>
            <div className="space-y-4">
              {allListings.slice(0, 10).map((listing, i) => (
                <div key={listing.id || i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40 overflow-hidden">
                      {listing.image ? (
                        <img src={listing.image} alt={listing.name} className="size-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <FileText className="size-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{listing.name}</h4>
                      <p className="text-xs text-secondary">{listing.sellerName || listing.reporterName || "User"} • {listing.createdAt?.toDate ? listing.createdAt.toDate().toLocaleDateString() : "Recently"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{listing.type}</span>
                    <Button size="icon" variant="ghost" className="text-white/20 group-hover:text-white">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {allListings.length === 0 && (
                <p className="text-center text-secondary py-10">No listings found.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Moderation Notes</h3>
            <div className="space-y-4">
              <textarea 
                className="w-full h-40 bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-white/80 focus:outline-none focus:border-white/20 resize-none"
                placeholder="Type moderation notes here..."
              />
              <Button className="w-full rounded-xl bg-white text-black font-bold h-12">Save Note</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ChatboxView = () => {
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader title="Campus Support Chat" subtitle="Help students with marketplace issues or lost & found inquiries." />
      
      <div className="flex-1 flex gap-6 overflow-hidden">
        <Card className="flex-1 flex flex-col p-0 overflow-hidden border-white/5 glass">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            <div className="flex gap-4">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Shield className="size-6 text-white" />
              </div>
              <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[80%] border border-white/5">
                <p className="text-white/80 leading-relaxed">Support system active. You can help students with listing verifications, report resolutions, or general campus marketplace questions. Which student needs assistance?</p>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <div className="bg-white text-black rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                <p className="font-medium leading-relaxed">I'm having trouble verifying my student email for the marketplace.</p>
              </div>
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <User className="size-6 text-white" />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Shield className="size-6 text-white" />
              </div>
              <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[80%] border border-white/5">
                <div className="space-y-3">
                  <p className="text-white/80 font-bold">Verification Support for Sarah Johnson:</p>
                  <ul className="text-sm text-white/60 space-y-2 list-disc pl-4">
                    <li>Student email: s.johnson@campus.edu</li>
                    <li className="text-emerald-400 font-bold">Status: Email sent, pending confirmation.</li>
                    <li>Last attempt: 5 minutes ago.</li>
                  </ul>
                  <p className="text-xs text-white/40 italic mt-2">Action: Resend verification link or manually verify if student provides ID.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/5 bg-white/[0.02]">
            <div className="flex gap-4 mb-4 overflow-x-auto no-scrollbar">
              {["Resend Verification", "Manual Verify", "Check Trust Score", "View Reports"].map((prompt) => (
                <button key={prompt} className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white hover:bg-white/10 transition-all">
                  {prompt}
                </button>
              ))}
            </div>
            <div className="relative">
              <Input className="h-14 bg-black/40 border-white/10 rounded-2xl pl-6 pr-14 text-white" placeholder="Type a message to the student..." />
              <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-white text-black hover:bg-white/90">
                <Send className="size-5" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="w-80 hidden xl:flex flex-col p-6 border-white/5 glass">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Support Tools</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h4 className="text-sm font-bold text-white mb-2">ID Verifier</h4>
              <p className="text-xs text-secondary leading-relaxed">Check student ID uploads for manual verification.</p>
              <Button variant="outline" className="w-full mt-4 rounded-lg border-white/10 bg-white/5 text-xs font-bold">Launch Tool</Button>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h4 className="text-sm font-bold text-white mb-2">Report Manager</h4>
              <p className="text-xs text-secondary leading-relaxed">Review and resolve marketplace dispute reports.</p>
              <Button variant="outline" className="w-full mt-4 rounded-lg border-white/10 bg-white/5 text-xs font-bold">Launch Tool</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ActivityView = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader title="Platform Activity" subtitle="Real-time monitoring of campus marketplace and recovery analytics." />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-indigo-500/20 bg-indigo-500/5">
          <div className="flex items-center justify-between mb-4">
            <div className="size-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Activity className="size-6" />
            </div>
            <span className="text-xs font-bold text-indigo-400">+12%</span>
          </div>
          <p className="text-3xl font-bold text-white">850 <span className="text-sm font-medium text-white/40">Items</span></p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">Total Listings</p>
        </Card>
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center justify-between mb-4">
            <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="size-6" />
            </div>
            <span className="text-xs font-bold text-emerald-400">Stable</span>
          </div>
          <p className="text-3xl font-bold text-white">95 <span className="text-sm font-medium text-white/40">%</span></p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">Trust Score</p>
        </Card>
        <Card className="border-purple-500/20 bg-purple-500/5">
          <div className="flex items-center justify-between mb-4">
            <div className="size-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap className="size-6" />
            </div>
            <span className="text-xs font-bold text-purple-400">High</span>
          </div>
          <p className="text-3xl font-bold text-white">120 <span className="text-sm font-medium text-white/40">Matches</span></p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">L&F Matches</p>
        </Card>
        <Card className="border-blue-500/20 bg-blue-500/5">
          <div className="flex items-center justify-between mb-4">
            <div className="size-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="size-6" />
            </div>
            <span className="text-xs font-bold text-blue-400">Active</span>
          </div>
          <p className="text-3xl font-bold text-white">2.4k <span className="text-sm font-medium text-white/40">Users</span></p>
          <p className="text-xs text-white/40 mt-1">Active Students</p>
        </Card>
      </div>

      <Card className="h-[400px] p-6 glass border-white/10">
        <h3 className="text-lg font-bold text-white mb-6">Platform Activity History</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ACTIVITY_DATA}>
            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
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
            <Area type="monotone" dataKey="listings" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorActivity)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

const ChatView = () => {
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader title="Student Messages" subtitle="Communicate with students regarding marketplace listings and meetups." />
      
      <div className="flex-1 flex gap-6 overflow-hidden">
        <Card className="w-80 hidden lg:flex flex-col p-0 border-white/5">
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
              <Input className="bg-white/5 border-white/5 pl-10 rounded-xl h-10 text-sm" placeholder="Search students..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {[
              { name: "Sarah Johnson", last: "Is the textbook still available?", time: "10:24 AM", active: true },
              { name: "Michael Chen", last: "I found your keys!", time: "Yesterday", active: false },
              { name: "Emma Wilson", last: "Where should we meet?", time: "Mon", active: false },
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
                <h4 className="font-bold text-white text-sm">Sarah Johnson</h4>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Student • Online</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="text-white/20 hover:text-white"><Phone className="size-4" /></Button>
              <Button size="icon" variant="ghost" className="text-white/20 hover:text-white"><Settings className="size-4" /></Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            <div className="flex gap-4 justify-end">
              <div className="bg-white text-black rounded-2xl rounded-tr-none p-4 max-w-[70%]">
                <p className="text-sm font-medium leading-relaxed">Hello Sarah, I've verified your listing for the Calculus textbook. It's now live on the marketplace.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <User className="size-5 text-white/40" />
              </div>
              <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[70%] border border-white/5">
                <p className="text-sm text-white/80 leading-relaxed">Thank you! When is the best time to meet for the exchange?</p>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <div className="bg-white text-black rounded-2xl rounded-tr-none p-4 max-w-[70%]">
                <p className="text-sm font-medium leading-relaxed">I'll be at the Student Center tomorrow at 2 PM. Does that work for you?</p>
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
};

const SettingsView = ({ profile }: { profile: any }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader title="Settings" subtitle="View your account and platform details." />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-white mb-6">Staff Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Full Name</Label>
                <Input className="bg-white/5 border-white/5 rounded-xl h-12 text-white/60" value={profile?.displayName || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Role</Label>
                <Input className="bg-white/5 border-white/5 rounded-xl h-12 text-white/60 capitalize" value={profile?.role || "staff"} readOnly />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Email</Label>
                <Input className="bg-white/5 border-white/5 rounded-xl h-12 text-white/60" value={profile?.email || "N/A"} readOnly />
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
};

// --- Main Dashboard Component ---

export default function StaffDashboard() {
  const { logout, user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [students, setStudents] = useState<any[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<any[]>([]);
  const [lostFoundItems, setLostFoundItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Real-time listeners for Staff
    const studentsQuery = query(collection(db, "users"), limit(50));
    const marketplaceQuery = query(collection(db, "marketplace"), orderBy("createdAt", "desc"), limit(50));
    const lostFoundQuery = query(collection(db, "lostfound"), orderBy("createdAt", "desc"), limit(50));

    const unsubscribeStudents = onSnapshot(studentsQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "users");
    });

    const unsubscribeMarketplace = onSnapshot(marketplaceQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMarketplaceItems(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "marketplace");
    });

    const unsubscribeLostFound = onSnapshot(lostFoundQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLostFoundItems(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "lostfound");
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribeStudents();
      unsubscribeMarketplace();
      unsubscribeLostFound();
    };
  }, []);

  const getNavLabel = (label: Section) => {
    return label;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderContent = () => {
    const studentsToUse = students;
    const marketplaceToUse = marketplaceItems;
    const lostFoundToUse = lostFoundItems;

    switch (activeSection) {
      case "Dashboard": return <DashboardView setActiveSection={setActiveSection} />;
      case "Students": return <StudentsView students={studentsToUse} />;
      case "Listings": return <ListingsView marketplaceItems={marketplaceToUse} lostFoundItems={lostFoundToUse} />;
      case "Activity": return <ActivityView />;
      case "Meetups": return <div className="p-12 text-center text-secondary">Meetups Management Coming Soon</div>;
      case "Chat": return <ChatView />;
      case "Settings": return <SettingsView profile={profile} />;
      default: return <DashboardView setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 glass border-r border-white/5 hidden lg:flex flex-col z-50">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="size-5 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">CampusFlow</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveSection(item.label)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                activeSection === item.label 
                  ? "bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                  : "text-secondary hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "size-5 transition-transform group-hover:scale-110",
                activeSection === item.label ? "text-black" : "text-white/40"
              )} />
              <span className="text-sm tracking-tight">{getNavLabel(item.label)}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                <User className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Staff Member</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Logged in as Staff</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 p-0 h-auto text-red-400/60 hover:text-red-400 hover:bg-transparent font-bold text-xs uppercase tracking-widest"
              onClick={handleLogout}
            >
              <LogOut className="size-4" /> Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[60] lg:hidden transition-all duration-300 px-6 py-4",
        scrolled ? "glass border-b border-white/5 py-3" : "bg-transparent"
      )}>
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Shield className="size-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">CampusFlow</span>
          </Link>
          <Button 
            size="icon" 
            variant="ghost" 
            className="text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-black border-r border-white/10 z-[80] lg:hidden flex flex-col"
            >
              <div className="p-8 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                  <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Shield className="size-5 text-white" />
                  </div>
                  <span className="font-bold text-2xl tracking-tight">CampusFlow</span>
                </Link>
                <Button size="icon" variant="ghost" onClick={() => setIsSidebarOpen(false)}>
                  <X className="size-6" />
                </Button>
              </div>
              <nav className="flex-1 px-4 py-4 space-y-2">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveSection(item.label);
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all",
                      activeSection === item.label 
                        ? "bg-white text-black font-bold" 
                        : "text-secondary hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="size-6" />
                    <span className="text-base">{getNavLabel(item.label)}</span>
                  </button>
                ))}
              </nav>
              <div className="p-6 border-t border-white/5">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-4 text-red-400 font-bold"
                  onClick={() => navigate("/login")}
                >
                  <LogOut className="size-6" /> Logout
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen p-6 lg:p-12 pt-24 lg:pt-12">
        <div className="max-w-6xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-12">
            <div className="hidden lg:block">
              <h1 className="text-4xl font-bold tracking-tighter text-white">Staff Dashboard</h1>
              <p className="text-secondary mt-1 font-medium">Welcome back. Here's your campus overview.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                <Input className="bg-white/5 border-white/5 pl-10 rounded-xl w-64 h-10 text-sm" placeholder="Search students..." />
              </div>
              <Button size="icon" variant="ghost" className="relative text-white/40 hover:text-white">
                <Bell className="size-6" />
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-black" />
              </Button>
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                <User className="size-6 text-white" />
              </div>
            </div>
          </div>

          {/* Section Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] size-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
