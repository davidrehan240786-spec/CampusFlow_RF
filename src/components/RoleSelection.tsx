import { motion } from "motion/react";
import { User, Shield, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Orb from "./ui/Orb";

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role: "patient" | "doctor") => {
    // Navigate to login and pass the role
    navigate("/login", { state: { role } });
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden selection:bg-white selection:text-black">
      {/* Orb Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Orb
          hoverIntensity={1.5}
          rotateOnHover
          hue={280}
          forceHoverState={false}
          backgroundColor="#000000"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1000px] px-6 py-20 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="size-5 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">CampusFlow</span>
          </Link>
        </motion.div>

        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white"
          >
            Who are you?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-xl mx-auto"
          >
            Select your role to continue your campus journey.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Student Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            onClick={() => handleRoleSelect("patient")}
            className="group relative glass p-10 md:p-12 rounded-[3rem] cursor-pointer hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <ArrowRight className="w-6 h-6 text-white/40 group-hover:translate-x-1 transition-transform" />
            </div>
            
            <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
              <User className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-4xl font-bold mb-6 text-white">Student</h3>
            <p className="text-lg text-zinc-400 leading-relaxed mb-10">
              Access the marketplace, report lost items, and connect with other students.
            </p>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-sm group-hover:bg-white/90 transition-colors">
              Continue as Student
            </div>
          </motion.div>

          {/* Staff Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => handleRoleSelect("doctor")}
            className="group relative glass p-10 md:p-12 rounded-[3rem] cursor-pointer hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <ArrowRight className="w-6 h-6 text-white/40 group-hover:translate-x-1 transition-transform" />
            </div>

            <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
              <Shield className="w-10 h-10 text-white" />
            </div>
 
            <h3 className="text-4xl font-bold mb-6 text-white">Staff</h3>
            <p className="text-lg text-zinc-400 leading-relaxed mb-10">
              Manage campus listings, verify student identities, and oversee lost & found.
            </p>
 
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border-white/10 text-white font-bold text-sm group-hover:bg-white/10 transition-colors">
              Continue as Staff
            </div>
          </motion.div>
        </div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 text-zinc-500 text-sm"
        >
          Already have an account? <Link to="/login" className="text-white hover:underline">Log in here</Link>
        </motion.div>
      </div>
    </div>
  );
}
