
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Enhanced background with theme-aware gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent"></div>
      </div>

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-accent/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/10 animate-fade-in">
        <CardHeader className="space-y-6 text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-xl shadow-primary/30 animate-glow">
            <MessageSquare className="h-10 w-10 text-primary-foreground" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Join VynqTalk
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base leading-relaxed">
              Create your account and start connecting with others
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-8">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-primary/30 shadow-xl shadow-primary/20 bg-gradient-to-br from-muted to-muted/50 backdrop-blur-sm">
                {capturedImage ? (
                  <img src={capturedImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/80">
                    <User className="text-muted-foreground h-10 w-10" />
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={openCamera}
                className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
              >
                <div className="flex flex-col items-center space-y-1">
                  <Camera className="text-white h-6 w-6" />
                  <span className="text-white text-xs font-medium">Add Photo</span>
                </div>
              </button>
            </div>
          </div>

          <AuthForm type="signup" onSubmit={onSubmit} isLoading={isLoading} />
        </CardContent>
        
        <CardFooter className="px-8 pb-8 pt-4">
          <div className="text-sm text-muted-foreground text-center w-full">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-primary hover:text-primary/80 font-semibold hover:underline transition-all duration-200 underline-offset-4"
            >
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
