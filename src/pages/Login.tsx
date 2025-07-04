import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";

const Login = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    const success = await login(values.email, values.password);
    setIsLoading(false);

    if (success) {
      window.window.location.href = '/'
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden dark-ocean-bg animate-ocean-fade-in">
      {/* Animated Ocean Bubbles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className={`absolute rounded-full bg-cyan-400/20 blur-2xl animate-bubble${i % 3 + 1} dark-bubble-glow`}
            style={{
              width: `${32 + Math.random() * 48}px`,
              height: `${32 + Math.random() * 48}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-${Math.random() * 100}px`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md  bg-blue-900/40 backdrop-blur-2xl border border-blue-400/30 shadow-2xl animate-fade-in relative z-10 rounded-2xl dark-card-glow">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg animate-float">
            <MessageSquare className="h-8 w-8 text-cyan-200 drop-shadow-lg" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight text-cyan-100 drop-shadow-sm">
              Welcome back
            </CardTitle>
            <CardDescription className="text-cyan-200/80 mt-2">
              Sign in to continue to VynqTalk
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <AuthForm type="login" onSubmit={onSubmit} isLoading={isLoading} />
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2">
          <div className="text-sm text-cyan-200/90 text-center">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-cyan-400 hover:text-blue-300 font-medium hover:underline transition-colors"
            >
              Sign up
            </Link>
          </div>

          
        </CardFooter>
      </Card>


    </div>
  );
};

export default Login;
