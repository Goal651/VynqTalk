
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Camera, User, Sparkles, ArrowLeft, Star } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { AuthForm } from "@/components/auth/AuthForm";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { openCamera, capturedImage, CameraDialog } = useCamera();

  const onSubmit = async (values: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    const success = await signup(values.email, values.password, values.name);
    setIsLoading(false);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <Card className="w-full max-w-lg relative z-10 bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 animate-fade-in">
        <CardHeader className="space-y-8 text-center pb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/25 relative group">
            <MessageSquare className="h-12 w-12 text-white" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <CardTitle className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Join Us
              </CardTitle>
              <Star className="h-8 w-8 text-yellow-400 animate-pulse" />
            </div>
            <CardDescription className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
              Create your <span className="text-cyan-400 font-semibold">VynqTalk</span> account and start your journey
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-8">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl shadow-purple-500/25 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm relative">
                {capturedImage ? (
                  <img src={capturedImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <User className="text-gray-400 h-12 w-12" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                     onClick={openCamera}>
                  <div className="flex flex-col items-center space-y-2">
                    <Camera className="text-white h-8 w-8" />
                    <span className="text-white text-sm font-medium">Add Photo</span>
                  </div>
                </div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-cyan-500 to-pink-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
            </div>
          </div>

          <AuthForm type="signup" onSubmit={onSubmit} isLoading={isLoading} />
        </CardContent>
        
        <CardFooter className="px-8 pb-8 pt-6">
          <div className="text-center w-full">
            <span className="text-gray-400">Already have an account? </span>
            <Link 
              to="/login" 
              className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline transition-all duration-200 underline-offset-4 inline-flex items-center gap-1 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Sign in here
            </Link>
          </div>
        </CardFooter>
      </Card>

      {CameraDialog}
    </div>
  );
};

export default Signup;
