type TenantSummary = {
  id: string;
  name: string;
  mygServer: string;
  mygDatabase: string;
  status: string;
  _count: { devices: number; keylessUsers: number };
};

type CatalogResponse = {
  tenant: {
    id: string;
    name: string;
    mygServer: string;
    mygDatabase: string;
    status: string;
  };
  devices: Array<{
    id: string;
    mygDeviceId: string;
    serialNumber: string;
    name: string;
  }>;
  users: Array<{
    id: string;
    mygUserId: string | null;
    mygDriverId: string | null;
    userReference: string;
    name: string;
    email: string | null;
    isDriver: boolean;
    inKeylessGroup: boolean;
  }>;
};

const apiBase = process.env.API_BASE_URL || "http://localhost:8081";

async function getTenants(): Promise<TenantSummary[]> {
  try {
    const res = await fetch(`${apiBase}/api/tenants`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.tenants || [];
  } catch {
    return [];
  }
}

async function getCatalog(tenantId?: string): Promise<CatalogResponse | null> {
  if (!tenantId) return null;
  try {
    const res = await fetch(`${apiBase}/api/tenants/${tenantId}/catalog`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function Home(props: { searchParams?: Promise<{ tenantId?: string }> }) {
  const searchParams = (await props.searchParams) || {};
  const selectedTenantId = searchParams.tenantId;

  const tenants = await getTenants();
  const catalog = await getCatalog(selectedTenantId || tenants[0]?.id);

  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 1100, margin: "24px auto", padding: 16 }}>
      <h1>Keyless Turn App</h1>
      <p>OTA web baseline with persisted tenant catalog.</p>

      <section style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>Tenant Catalog</h2>
        <form method="get" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label htmlFor="tenantId">Tenant:</label>
          <select id="tenantId" name="tenantId" defaultValue={catalog?.tenant.id || ""}>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.mygDatabase})
              </option>
            ))}
          </select>
          <button type="submit">Load</button>
        </form>
        {tenants.length === 0 && (
          <p style={{ color: "#b91c1c" }}>
            No tenants in DB yet. Run sync endpoint first with <code>persist=true</code>.
          </p>
        )}
      </section>

      {catalog && (
        <>
          <section style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8, marginBottom: 16 }}>
            <h3 style={{ marginTop: 0 }}>Tenant Info</h3>
            <p><b>Name:</b> {catalog.tenant.name}</p>
            <p><b>MyGeotab:</b> {catalog.tenant.mygServer} / {catalog.tenant.mygDatabase}</p>
            <p><b>Status:</b> {catalog.tenant.status}</p>
            <p><b>Devices:</b> {catalog.devices.length} | <b>Eligible users:</b> {catalog.users.length}</p>
          </section>

          <section style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8, marginBottom: 16 }}>
            <h3 style={{ marginTop: 0 }}>Eligible Users (Driver OR Keyless_Driver)</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Name</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Email</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Reference</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Driver</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Keyless Group</th>
                </tr>
              </thead>
              <tbody>
                {catalog.users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ borderBottom: "1px solid #eee", padding: 6 }}>{u.name}</td>
                    <td style={{ borderBottom: "1px solid #eee", padding: 6 }}>{u.email || "-"}</td>
                    <td style={{ borderBottom: "1px solid #eee", padding: 6 }}><code>{u.userReference}</code></td>
                    <td style={{ borderBottom: "1px solid #eee", padding: 6 }}>{u.isDriver ? "Yes" : "No"}</td>
                    <td style={{ borderBottom: "1px solid #eee", padding: 6 }}>{u.inKeylessGroup ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>Devices</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Name</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Serial</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>MyG Device Id</th>
                </tr>
              </thead>
              <tbody>
                {catalog.devices.map((d) => (
                  <tr key={d.id}>
                    <td style={{ borderBottom: "1px solid #eee", padding: 6 }}>{d.name}</td>
                    <td style={{ borderBottom: "1px solid #eee", padding: 6 }}><code>{d.serialNumber}</code></td>
                    <td style={{ borderBottom: "1px solid #eee", padding: 6 }}><code>{d.mygDeviceId}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </main>
  );
}
