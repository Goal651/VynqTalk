import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, BellOff, Info, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationPermissionModalProps {
  open: boolean;
  onClose: () => void;
  onPermissionChanged?: (granted: boolean) => void;
}

export const NotificationPermissionModal = ({
  open,
  onClose,
  onPermissionChanged
}: NotificationPermissionModalProps) => {


  const [isRequesting, setIsRequesting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const granted = await Notification.requestPermission();
      if (granted) {
        setShowSuccess(true);
        onPermissionChanged?.(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);
      } else {
        onPermissionChanged?.(false);
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      onPermissionChanged?.(false);
    } finally {
      setIsRequesting(false);
    }
  };

  const getPermissionStatus = () => {
    if (Notification.permission === 'granted') {
      return {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        text: "Notifications are enabled",
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200"
      };
    } else if (Notification.permission === 'denied') {
      return {
        icon: <XCircle className="w-5 h-5 text-red-500" />,
        text: "Notifications are blocked",
        color: "text-red-600",
        bgColor: "bg-red-50 border-red-200"
      };
    } else {
      return {
        icon: <Info className="w-5 h-5 text-blue-500" />,
        text: "Notification permission not set",
        color: "text-blue-600",
        bgColor: "bg-blue-50 border-blue-200"
      };
    }
  };

  const status = getPermissionStatus();

  if (!Notification.permission) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BellOff className="w-5 h-5 text-muted-foreground" />
              Notifications Not Supported
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Your browser doesn't support push notifications or you're browsing in an insecure context.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700">
                    Notifications enabled successfully! You'll now receive message alerts.
                  </AlertDescription>
                </Alert>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Current Status */}
                <Alert className={status.bgColor}>
                  <div className="flex items-center gap-2">
                    {status.icon}
                    <AlertDescription className={status.color}>
                      {status.text}
                    </AlertDescription>
                  </div>
                </Alert>

                {/* Information */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Why enable notifications?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Get instant alerts for new messages</li>
                    <li>• Stay connected even when VynqTalk is minimized</li>
                    <li>• Never miss important conversations</li>
                  </ul>
                </div>

                {Notification.permission === 'denied' && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <Info className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-yellow-700">
                      Notifications are currently blocked. You can enable them in your browser settings.
                    </AlertDescription>
                  </Alert>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="gap-2">
          <Button onClick={onClose} variant="outline">
            {showSuccess ? "Close" : "Maybe Later"}
          </Button>
          
          {Notification.permission !== 'granted' && !showSuccess && (
            <Button 
              onClick={handleRequestPermission} 
              disabled={isRequesting}
              className="gap-2"
            >
              {isRequesting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Requesting...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  Enable Notifications
                </>
              )}
            </Button>
          )}

          {Notification.permission === 'granted' && !showSuccess && (
            <Button onClick={onClose} className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Already Enabled
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
