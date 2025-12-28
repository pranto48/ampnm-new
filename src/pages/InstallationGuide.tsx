import { useEffect } from "react";
import { setPageMetadata } from "@/lib/seo";

const InstallationGuidePage = () => {
  useEffect(() => {
    setPageMetadata(
      "AMPNM Installation Guide",
      "Step-by-step instructions to deploy the AMPNM docker service and connect devices.",
    );
  }, []);

  return (
    <article className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Installation Guide</h1>
        <p className="text-sm text-muted-foreground">
          Follow these steps to deploy the AMPNM Docker service and start monitoring devices.
        </p>
      </header>

      <section aria-labelledby="server-setup-heading" className="space-y-2">
        <h2 id="server-setup-heading" className="text-sm font-semibold tracking-tight">
          1. Run the AMPNM docker service
        </h2>
        <p className="text-sm text-muted-foreground">
          Clone your existing AMPNM repository and start the <span className="font-mono">docker-ampnm</span> service.
        </p>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-3 text-xs leading-relaxed">
          <code>
            git clone https://github.com/pranto48/ampnm.git
            {"\n"}
            cd ampnm/docker-ampnm
            {"\n"}
            docker compose up -d
          </code>
        </pre>
      </section>

      <section aria-labelledby="device-config-heading" className="space-y-2">
        <h2 id="device-config-heading" className="text-sm font-semibold tracking-tight">
          2. Configure devices
        </h2>
        <p className="text-sm text-muted-foreground">
          Point your devices or agents to the AMPNM backend endpoint so that status, metrics, and location
          information can be collected.
        </p>
      </section>

      <section aria-labelledby="troubleshooting-heading" className="space-y-2">
        <h2 id="troubleshooting-heading" className="text-sm font-semibold tracking-tight">
          3. Troubleshooting
        </h2>
        <p className="text-sm text-muted-foreground">
          If the dashboard shows no devices or the backend is unreachable, verify that the docker service is running
          and that the API URL is correctly configured in this UI.
        </p>
      </section>
    </article>
  );
};

export default InstallationGuidePage;
