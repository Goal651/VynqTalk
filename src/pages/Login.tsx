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
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Theme Selector */}
      <div className="absolute top-6 right-6">
        <ThemeSelector />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-card border border-border shadow-lg">
          {/* Header */}
          <CardHeader className="text-center pb-6 pt-8 sm:pb-8 sm:pt-12 px-6 sm:px-8">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <MessageSquare className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-semibold text-foreground mb-2">
              Welcome back
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your VynqTalk account
            </CardDescription>
          </CardHeader>

          {/* Form */}
          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
            <AuthForm type="login" onSubmit={onSubmit} isLoading={isLoading} />
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex flex-col space-y-4 px-6 pb-8 pt-4 sm:px-8 sm:pb-12 border-t border-border">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Create one now
              </Link>
            </div>
            <div className="text-xs text-center text-muted-foreground/70">
              © 2024 VynqTalk. Secure • Private • Professional
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
