import { ClientRepository } from "./ClientRepository";
import { ClientData, UpdateClient } from "./types/oidc";

export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async create(clientData: ClientData) {
    return await this.clientRepository.create(clientData);
  }

  async findAll(page?: number, limit?: number) {
    return await this.clientRepository.findAll(page, limit);
  }

  async findById(clientId: string) {
    return await this.clientRepository.findById(clientId);
  }

  async update(clientId: string, clientData: UpdateClient) {
    return await this.clientRepository.update(clientId, clientData);
  }

  async delete(clientId: string) {
    return await this.clientRepository.delete(clientId);
  }
}
