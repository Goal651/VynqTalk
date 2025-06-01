
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Sparkles, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <Card className="w-full max-w-lg relative z-10 bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 animate-fade-in">
        <CardHeader className="space-y-8 text-center pb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/25 relative group">
            <MessageSquare className="h-12 w-12 text-white" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <CardTitle className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Welcome
              </CardTitle>
              <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
            </div>
            <CardDescription className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
              Sign in to your <span className="text-purple-400 font-semibold">VynqTalk</span> account and connect with the world
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8 px-8">
          <AuthForm type="login" onSubmit={onSubmit} isLoading={isLoading} />
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-8 pt-6 px-8 pb-8">
          <div className="text-center">
            <span className="text-gray-400">Don't have an account? </span>
            <Link 
              to="/signup" 
              className="text-purple-400 hover:text-purple-300 font-semibold hover:underline transition-all duration-200 underline-offset-4 inline-flex items-center gap-1 group"
            >
              Create one now
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="w-full p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Demo Access Available
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                  <span className="text-sm text-gray-400">Email:</span>
                  <span className="font-mono text-sm text-white bg-white/10 px-3 py-1 rounded">user@example.com</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                  <span className="text-sm text-gray-400">Password:</span>
                  <span className="font-mono text-sm text-white bg-white/10 px-3 py-1 rounded">password</span>
                </div>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
