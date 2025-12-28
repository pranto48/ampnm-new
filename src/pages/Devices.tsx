import { useEffect } from "react";
import { setPageMetadata } from "@/lib/seo";

const DevicesPage = () => {
  useEffect(() => {
    setPageMetadata(
      "AMPNM Devices | Network Monitor",
      "Browse and filter AMPNM devices with status, type, and last seen information.",
    );
  }, []);

  const devices = [
    {
      id: "dev-1",
      name: "Core Router",
      type: "router",
      status: "online",
      ip: "192.168.0.1",
      location: "Data Center",
      lastSeen: "Just now",
    },
    {
      id: "dev-2",
      name: "Edge Switch",
      type: "switch",
      status: "offline",
      ip: "192.168.10.12",
      location: "Branch A",
      lastSeen: "5 min ago",
    },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Devices</h1>
        <p className="text-sm text-muted-foreground">
          View all monitored devices. Filtering and live data will be wired to your existing AMPNM API.
        </p>
      </header>

      <section aria-label="Device list" className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Overview</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">IP</th>
                <th className="px-4 py-2 font-medium">Location</th>
                <th className="px-4 py-2 font-medium">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id} className="border-t border-border/60">
                  <td className="px-4 py-2 align-middle text-sm font-medium">{device.name}</td>
                  <td className="px-4 py-2 align-middle">
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          device.status === "online"
                            ? "bg-emerald-500"
                            : device.status === "offline"
                              ? "bg-destructive"
                              : "bg-muted-foreground"
                        }`}
                        aria-hidden="true"
                      />
                      {device.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 align-middle text-sm text-muted-foreground">{device.type}</td>
                  <td className="px-4 py-2 align-middle font-mono text-xs text-muted-foreground">{device.ip}</td>
                  <td className="px-4 py-2 align-middle text-sm text-muted-foreground">{device.location}</td>
                  <td className="px-4 py-2 align-middle text-sm text-muted-foreground">{device.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DevicesPage;
