import { Link } from "react-router-dom";
import { MessageSquare, Shield, Zap, ShoppingBag, Send, Search, Heart, MapPin, Package, RefreshCcw, CheckCircle, UserCheck, ChevronRight } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export default function Product() {
  const marketplaceCategories = [
    { icon: <Package className="w-4 h-4" />, label: "Textbooks" },
    { icon: <Zap className="w-4 h-4" />, label: "Electronics" },
    { icon: <ShoppingBag className="w-4 h-4" />, label: "Dorm Decor" },
    { icon: <RefreshCcw className="w-4 h-4" />, label: "Lost & Found" },
    { icon: <Heart className="w-4 h-4" />, label: "Clothing" },
    { icon: <MapPin className="w-4 h-4" />, label: "Campus Meetups" },
  ];

  const matchCards = [
    { 
      date: "Found: 2h ago", 
      label: "Blue Hydroflask", 
      color: "bg-emerald-400/20", 
      icon: <CheckCircle className="text-emerald-400" />,
      data: [
        { v: 80 }, { v: 85 }, { v: 90 }, { v: 92 }, { v: 95 }
      ],
      chartColor: "#10b981",
      match: "95% Match"
    },
    { 
      date: "Lost: Yesterday", 
      label: "Sony Headphones", 
      color: "bg-blue-400/20", 
      icon: <Search className="text-blue-400" />, 
      active: true,
      data: [
        { v: 40 }, { v: 60 }, { v: 75 }, { v: 82 }, { v: 88 }
      ],
      chartColor: "#60a5fa",
      match: "88% Match"
    },
  ];

  return (
    <section className="py-32 px-6 space-y-40">
      <div className="max-w-[1200px] mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[12px] font-medium text-white/50 mb-6 uppercase tracking-wider">
          ● How it works
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-20">The CampusFlow Experience</h2>

        {/* Direct Campus Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center animate-on-scroll">
          <div className="glass p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-6">
              <div className="flex justify-end">
                <div className="glass px-6 py-4 rounded-[2rem] rounded-tr-none text-[14px] max-w-[80%]">
                  Hey! Is the Calculus textbook still available? 📚
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white/10 px-6 py-4 rounded-[2rem] rounded-tl-none text-[14px] max-w-[80%] text-white/60">
                  Yes, it is! I can meet at the Library Cafe today.
                </div>
              </div>
              <div className="pt-8 flex gap-3">
                <div className="flex-1 glass px-6 py-4 rounded-full text-[14px] text-white/30 flex items-center justify-between">
                  Type a message...
                  <Send className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center mb-8">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-4xl font-bold mb-6">Direct Campus Chat</h3>
            <p className="text-lg text-brand-text-secondary leading-relaxed mb-8">
              Connect instantly with buyers, sellers, and finders. Our secure chat system lets you coordinate meetups and ask questions in real-time.
            </p>
            <Link to="/dashboard" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-all">
              Start Chatting
              <Send className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Campus Inventory */}
      <div className="max-w-[1200px] mx-auto animate-on-scroll">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center mb-8">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-4xl font-bold mb-6">Everything Campus</h3>
            <p className="text-lg text-brand-text-secondary leading-relaxed">
              From textbooks to dorm decor, browse thousands of items listed by your fellow students.
            </p>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            {marketplaceCategories.map((cat, i) => (
              <div key={i} className="glass p-6 rounded-[2rem] flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <span className="text-[13px] font-medium text-white/60">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Campus Marketplace Preview */}
      <div className="max-w-[1200px] mx-auto animate-on-scroll">
        <div className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[12px] font-medium text-white/50 mb-6 uppercase tracking-wider">
          ● Live Marketplace
        </div>
        <h3 className="text-4xl font-bold mb-12">Featured Campus Listings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Calculus Textbook", price: "$45", category: "Books", image: "https://picsum.photos/seed/book/400/400", tag: "Urgent" },
            { name: "Sony Headphones", price: "$180", category: "Electronics", image: "https://picsum.photos/seed/sony/400/400", tag: "Verified" },
            { name: "Dorm Desk Lamp", price: "$15", category: "Dorm", image: "https://picsum.photos/seed/lamp/400/400", tag: "New" },
            { name: "Electric Scooter", price: "$250", category: "Electronics", image: "https://picsum.photos/seed/scooter/400/400", tag: "Trending" },
          ].map((item, i) => (
            <div key={i} className="glass rounded-[2.5rem] overflow-hidden group hover:border-white/20 transition-all">
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-white/80 border border-white/10">
                    {item.tag}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{item.category}</span>
                  <span className="text-lg font-bold text-white">{item.price}</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-4 line-clamp-1">{item.name}</h4>
                <Link to="/dashboard" className="w-full py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-[12px] font-bold uppercase tracking-widest text-white/60 hover:bg-white hover:text-black transition-all">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Matching */}
      <div className="max-w-[1200px] mx-auto animate-on-scroll">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar">
            {matchCards.map((card, i) => (
              <div 
                key={i} 
                className={`flex-shrink-0 w-64 glass p-8 rounded-[3rem] transition-all duration-500 relative overflow-hidden ${card.active ? 'scale-110 border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)]' : 'opacity-40 scale-95'}`}
              >
                <div className="text-[12px] text-white/40 mb-8 uppercase tracking-widest">{card.date}</div>
                <div className={`w-20 h-20 rounded-full ${card.color} flex items-center justify-center mb-8 mx-auto`}>
                  {card.icon}
                </div>
                <div className="h-20 w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={card.data}>
                      <Line 
                        type="monotone" 
                        dataKey="v" 
                        stroke={card.chartColor} 
                        strokeWidth={2} 
                        dot={false}
                        className="animate-dash-line"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold mb-2">{card.label}</div>
                  <p className="text-[13px] text-emerald-400 font-medium">{card.match}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center mb-8">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <h3 className="text-4xl font-bold mb-6">Smart Recovery System</h3>
            <p className="text-lg text-brand-text-secondary leading-relaxed">
              Our system analyzes descriptions, photos, and locations to find matches for your lost items. Get notified the moment a match is found.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Lost & Found Preview */}
      <div className="max-w-[1200px] mx-auto animate-on-scroll">
        <div className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[12px] font-medium text-white/50 mb-6 uppercase tracking-wider">
          ● Recent Reports
        </div>
        <h3 className="text-4xl font-bold mb-12">Lost & Found Activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Blue Hydroflask", location: "Library", status: "Match Found", time: "2h ago", icon: <CheckCircle className="w-5 h-5 text-emerald-400" /> },
            { name: "Keys with Red Keychain", location: "Gym", status: "Reported Lost", time: "5h ago", icon: <Search className="w-5 h-5 text-blue-400" /> },
            { name: "MacBook Pro Charger", location: "Cafeteria", status: "Match Found", time: "Yesterday", icon: <CheckCircle className="w-5 h-5 text-emerald-400" /> },
          ].map((item, i) => (
            <div key={i} className="glass p-8 rounded-[3rem] group hover:border-white/20 transition-all">
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{item.time}</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">{item.name}</h4>
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/40">Location</span>
                  <span className="text-sm font-medium text-white/80">{item.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/40">Status</span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                    item.status === "Match Found" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  )}>
                    {item.status}
                  </span>
                </div>
              </div>
              <Link to="/dashboard" className="flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                View Details <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Safety */}
      <div className="max-w-[1200px] mx-auto animate-on-scroll">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center mb-8">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-4xl font-bold mb-6">Trust & Safety First</h3>
            <p className="text-lg text-brand-text-secondary leading-relaxed">
              Every user is verified via their student email. Trust scores and secure meetup locations ensure every transaction is safe.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { label: "Verified Student Badge", icon: <UserCheck className="w-5 h-5 text-emerald-400" /> },
              { label: "Secure Meetup Spots", icon: <MapPin className="w-5 h-5 text-blue-400" /> },
              { label: "Trust Score System", icon: <Shield className="w-5 h-5 text-purple-400" /> }
            ].map((tool, i) => (
              <div key={i} className="glass p-8 rounded-[2rem] flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl glass flex items-center justify-center group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <span className="text-xl font-bold opacity-80">{tool.label}</span>
                </div>
                <div className="w-10 h-10 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Send className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
