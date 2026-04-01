import { CometCard } from "@/components/ui/comet-card";
import { useNavigate } from "react-router-dom";
import HoverAnimationButton from "@/components/ui/hover-animation-button";

export default function CometCardDemo() {
  const navigate = useNavigate();
  return (
    <CometCard>
      <div
        className="my-10 flex w-80 flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:my-20 md:p-4"
        style={{
          transformStyle: "preserve-3d",
          transform: "none",
          opacity: 1,
        }}
      >
        <div className="mx-2 flex-1 relative">
          <div className="relative mt-2 aspect-[3/4] w-full">
            <img
              loading="lazy"
              className="absolute inset-0 h-full w-full rounded-[16px] bg-[#000000] object-cover contrast-50 brightness-50"
              alt="Campus background"
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1541339907198-e08756dee81c?q=80&w=1287&auto=format&fit=crop"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                opacity: 1,
              }}
            />
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
              <h3 className="text-white text-xl font-bold mb-2 tracking-tight">CampusFlow</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Campus life, simplified.<br />
                Marketplace & Recovery.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div className="text-center">
            <p className="text-white/70 text-xs font-medium leading-relaxed">
              Join CampusFlow today for a smarter campus.<br />
              Your journey starts here.
            </p>
          </div>
          
          <HoverAnimationButton 
            onClick={() => navigate("/role-selection")}
            className="w-full"
          >
            Get Started
          </HoverAnimationButton>
        </div>

        <div className="mt-2 flex flex-shrink-0 items-center justify-between px-4 pb-4 font-mono text-white">
          <div className="text-[10px] text-left opacity-50 uppercase tracking-widest">CampusFlow Access</div>
          <div className="text-[10px] text-gray-300 opacity-30">#CF-2026</div>
        </div>
      </div>
    </CometCard>
  );
}
