export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Keyless Turn App</h1>
      <p>V1 OTA Web scaffold is ready.</p>
      <ul>
        <li>API health: <code>GET /health</code></li>
        <li>Sync eligible users/devices: <code>POST /api/tenants/sync/eligible</code></li>
      </ul>
      <p>Next step: tenant setup, persistence and reservation planner UI.</p>
    </main>
  );
}
