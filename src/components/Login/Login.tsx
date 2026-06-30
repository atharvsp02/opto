import { signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, provider } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import Logo from "@/components/Logo";
import googleLogo from "@/assets/google-logo.svg";

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/app");
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
      <Link to="/" className="mb-12 hover:opacity-70 transition-opacity">
        <Logo className="text-3xl" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Card className="border-border shadow-sm">
          <CardHeader className="text-center space-y-3 pt-10">
            <h1 className="hero-title text-5xl md:text-6xl">Welcome back</h1>
            <p className="body-text text-base">
              Sign in to start predicting. New here? You'll get 1000 free coins.
            </p>
          </CardHeader>

          <CardContent className="pb-10 pt-4">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <img src={googleLogo} alt="" className="w-5 h-5" />
              Continue with Google
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          By continuing you agree to play fair. The market settles the rest.
        </p>
      </motion.div>
    </div>
  );
}
