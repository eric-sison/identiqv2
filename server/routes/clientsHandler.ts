import { ClientDataSchema, UpdateClientSchema } from "@/db/schemas/client";
import { ClientRepository } from "@/lib/ClientRepository";
import { ClientService } from "@/lib/ClientService";
import { PaginatedSchema } from "@/lib/validators/common";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

//* temporary initialization
// Note: for testing only
const clientRepository = new ClientRepository();
const clientService = new ClientService(clientRepository);

export const clientsHandler = new Hono()
  .basePath("/clients")
  .get("/", zValidator("query", PaginatedSchema), async (c) => {
    const { page, limit } = c.req.valid("query");
    const result = await clientService.findAll(page, limit);
    return c.json(result);
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const result = await clientService.findById(id);
    return c.json(result);
  })
  .post("/", zValidator("json", ClientDataSchema), async (c) => {
    const clientData = c.req.valid("json");
    const result = await clientService.create(clientData);
    return c.json(result);
  })
  .patch("/:id", zValidator("json", UpdateClientSchema), async (c) => {
    const { id } = c.req.param();
    const clientData = c.req.valid("json");
    const result = await clientService.update(id, clientData);
    return c.json(result);
  })
  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    const result = await clientService.delete(id);
    return c.json(result);
  });
