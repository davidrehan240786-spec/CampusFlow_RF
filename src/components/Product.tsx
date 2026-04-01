import { Link } from "react-router-dom";
import { MessageSquare, Shield, Zap, ShoppingBag, Send, Search, Heart, MapPin, Package, RefreshCcw, CheckCircle, UserCheck } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

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
