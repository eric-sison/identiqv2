import { ClientService } from "./ClientService";
import { OIDCProvider } from "./OIDCProvider";
import { AuthorizationRequest } from "./types/oidc";

export class AuthorizationService {
  constructor(
    private readonly oidcProvider: OIDCProvider,
    private readonly clientService: ClientService,
  ) {}

  public async validateAuthorizationRequest(request: AuthorizationRequest) {
    const client = await this.clientService.findById(request.client_id);
  }
}
