import { useEffect, useState } from "react";
import MaintenancePage from "./pages/MaintenancePage";
import App from "./App";
import { systemStatusService, SystemStatus } from "@/api/services/systemStatus";
import { useAuth } from "@/contexts/AuthContext";

const AppLoader = () => {
  const [maintenance, setMaintenance] = useState<SystemStatus | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    systemStatusService.getStatus().then(status => {
      setMaintenance(status);
    });
  }, []);

  if (!maintenance) return <div>Loading...</div>;
  // Allow admin to bypass maintenance mode
  if (maintenance.inMaintenance && !(user && user.isAdmin)) {
    return <MaintenancePage message={maintenance.message} />;
  }
  return <App />;
};

export default AppLoader; 