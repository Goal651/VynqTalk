import { useEffect, useState } from "react";
import { systemStatusService, SystemStatus } from "@/api/services/systemStatus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const SystemControl = () => {
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [inMaintenance, setInMaintenance] = useState(false);

    useEffect(() => {
        systemStatusService.getStatus().then((res) => {
            setStatus(res);
            setInMaintenance(res.inMaintenance);
            setMessage(res.message);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            await systemStatusService.setStatus(inMaintenance, message);
            setStatus({ inMaintenance, message });
        } catch (err) {
            setError("Failed to update system status");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading system status...</div>;

    return (
        <div className="max-w-xl mx-auto p-6 bg-card rounded-lg border border-border shadow">
            <h2 className="text-2xl font-bold mb-4">System Control</h2>
            <div className="flex items-center gap-4 mb-6">
                <Switch checked={inMaintenance} onCheckedChange={setInMaintenance} id="maintenance-switch" />
                <label htmlFor="maintenance-switch" className="text-lg font-medium">
                    Maintenance Mode
                </label>
            </div>
            <div className="mb-4">
                <label htmlFor="maintenance-message" className="block text-sm font-medium mb-1">
                    Maintenance Message
                </label>
                <Input
                    id="maintenance-message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Enter maintenance message..."
                    disabled={!inMaintenance}
                />
            </div>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
            </Button>
        </div>
    );
}; 