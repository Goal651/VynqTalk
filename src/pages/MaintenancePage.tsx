const MaintenancePage = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Maintenance Mode</h1>
      <p className="text-lg text-muted-foreground mb-4">{message}</p>
    </div>
  </div>
);

export default MaintenancePage; 