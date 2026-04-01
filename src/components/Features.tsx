import { ShoppingBag, Search, ShieldCheck } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "Campus Marketplace",
      description: "Buy and sell textbooks, electronics, and dorm essentials within your verified student network."
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Lost & Found",
      description: "Report lost items and get instant matches when someone finds them. Our system matches descriptions and locations."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Student Trust System",
      description: "Every user is a verified student. Secure meetups and trust scores ensure a safe campus experience."
    }
  ];

  return (
    <section className="py-32 px-6" id="features">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[12px] font-medium text-white/50 mb-6 uppercase tracking-wider">
            ● Features
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight">Built for Student Life</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group glass p-10 rounded-[2.5rem] hover:-translate-y-[6px] hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all duration-300 relative overflow-hidden animate-on-scroll"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-3xl font-bold mb-4">{f.title}</h3>
              <p className="text-brand-text-secondary leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
