import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Camera, User } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { AuthForm } from "@/components/auth/AuthForm";

const Signup = () => {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { openCamera, capturedImage, CameraDialog } = useCamera();

  const onSubmit = async (values: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    const success = await signup(values.email, values.password, values.name);
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
      <Card className="w-full max-w-md bg-blue-900/40 backdrop-blur-2xl border border-blue-400/30 shadow-2xl animate-fade-in relative z-10 rounded-2xl dark-card-glow">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg animate-float">
            <MessageSquare className="h-8 w-8 text-cyan-200 drop-shadow-lg" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight text-cyan-100 drop-shadow-sm">
              Join VynqTalk
            </CardTitle>
            <CardDescription className="text-cyan-200/80 mt-2">
              Create your account to start connecting
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary group cursor-pointer shadow-lg  bg-transparent/20 border-blue-700">
              {capturedImage ? (
                <img src={capturedImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="text-muted-foreground h-8 w-8" />
                </div>
              )}
              <button 
                type="button"
                onClick={openCamera}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Change profile picture"
              >
                <Camera className="text-white h-5 w-5" />
              </button>
            </div>
          </div>
          <AuthForm type="signup" onSubmit={onSubmit} isLoading={isLoading} />
        </CardContent>
        <CardFooter>
          <div className="text-sm text-cyan-200/90 text-center w-full">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-cyan-400 hover:text-blue-300 font-medium hover:underline transition-colors"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
      {CameraDialog}

    </div>
  );
};

export default Signup;
