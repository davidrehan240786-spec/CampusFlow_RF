import * as React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonWithIconProps = React.ComponentPropsWithoutRef<"button"> & {
  icon: LucideIcon;
};

const ButtonWithIcon = ({ icon: Icon, children, className, ...props }: ButtonWithIconProps) => {
  return (
    <Button 
      className={cn(
        "relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-full overflow-hidden cursor-pointer",
        className
      )}
      {...props}
    >
      <span className="relative z-10 transition-all duration-500">
        {children}
      </span>
      <div className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
        <Icon size={16} />
      </div>
    </Button>
  );
};

export default ButtonWithIcon;
