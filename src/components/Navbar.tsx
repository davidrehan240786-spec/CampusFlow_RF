import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HoverAnimationButton from "@/components/ui/hover-animation-button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-center transition-all duration-300 ${
        isScrolled 
          ? "bg-black/80 backdrop-blur-md border-b border-white/5" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] w-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-full" />
          </div>
          <span className="font-bold text-lg tracking-tight">CampusFlow</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {[
            { label: "About", to: "/#about" },
            { label: "Features", to: "/#features" },
            { label: "FAQs", to: "/#faqs" },
            { label: "Contact", to: "/#contact" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-4 py-2 rounded-full text-[14px] font-medium text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <HoverAnimationButton 
            onClick={() => navigate("/signup")}
            className="!p-0"
          >
            Get Started
          </HoverAnimationButton>
        </div>
      </div>
    </nav>
  );
}
