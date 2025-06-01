
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    const success = await login(values.email, values.password);
    setIsLoading(false);
    
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Enhanced background with theme-aware gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent"></div>
      </div>
      
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-accent/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/10 animate-fade-in">
        <CardHeader className="space-y-6 text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-xl shadow-primary/30 animate-glow">
            <MessageSquare className="h-10 w-10 text-primary-foreground" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Welcome back
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base leading-relaxed">
              Sign in to continue your conversations on VynqTalk
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 px-8">
          <AuthForm type="login" onSubmit={onSubmit} isLoading={isLoading} />
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-6 pt-4 px-8 pb-8">
          <div className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link 
              to="/signup" 
              className="text-primary hover:text-primary/80 font-semibold hover:underline transition-all duration-200 underline-offset-4"
            >
              Sign up for free
            </Link>
          </div>
          
          <div className="w-full p-4 bg-muted/50 rounded-xl border border-border/30 backdrop-blur-sm">
            <p className="text-xs font-semibold text-muted-foreground text-center mb-2 uppercase tracking-wider">
              Demo Access
            </p>
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">
                <span className="font-mono bg-background/50 px-2 py-1 rounded text-xs">user@example.com</span>
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-mono bg-background/50 px-2 py-1 rounded text-xs">password</span>
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
