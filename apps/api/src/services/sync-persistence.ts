import { EligibleUser, MyGDevice, TenantConnection } from "../types/domain.js";
import { prisma } from "./prisma.js";

function encodeCreds(obj: Record<string, string>): string {
  return Buffer.from(JSON.stringify(obj), "utf-8").toString("base64");
}

export async function upsertTenantAndCatalog(
  conn: TenantConnection,
  catalog: { devices: MyGDevice[]; users: EligibleUser[] },
  tenantName?: string
): Promise<{ tenantId: string; devicesUpserted: number; usersUpserted: number }> {
  const encryptedMygCreds = encodeCreds({
    mygUserName: conn.mygUserName,
    mygPassword: conn.mygPassword
  });

  const tenant = await prisma.tenant.upsert({
    where: {
      mygServer_mygDatabase: {
        mygServer: conn.mygServer,
        mygDatabase: conn.mygDatabase
      }
    },
    create: {
      name: tenantName || conn.mygDatabase,
      mygServer: conn.mygServer,
      mygDatabase: conn.mygDatabase,
      encryptedMygCreds,
      status: "active"
    },
    update: {
      name: tenantName || conn.mygDatabase,
      encryptedMygCreds,
      status: "active"
    }
  });

  for (const d of catalog.devices) {
    await prisma.device.upsert({
      where: {
        tenantId_serialNumber: {
          tenantId: tenant.id,
          serialNumber: d.serialNumber
        }
      },
      create: {
        tenantId: tenant.id,
        mygDeviceId: d.id,
        serialNumber: d.serialNumber,
        name: d.name || d.serialNumber
      },
      update: {
        mygDeviceId: d.id,
        name: d.name || d.serialNumber
      }
    });
  }

  for (const u of catalog.users) {
    await prisma.keylessUser.upsert({
      where: {
        tenantId_userReference: {
          tenantId: tenant.id,
          userReference: u.userReference
        }
      },
      create: {
        tenantId: tenant.id,
        mygUserId: u.source !== "driver" ? u.id : null,
        mygDriverId: u.source !== "group" ? u.id : null,
        userReference: u.userReference,
        name: u.name,
        email: u.email,
        isDriver: u.isDriver,
        inKeylessGroup: u.inKeylessGroup,
        active: true
      },
      update: {
        name: u.name,
        email: u.email,
        isDriver: u.isDriver,
        inKeylessGroup: u.inKeylessGroup,
        active: true
      }
    });
  }

  return {
    tenantId: tenant.id,
    devicesUpserted: catalog.devices.length,
    usersUpserted: catalog.users.length
  };
}
