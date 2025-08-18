import { clientGrantTypes, clientRedirectURIs, clients, clientScopes } from "@/db/schemas/client";
import {
  Client,
  ClientData,
  SelectClientGrantType,
  SelectClientRedirectURI,
  SelectClientScope,
  UpdateClient,
} from "./types/oidc";
import { generateClientSecret } from "@/utils/helpers";
import { eq } from "drizzle-orm";
import { paginate } from "@/utils/paginate";
import db from "@/db/connection";

export class ClientRepository {
  async create(clientData: ClientData): Promise<Client> {
    const { client, options } = clientData;

    // Placeholders for metadata; will be populated if provided in options
    let scopes: SelectClientScope[] = [];
    let redirectURIs: SelectClientRedirectURI[] = [];
    let grantTypes: SelectClientGrantType[] = [];

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
  }

  /**
   * Fetches all clients with pagination.
   *
   * @param page - The page number (defaults to 1 if not provided).
   * @param limit - The number of records per page (defaults to 10 if not provided).
   * @returns A paginated list of clients.
   */
  async findAll(page?: number, limit?: number) {
    return await paginate(clients, page, limit);
  }

  /**
   * Retrieves a single client by its ID, including related scopes,
   * redirect URIs, and grant types.
   *
   * @param clientId - The unique identifier of the client.
   * @throws Error if the client is not found.
   * @returns The client with its related entities.
   */
  async findById(clientId: string) {
    const client = await db.query.clients.findFirst({
      where: (clients, { eq }) => eq(clients.id, clientId),
      with: {
        scopes: {
          columns: {
            grantedAt: true,
            grantedBy: true,
          },
          with: {
            scope: {
              columns: {
                id: true,
                name: true,
                description: true,
                isActive: true,
                isDefault: true,
              },
            }, // pull in scope details
          },
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

  /**
   * Updates a client record by its ID.
   *
   * @param clientId - The unique identifier of the client.
   * @param clientData - Partial client data to update.
   * @returns The updated client record.
   * @throws Error if the update fails.
   */
  async update(clientId: string, clientData: UpdateClient) {
    const result = await db.update(clients).set(clientData).where(eq(clients.id, clientId)).returning();
    return result[0];
  }

  /**
   * Deletes a client by its ID.
   *
   * @param clientId - The unique identifier of the client.
   * @returns The result of the delete operation.
   * @throws Error if the delete fails.
   */
  async delete(clientId: string) {
    const result = await db.delete(clients).where(eq(clients.id, clientId)).returning({ id: clients.id });

    if (!result.length) {
      throw new Error("Not found!");
    }

    return true;
  }
}
