
import React from "react";
import { cn } from "@/lib/utils";

interface LineWaveProps extends React.HTMLAttributes<HTMLDivElement> {}

export const LineWave = ({ className, ...props }: LineWaveProps) => {
  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden opacity-20", className)} {...props}>
      <svg 
        className="absolute top-0 left-0 w-full h-full" 
        viewBox="0 0 1200 800" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          className="text-primary animate-pulse" 
          d="M0,192L30,186.7C60,181,120,171,180,176C240,181,300,203,360,229.3C420,256,480,288,540,272C600,256,660,192,720,160C780,128,840,128,900,154.7C960,181,1020,235,1080,234.7C1140,235,1200,181,1260,160C1320,139,1380,149,1410,154.7L1440,160L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z" 
          fill="currentColor" 
          fillOpacity="1"
        ></path>
        <path 
          className="text-accent animate-pulse" 
          d="M0,32L30,48C60,64,120,96,180,101.3C240,107,300,85,360,96C420,107,480,149,540,192C600,235,660,277,720,272C780,267,840,213,900,176C960,139,1020,117,1080,128C1140,139,1200,181,1260,213.3C1320,245,1380,267,1410,277.3L1440,288L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z" 
          fill="currentColor" 
          fillOpacity="0.75"
        ></path>
      </svg>
    </div>
  );
};
