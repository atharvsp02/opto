import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "@/context/context";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export default function LandingNav() {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-[72px] flex items-center justify-between">
        <Link to="/" className="hover:opacity-70 transition-opacity">
          <Logo className="text-2xl" />
        </Link>
        <div className="flex items-center gap-5 sm:gap-7 text-sm font-medium">
          <a
            href="#how"
            className="hidden sm:inline text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </a>
          <Link
            to="/market"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Markets
          </Link>
          <Button size="sm" onClick={() => navigate(user ? "/app" : "/login")}>
            {user ? "Open app" : "Sign in"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
