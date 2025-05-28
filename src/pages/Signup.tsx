
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Camera, User } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>
      </div>

      <Card className="w-full max-w-md bg-card border border-border shadow-2xl animate-fade-in relative z-10">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <MessageSquare className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Join VynqTalk
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Create your account to start connecting
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary group cursor-pointer shadow-lg">
              {capturedImage ? (
                <img src={capturedImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <User className="text-muted-foreground h-8 w-8" />
                </div>
              )}
              <button 
                type="button"
                onClick={openCamera}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Camera className="text-white h-5 w-5" />
              </button>
            </div>
          </div>

          <AuthForm type="signup" onSubmit={onSubmit} isLoading={isLoading} />
        </CardContent>
        
        <CardFooter>
          <div className="text-sm text-muted-foreground text-center w-full">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
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
