import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Camera, User, Sparkles, UserPlus } from "lucide-react";
import { useCamera } from "@/hooks";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeSelector } from "@/components/ui/theme-selector";

const Signup = () => {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { openCamera, capturedImage, CameraDialog } = useCamera();

  const onSubmit = async (values: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    const success = await signup(values.email, values.password, values.name);
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
              Join VynqTalk
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Create your account to get started
            </CardDescription>
          </CardHeader>

          {/* Form */}
          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8 space-y-4 sm:space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-input bg-muted cursor-pointer transition-all duration-200 group-hover:border-primary/50 group-hover:shadow-lg">
                  {capturedImage ? (
                    <img src={capturedImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <User className="text-muted-foreground h-8 w-8" />
                    </div>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={openCamera}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full backdrop-blur-sm"
                  title="Add profile picture"
                >
                  <div className="text-center space-y-1">
                    <Camera className="text-white h-5 w-5 mx-auto" />
                    <span className="text-xs text-white font-medium">Add Photo</span>
                  </div>
                </button>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <UserPlus className="h-3 w-3 text-primary-foreground" />
                </div>
              </div>
            </div>
            <AuthForm type="signup" onSubmit={onSubmit} isLoading={isLoading} />
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex flex-col space-y-4 px-6 pb-8 pt-4 sm:px-8 sm:pb-12 border-t border-border">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign in instead
              </Link>
            </div>
            <div className="text-xs text-center text-muted-foreground/70">
              © 2024 VynqTalk. Secure • Private • Professional
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {CameraDialog}
    </div>
  );
};

export default Signup;
