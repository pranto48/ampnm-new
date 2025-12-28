import { useEffect } from "react";
import { setPageMetadata } from "@/lib/seo";

const PublicMapPage = () => {
  useEffect(() => {
    setPageMetadata(
      "AMPNM Public Map | Device Status View",
      "Share a public read-only map view of AMPNM device status in real time.",
    );
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Public Map</h1>
        <p className="text-sm text-muted-foreground">
          This read-only map view is intended for sharing with stakeholders. Device data will stream from your AMPNM
          backend.
        </p>
      </header>

      <article
        aria-label="Public device map"
        className="relative min-h-[420px] rounded-lg border border-border bg-card/40 p-4"
      >
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-muted to-background" aria-hidden="true" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <p className="text-sm text-muted-foreground">
            Map integration will appear here. For now this is a scaffolded placeholder wired for your existing AMPNM
            API.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Online device
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-destructive" aria-hidden="true" />
              Offline device
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-muted-foreground" aria-hidden="true" />
              Unknown / degraded
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default PublicMapPage;
