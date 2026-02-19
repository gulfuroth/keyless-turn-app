import { EligibleUser, MyGDevice, MyGDriver, MyGUser, TenantConnection } from "../types/domain.js";

const KEYLESS_DRIVER_GROUP = "Keyless_Driver";

async function rpc<T>(server: string, method: string, params: unknown): Promise<T> {
  const url = `https://${server}/apiv1`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ method, params })
  });

  if (!res.ok) {
    throw new Error(`MyGeotab HTTP ${res.status}`);
  }

  const payload = await res.json();
  if (payload.error) {
    throw new Error(payload.error.message ?? "MyGeotab API error");
  }
  return payload.result as T;
}

export async function authenticateMyGeotab(conn: TenantConnection): Promise<unknown> {
  const result = await rpc<{ credentials: unknown }>(conn.mygServer, "Authenticate", {
    database: conn.mygDatabase,
    userName: conn.mygUserName,
    password: conn.mygPassword
  });
  return result.credentials;
}

export async function getDevices(conn: TenantConnection, credentials: unknown): Promise<MyGDevice[]> {
  const result = await rpc<Array<Record<string, unknown>>>(conn.mygServer, "Get", {
    typeName: "Device",
    credentials
  });

  return result
    .map((d) => ({
      id: String(d.id ?? ""),
      serialNumber: String(d.serialNumber ?? ""),
      name: String(d.name ?? "")
    }))
    .filter((d) => d.id && d.serialNumber);
}

export async function getUsers(conn: TenantConnection, credentials: unknown): Promise<MyGUser[]> {
  const result = await rpc<Array<Record<string, unknown>>>(conn.mygServer, "Get", {
    typeName: "User",
    credentials
  });
  return result
    .map((u) => ({
      id: String(u.id ?? ""),
      name: String(u.name ?? ""),
      email: u.email ? String(u.email) : undefined
    }))
    .filter((u) => u.id);
}

export async function getDrivers(conn: TenantConnection, credentials: unknown): Promise<MyGDriver[]> {
  const result = await rpc<Array<Record<string, unknown>>>(conn.mygServer, "Get", {
    typeName: "Driver",
    credentials
  });

  return result
    .map((d) => {
      const userObj = (d.user as Record<string, unknown> | undefined) ?? undefined;
      return {
        id: String(d.id ?? ""),
        userId: userObj?.id ? String(userObj.id) : undefined,
        name: d.name ? String(d.name) : undefined,
        email: d.email ? String(d.email) : undefined
      } satisfies MyGDriver;
    })
    .filter((d) => d.id);
}

export async function getKeylessGroupUserIds(conn: TenantConnection, credentials: unknown): Promise<Set<string>> {
  const groups = await rpc<Array<Record<string, unknown>>>(conn.mygServer, "Get", {
    typeName: "Group",
    credentials
  });

  const keylessGroup = groups.find((g) => String(g.name ?? "") === KEYLESS_DRIVER_GROUP);
  if (!keylessGroup?.id) return new Set<string>();

  const groupId = String(keylessGroup.id);

  // MyGeotab grouping for users can vary by tenant. We query User and keep those containing the group id.
  const users = await rpc<Array<Record<string, unknown>>>(conn.mygServer, "Get", {
    typeName: "User",
    credentials
  });

  const userIds = new Set<string>();
  for (const u of users) {
    const groupsAny = Array.isArray(u.companyGroups)
      ? u.companyGroups
      : Array.isArray(u.groups)
        ? u.groups
        : [];

    const inGroup = groupsAny.some((g) => {
      if (typeof g === "string") return g === groupId;
      if (g && typeof g === "object") {
        const obj = g as Record<string, unknown>;
        return String(obj.id ?? obj.Id ?? "") === groupId;
      }
      return false;
    });

    if (inGroup && u.id) userIds.add(String(u.id));
  }

  return userIds;
}

export function buildEligibleUsers(users: MyGUser[], drivers: MyGDriver[], keylessGroupUserIds: Set<string>): EligibleUser[] {
  const usersById = new Map(users.map((u) => [u.id, u]));
  const byRef = new Map<string, EligibleUser>();

  for (const d of drivers) {
    const user = d.userId ? usersById.get(d.userId) : undefined;
    const userId = d.userId ?? d.id;
    const inGroup = !!(d.userId && keylessGroupUserIds.has(d.userId));
    const ref = `driver:${d.id}`;

    byRef.set(ref, {
      id: userId,
      source: inGroup ? "both" : "driver",
      name: d.name || user?.name || "Unknown Driver",
      email: d.email || user?.email,
      userReference: ref,
      isDriver: true,
      inKeylessGroup: inGroup
    });
  }

  for (const userId of keylessGroupUserIds) {
    const u = usersById.get(userId);
    const existing = Array.from(byRef.values()).find((x) => x.id === userId);
    if (existing) {
      existing.source = "both";
      existing.inKeylessGroup = true;
      continue;
    }

    const ref = `user:${userId}`;
    byRef.set(ref, {
      id: userId,
      source: "group",
      name: u?.name || "Unknown User",
      email: u?.email,
      userReference: ref,
      isDriver: false,
      inKeylessGroup: true
    });
  }

  return Array.from(byRef.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function syncEligibleCatalog(conn: TenantConnection): Promise<{ devices: MyGDevice[]; users: EligibleUser[] }> {
  const credentials = await authenticateMyGeotab(conn);

  const [devices, users, drivers, keylessGroupUserIds] = await Promise.all([
    getDevices(conn, credentials),
    getUsers(conn, credentials),
    getDrivers(conn, credentials),
    getKeylessGroupUserIds(conn, credentials)
  ]);

  return {
    devices,
    users: buildEligibleUsers(users, drivers, keylessGroupUserIds)
  };
}
