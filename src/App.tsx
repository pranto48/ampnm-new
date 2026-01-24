export default function App() {
  const defaultBase = "http://localhost:3000";
  const baseUrl =
    (typeof window !== "undefined" &&
      window.localStorage.getItem("ampnm_docker_base_url")) ||
    defaultBase;

  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

  const pages = [
    { label: "Dashboard", path: "/docker-ampnm/index.php" },
    { label: "Map", path: "/docker-ampnm/map.php" },
    { label: "Host Metrics (Windows Agent)", path: "/docker-ampnm/host_metrics.php" },
    { label: "Download Windows Agent", path: "/docker-ampnm/download-agent.php" },
    { label: "Windows Agent Guide", path: "/docker-ampnm/documentation.php#windows-agent" },
    { label: "Agent API Health", path: "/docker-ampnm/api/agent/windows-metrics/health" },
  ] as const;

  const defaultPagePath = pages[2].path;
  const selectedPathKey = "ampnm_selected_page";
  const selectedPath =
    (typeof window !== "undefined" &&
      window.localStorage.getItem(selectedPathKey)) ||
    defaultPagePath;

  const links = [
    {
      label: "Host Metrics UI",
      path: "/docker-ampnm/host_metrics.php",
    },
    {
      label: "Download Agent",
      path: "/docker-ampnm/download-agent.php",
    },
    {
      label: "Windows Metrics API (POST)",
      path: "/docker-ampnm/api/agent/windows-metrics/",
    },
    {
      label: "Windows Metrics API (GET recent)",
      path: "/docker-ampnm/api/agent/windows-metrics/recent",
    },
  ] as const;

  const selectedHref = `${cleanBaseUrl}${selectedPath}`;

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>Lovable workspace</h1>
      <p style={{ marginTop: 8 }}>
        Your Docker/PHP app lives under <code>portal.itsupport.com.bd/</code>.
      </p>

      <section style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>AMPNM menu</h2>
        <p style={{ marginTop: 8, maxWidth: 720 }}>
          Pick a page to open in a new tab or preview it below (requires your
          Docker app to be running).
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          <select
            defaultValue={selectedPath}
            onChange={(e) =>
              window.localStorage.setItem(selectedPathKey, e.currentTarget.value)
            }
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              minWidth: 260,
            }}
            aria-label="AMPNM page"
          >
            {pages.map((p) => (
              <option key={p.path} value={p.path}>
                {p.label}
              </option>
            ))}
          </select>

          <a
            href={selectedHref}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "white",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Open
          </a>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
            Preview URL:
          </div>
          <code style={{ fontSize: 12, opacity: 0.9 }}>{selectedHref}</code>
          <div style={{ marginTop: 10 }}>
            <iframe
              title="AMPNM Preview"
              src={selectedHref}
              style={{
                width: "100%",
                height: 640,
                border: "1px solid #ddd",
                borderRadius: 12,
              }}
            />
          </div>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>AMPNM quick links</h2>

        <p style={{ marginTop: 8, maxWidth: 720 }}>
          Set your Docker base URL (example: <code>{defaultBase}</code>) and use
          these links for fast access during development.
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input
            defaultValue={baseUrl}
            onBlur={(e) =>
              window.localStorage.setItem(
                "ampnm_docker_base_url",
                e.currentTarget.value.trim() || defaultBase
              )
            }
            placeholder={defaultBase}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
            aria-label="Docker base URL"
          />
          <button
            type="button"
            onClick={() =>
              window.localStorage.setItem("ampnm_docker_base_url", defaultBase)
            }
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        <ul style={{ marginTop: 12, lineHeight: 1.8 }}>
          {links.map((l) => {
            const href = `${cleanBaseUrl}${l.path}`;
            return (
              <li key={l.label}>
                <a href={href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
                <span style={{ opacity: 0.7 }}> — </span>
                <code style={{ opacity: 0.8 }}>{l.path}</code>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
