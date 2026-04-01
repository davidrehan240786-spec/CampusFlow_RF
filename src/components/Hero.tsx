import { MessageSquare, ShoppingBag, Search, ShieldCheck, MapPin, Zap, Users, Wind, BarChart2 } from "lucide-react";
import Orb from "./ui/Orb";
import { Link } from "react-router-dom";

const icons = [
  { Icon: ShoppingBag, color: "text-yellow-400" },
  { Icon: Search, color: "text-red-400" },
  { Icon: ShieldCheck, color: "text-emerald-400" },
  { Icon: MapPin, color: "text-indigo-400" },
  { Icon: Zap, color: "text-orange-400" },
  { Icon: Users, color: "text-pink-400" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-40 pb-20 flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Orb Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Orb
          hoverIntensity={2}
          rotateOnHover
          hue={360}
          forceHoverState={false}
          backgroundColor="#000000"
        />
      </div>

      {/* Floating Elements - Left */}
      <div className="absolute left-[10%] top-[30%] hidden lg:block">
        {/* Colorful background glow */}
        <div className="absolute -inset-20 bg-indigo-500/10 blur-[100px] rounded-full animate-pulse" />
        
        <div className="glass p-4 rounded-2xl w-64 mb-6 animate-float relative border-indigo-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="h-2 w-24 bg-white/10 rounded-full" />
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full mb-2" />
          <div className="h-2 w-2/3 bg-white/5 rounded-full" />
        </div>

        <div className="glass p-4 rounded-2xl w-56 ml-12 animate-float [animation-delay:1s] relative border-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Wind className="w-4 h-4 text-blue-400" />
            </div>
            <div className="h-2 w-20 bg-white/10 rounded-full" />
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full" />
        </div>
      </div>

      {/* Floating Elements - Right */}
      <div className="absolute right-[10%] top-[25%] hidden lg:block">
        {/* Colorful background glow */}
        <div className="absolute -inset-20 bg-emerald-500/10 blur-[100px] rounded-full animate-pulse [animation-delay:1s]" />

        <div className="glass p-4 rounded-2xl w-72 mb-6 animate-float [animation-delay:0.5s] relative border-emerald-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="h-2 w-32 bg-white/10 rounded-full" />
          </div>
          <div className="flex items-end gap-2 h-12">
            {[40, 70, 50, 90, 60, 80].map((h, i) => (
              <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        <div className="glass p-4 rounded-2xl w-48 mr-12 animate-float [animation-delay:1.5s] relative border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-purple-400" />
            </div>
            <div className="h-2 w-16 bg-white/10 rounded-full" />
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full mb-2" />
          <div className="h-2 w-3/4 bg-white/5 rounded-full" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="max-w-[1000px] w-full px-6 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-indigo-500/30 text-[13px] font-medium text-white/60 mb-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex -space-x-2 relative z-10">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-6 h-6 rounded-full border-2 border-black bg-zinc-800 ${i === 1 ? 'bg-indigo-500/20' : i === 2 ? 'bg-emerald-500/20' : 'bg-purple-500/20'}`} />
            ))}
          </div>
          <span className="relative z-10">10,000+ verified students joined</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.1] mb-8 text-white max-w-4xl">
          Campus Marketplace & Recovery Platform.
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
          Buy, sell, and recover lost items with CampusFlow. The most trusted student network for campus essentials.
        </p>
      </div>

      {/* Bottom Icons */}
      <div className="mt-32 flex justify-center gap-6 md:gap-10">
        {icons.map(({ Icon, color }, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer"
          >
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

