import { FastifyInstance } from "fastify";
import { z } from "zod";
import { syncEligibleCatalog } from "../services/mygeotab-client.js";

const syncBodySchema = z.object({
  mygServer: z.string().min(1),
  mygDatabase: z.string().min(1),
  mygUserName: z.string().min(1),
  mygPassword: z.string().min(1),
  mode: z.enum(["real", "mock"]).default("real")
});

const mockResult = {
  devices: [
    { id: "d1", serialNumber: "G9TEST0001", name: "Van 01" },
    { id: "d2", serialNumber: "G9TEST0002", name: "Van 02" }
  ],
  users: [
    {
      id: "u-driver-1",
      source: "driver",
      name: "Driver One",
      email: "driver.one@example.com",
      userReference: "driver:d1",
      isDriver: true,
      inKeylessGroup: false
    },
    {
      id: "u-user-2",
      source: "group",
      name: "Group User",
      email: "group.user@example.com",
      userReference: "user:u2",
      isDriver: false,
      inKeylessGroup: true
    }
  ]
};

export async function syncRoutes(app: FastifyInstance): Promise<void> {
  app.post("/tenants/sync/eligible", async (request, reply) => {
    const parsed = syncBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const body = parsed.data;
    if (body.mode === "mock") {
      return {
        source: "mock",
        ...mockResult
      };
    }

    try {
      const data = await syncEligibleCatalog(body);
      return {
        source: "mygeotab",
        ...data
      };
    } catch (err) {
      const detail = err instanceof Error ? err.message : "Unknown error";
      return reply.code(502).send({ error: "Sync failed", detail });
    }
  });
}
