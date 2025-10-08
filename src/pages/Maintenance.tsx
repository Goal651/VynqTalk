import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const MaintenancePage = ({ message }: { message: string }) => {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-primary/5 animate-pulse" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-secondary/5 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/3 animate-pulse delay-500" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        <div className="bg-card/80 backdrop-blur-sm border-2 border-gray-500/50 dark:border-black/50 rounded-2xl shadow-xl p-8 sm:p-12">
          <div className="text-center space-y-8">
            {/* Animated Icon */}
            <div className="relative mx-auto w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 rounded-full flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-10 w-10 text-yellow-600 dark:text-yellow-500 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-yellow-200/50 dark:border-yellow-700/50 animate-ping" />
            </div>
            
            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Under Maintenance
              </h1>
              <div className="space-y-3">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {message}
                </p>
                <p className="text-muted-foreground">
                  We're working hard to improve your experience.
                </p>
                <p className="text-sm text-muted-foreground/80 font-medium">
                  ⚡ We'll be back online soon!
                </p>
              </div>
            </div>
            {/* Progress indicator */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
              </div>
            </div>
            
            {/* Action */}
            <Button 
              className="w-full sm:w-auto px-8 py-3 font-semibold shadow-lg border-2 border-gray-500/50 dark:border-black/50 hover:shadow-xl transition-all duration-200" 
              variant="outline" 
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground/70">
            © 2024 VynqTalk. Thank you for your patience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage; 