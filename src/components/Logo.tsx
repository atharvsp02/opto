import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

function Logo({ className }: LogoProps) {
  return (
    <span className={cn("font-logo tracking-[0.2em] select-none", className)}>
      <span className="text-[#FFB000]">O</span>
      <span className="text-foreground">P</span>
      <span className="text-foreground">T</span>
      <span className="text-[#FFB000]">O</span>
    </span>
  );
}

export default Logo;
