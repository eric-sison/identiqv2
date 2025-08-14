import { OIDCProvider } from "@/lib/OIDCProvider";
import { describe, expect, it } from "vitest";

describe("Test OIDC Provider setup", () => {
  it("Should return the correct default values for optional fields", () => {
    const oidcProvider = new OIDCProvider({
      issuer: "http://localhost:3000",
      authorizationEndpoint: "http://localhost:3000/api/authorize",
      tokenEndpoint: "http://localhost:3000/api/tokens",
      jwksUri: "http://localhost:3000/api/.well-known/jwks.json",
      userInfoEndpoint: "http://localhost:3000/api/userinfo",
      scopesSupported: ["openid", "address", "email", "offline_access", "phone", "profile"],
      claimsSupported: ["address"],
    });

    const discoveryDocument = oidcProvider.getDiscoveryDocument();

    expect(discoveryDocument).toEqual({
      issuer: "http://localhost:3000",
      authorization_endpoint: "http://localhost:3000/api/authorize",
      token_endpoint: "http://localhost:3000/api/tokens",
      jwks_uri: "http://localhost:3000/api/.well-known/jwks.json",
      userinfo_endpoint: "http://localhost:3000/api/userinfo",
      scopes_supported: ["openid", "address", "email", "offline_access", "phone", "profile"],
      claims_supported: ["address"],
      response_types_supported: [
        "code",
        "code id_token",
        "code id_token token",
        "code token",
        "id_token",
        "id_token token",
        "token",
      ],
      grant_types_supported: ["authorization_code", "client_credentials", "refresh_token"],
      subject_types_supported: ["pairwise", "public"],
      id_token_signing_alg_values_supported: ["RS256", "ES256"],
      token_endpoint_auth_methods_supported: ["client_secret_basic"],
      code_challenge_methods_supported: ["S256", "plain"],
    });
  });
});
