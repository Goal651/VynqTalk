import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Sparkles } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeSelector } from "@/components/ui/theme-selector";

const Login = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    const success = await login(values.email, values.password);
    setIsLoading(false);

    if (success) {
      window.location.href = '/'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 flex flex-col">
      {/* Theme Selector in top-right corner */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <ThemeSelector />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-secondary/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Brand */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 group-hover:from-primary/90 group-hover:to-primary transition-all duration-300" />
              <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground relative z-10 drop-shadow-sm" />
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground/70 absolute top-2 right-2 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Welcome back
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Sign in to continue to <span className="font-semibold text-primary">VynqTalk</span>
              </p>
            </div>
          </div>

          {/* Auth Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-6 pb-6">
              <div className="space-y-2 text-center">
                <CardTitle className="text-xl sm:text-2xl font-semibold">
                  Sign in to your account
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Enter your credentials to access your account
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <AuthForm type="login" onSubmit={onSubmit} isLoading={isLoading} />
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6">
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-primary hover:text-primary/80 hover:underline transition-all duration-200"
                >
                  Create one now
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            <p>© 2024 VynqTalk. Secure • Private • Professional</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
