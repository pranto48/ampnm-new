export default function App() {
  const defaultBase = "http://localhost:3000";
  const baseUrl =
    (typeof window !== "undefined" &&
      window.localStorage.getItem("ampnm_docker_base_url")) ||
    defaultBase;

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

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>Lovable workspace</h1>
      <p style={{ marginTop: 8 }}>
        Your Docker/PHP app lives under <code>portal.itsupport.com.bd/</code>.
      </p>

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
            const href = `${baseUrl.replace(/\/$/, "")}${l.path}`;
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
