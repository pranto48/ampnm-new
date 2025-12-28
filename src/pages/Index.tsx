import { useEffect } from "react";
import { setPageMetadata } from "@/lib/seo";

const Index = () => {
  useEffect(() => {
    setPageMetadata(
      "AMPNM Dashboard | Network Monitoring Portal",
      "AMPNM dashboard provides a live overview of device status, counts, and map-based visibility.",
    );
  }, []);

  return (
    <main className="flex min-h-[calc(100vh-3rem)] flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Network Overview</h1>
        <p className="text-sm text-muted-foreground">
          High-level view of your AMPNM-monitored devices. Realtime map and stats will plug into your existing
          backend.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Key metrics">
        <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Total devices</h2>
          <p className="mt-3 text-3xl font-semibold">--</p>
        </article>
        <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Online</h2>
          <p className="mt-3 text-3xl font-semibold text-emerald-500">--</p>
        </article>
        <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Offline / issues</h2>
          <p className="mt-3 text-3xl font-semibold text-destructive">--</p>
        </article>
      </section>

      <section aria-label="Network map" className="rounded-lg border border-border bg-card/40 p-4">
        <h2 className="text-sm font-medium tracking-tight">Realtime map</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A live AMPNM device map will be rendered here using your backend and device locations.
        </p>
        <div className="mt-4 min-h-[320px] rounded-md bg-muted" />
      </section>
    </main>
  );
};

export default Index;

