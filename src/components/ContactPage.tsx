import { Contact2 } from "@/components/ui/contact-2";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-bg-top">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 pt-32">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Contact2 
          title="Contact Support"
          description="Have a question about MediFlow? Our support team is here to help you manage your health data securely."
          phone="+1 (555) 012-3456"
          email="support@mediflow.com"
          web={{ label: "mediflow.com", url: "https://mediflow.com" }}
        />
      </motion.div>
      <Footer />
    </div>
  );
}
