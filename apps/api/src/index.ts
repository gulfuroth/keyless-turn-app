import Fastify from "fastify";
import { healthRoutes } from "./routes/health.js";
import { syncRoutes } from "./routes/sync.js";

const app = Fastify({ logger: true });

app.register(healthRoutes);
app.register(syncRoutes, { prefix: "/api" });

const port = Number(process.env.PORT || 8081);

app
  .listen({ port, host: "0.0.0.0" })
  .then(() => {
    app.log.info(`API ready on :${port}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
