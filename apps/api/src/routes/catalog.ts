import { FastifyInstance } from "fastify";
import { prisma } from "../services/prisma.js";

export async function catalogRoutes(app: FastifyInstance): Promise<void> {
  app.get("/tenants", async () => {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        mygServer: true,
        mygDatabase: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            devices: true,
            keylessUsers: true
          }
        }
      }
    });

    return { tenants };
  });

  app.get("/tenants/:tenantId/catalog", async (request, reply) => {
    const { tenantId } = request.params as { tenantId: string };

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        mygServer: true,
        mygDatabase: true,
        status: true
      }
    });

    if (!tenant) {
      return reply.code(404).send({ error: "Tenant not found" });
    }

    const [devices, users] = await Promise.all([
      prisma.device.findMany({
        where: { tenantId },
        orderBy: { name: "asc" },
        select: {
          id: true,
          mygDeviceId: true,
          serialNumber: true,
          name: true,
          updatedAt: true
        }
      }),
      prisma.keylessUser.findMany({
        where: { tenantId, active: true },
        orderBy: { name: "asc" },
        select: {
          id: true,
          mygUserId: true,
          mygDriverId: true,
          userReference: true,
          name: true,
          email: true,
          isDriver: true,
          inKeylessGroup: true,
          updatedAt: true
        }
      })
    ]);

    return {
      tenant,
      devices,
      users
    };
  });
}
