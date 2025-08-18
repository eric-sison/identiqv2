import { Hono } from "hono";
import { healthcheckHandler } from "./routes/healthcheck";
import { clientsHandler } from "./routes/clientsHandler";

function createApp() {
  const app = new Hono().basePath("/api");

  const routes = [healthcheckHandler, clientsHandler] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
