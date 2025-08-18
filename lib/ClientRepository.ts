import { clientGrantTypes, clientRedirectURIs, clients, clientScopes } from "@/db/schemas/client";
import {
  Client,
  ClientData,
  SelectClientGrantType,
  SelectClientRedirectURI,
  SelectClientScope,
  UpdateClient,
} from "./types/oidc";
import db from "@/db/connection";
import { generateClientSecret, paginate } from "@/utils/helpers";
import { count, eq } from "drizzle-orm";

export class ClientRepository {
  async create(clientData: ClientData): Promise<Client> {
    const { client, options } = clientData;

    // Placeholders for metadata; will be populated if provided in options
    let scopes: SelectClientScope[] = [];
    let redirectURIs: SelectClientRedirectURI[] = [];
    let grantTypes: SelectClientGrantType[] = [];

    try {
      // Wrap operations in a transaction so all inserts succeed/fail together
      return await db.transaction(async (tx) => {
        // Confidential clients receive a generated secret; public clients do not
        const newClient = await tx
          .insert(clients)
          .values({ ...client, secret: client.clientType === "confidential" ? generateClientSecret() : null })
          .returning();
        const clientId = newClient[0].id;

        // --- Insert Scopes ---
        if (options?.scopes) {
          // Insert each scope associated with this client and return them
          const newScopes = await Promise.all(
            options.scopes.map(
              async (scope) =>
                await tx
                  .insert(clientScopes)
                  .values({ ...scope, clientId }) // Attach clientId
                  .returning(),
            ),
          );

          // Flatten the nested array of new scopes
          scopes = newScopes.flat();
        }

        // --- Insert Redirect URIs ---
        if (options?.redirectURIs) {
          // Insert each redirect URI for the client
          const newRedirectURIs = await Promise.all(
            options.redirectURIs.map(
              async (redirectURI) =>
                await tx
                  .insert(clientRedirectURIs)
                  .values({ ...redirectURI, clientId }) // Attach clientId
                  .returning(),
            ),
          );

          // Flatten results
          redirectURIs = newRedirectURIs.flat();
        }

        // --- Insert Grant Types ---
        if (options?.grantTypes) {
          // Insert each grant type for the client
          const newGrantTypes = await Promise.all(
            options.grantTypes.map(
              async (grantType) =>
                await tx
                  .insert(clientGrantTypes)
                  .values({ ...grantType, clientId }) // Attach clientId
                  .returning(),
            ),
          );

          // Flatten results
          grantTypes = newGrantTypes.flat();
        }

        // Return the result of the transaction (client + metadata)
        return {
          client: newClient[0],
          scopes,
          redirectURIs,
          grantTypes,
        };
      });
    } catch (error) {
      // TODO: [feature] - add custom logger
      console.error(error);
      throw error;
    }
  }

  async findAll(page?: number, limit?: number) {
    return await paginate(clients, page, limit);
  }

  async findById(clientId: string) {
    const client = await db.query.clients.findFirst({
      where: (clients, { eq }) => eq(clients.id, clientId),
      with: {
        scopes: {
          with: { scope: true }, // pull in scope details
        },
        redirectURIs: true,
        grantTypes: true,
      },
    });

    if (!client) {
      throw new Error("Not found!");
    }

    return client;
  }

  async update(clientId: string, clientData: UpdateClient) {
    try {
      return await db.update(clients).set(clientData).where(eq(clients.id, clientId)).returning();
    } catch (error) {
      // TODO: [feature] - add custom logger
      console.error(error);
      throw error;
    }
  }

  async delete(clientId: string) {
    try {
      return await db.delete(clients).where(eq(clients.id, clientId));
    } catch (error) {
      // TODO: [feature] - add custom logger
      console.error(error);
      throw error;
    }
  }
}
