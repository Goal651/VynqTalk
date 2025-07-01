import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const MaintenancePage = ({ message }: { message: string }) => {
  const { logout } = useAuth();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/10 relative overflow-hidden animate-fade-in">
      {/* Decorative blurred background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl z-0" />
      <div className="relative z-10 p-8 rounded-xl shadow-xl bg-background/80 backdrop-blur-md border border-border/30 max-w-md w-full animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <span className="inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 p-4 shadow-md animate-bounce-slow">
            <AlertTriangle className="h-10 w-10" />
          </span>
          <h1 className="text-4xl font-bold tracking-tight">Maintenance Mode</h1>
          <p className="text-lg text-muted-foreground mb-2">{message}</p>
          <p className="text-sm text-muted-foreground">We'll be back soon. Thank you for your patience!</p>
          <Button className="mt-4 w-full" variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage; 