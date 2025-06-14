
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>
      </div>
      
      <Card className="w-full max-w-md bg-card border border-border shadow-2xl animate-fade-in relative z-10">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <MessageSquare className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Sign in to continue to VynqTalk
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <AuthForm type="login" onSubmit={onSubmit} isLoading={isLoading} />
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 pt-2">
          <div className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link 
              to="/signup" 
              className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
            >
              Sign up
            </Link>
          </div>
          
          <div className="w-full p-3 bg-muted rounded-lg border border-border">
            <p className="text-xs text-muted-foreground text-center font-medium">
              Demo credentials
            </p>
            <p className="text-xs text-muted-foreground text-center mt-1">
              <span className="font-mono">user@example.com</span> / <span className="font-mono">password</span>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
