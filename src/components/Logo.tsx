import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  alt?: string;
}

const Logo: React.FC<LogoProps> = ({ className, alt = "Alifa logo" }) => {
  return (
    <img
      src="/lovable-uploads/51820dd3-dfba-4c72-b763-dae8713dbcc4.png"
      alt={alt}
      className={cn("block select-none object-contain", className)}
      width={128}
      height={128}
      loading="eager"
    />
  );
};

export default Logo;
