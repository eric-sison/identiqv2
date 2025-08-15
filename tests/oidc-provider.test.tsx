import { OIDCConfigurationError } from "@/lib/OIDCConfigurationError";
import { OIDCProvider } from "@/lib/OIDCProvider";
import { describe, expect, it } from "vitest";

describe("Test OIDC Provider field validation", () => {
  it("Throws missing_issuer error", () => {
    try {
      //@ts-expect-error intentionally removed 'issuer' to test if the function fails
      const oidcProvider = new OIDCProvider({
        //issuer: "http://localhost:3000", //! test case: no issuer
        authorizationEndpoint: "http://localhost:3000/api/authorize",
        tokenEndpoint: "http://localhost:3000/api/tokens",
        jwksUri: "http://localhost:3000/api/.well-known/jwks.json",
        userInfoEndpoint: "http://localhost:3000/api/userinfo",
        scopesSupported: ["openid", "address", "email", "offline_access", "phone", "profile"],
        claimsSupported: ["address"],
      });

      oidcProvider.validateConfiguration();
    } catch (error) {
      expect(error).toBeInstanceOf(OIDCConfigurationError);
      expect((error as OIDCConfigurationError).error).toBe("missing_issuer");
    }
  });

  it("Throws invalid_issuer_url error", () => {
    try {
      const oidcProvider = new OIDCProvider({
        issuer: "<invalid-url>", //! test case: invalid issuer url
        authorizationEndpoint: "http://localhost:3000/api/authorize",
        tokenEndpoint: "http://localhost:3000/api/tokens",
        jwksUri: "http://localhost:3000/api/.well-known/jwks.json",
        userInfoEndpoint: "http://localhost:3000/api/userinfo",
        scopesSupported: ["openid", "address", "email", "offline_access", "phone", "profile"],
        claimsSupported: ["address"],
      });

      oidcProvider.validateConfiguration();
    } catch (error) {
      expect(error).toBeInstanceOf(OIDCConfigurationError);
      expect((error as OIDCConfigurationError).error).toBe("invalid_issuer_url");
    }
  });

  it("Throws missing_authorization_endpoint error", () => {
    try {
      //@ts-expect-error intentionally removed 'authorizationEndpoint' to test if the function fails
      const oidcProvider = new OIDCProvider({
        issuer: "http://localhost:3000",
        //authorizationEndpoint: "http://localhost:3000/api/authorize", //! test case: no authorization_endpoint field
        tokenEndpoint: "http://localhost:3000/api/tokens",
        jwksUri: "http://localhost:3000/api/.well-known/jwks.json",
        userInfoEndpoint: "http://localhost:3000/api/userinfo",
        scopesSupported: ["openid", "address", "email", "offline_access", "phone", "profile"],
        claimsSupported: ["address"],
      });

      oidcProvider.validateConfiguration();
    } catch (error) {
      expect(error).toBeInstanceOf(OIDCConfigurationError);
      expect((error as OIDCConfigurationError).error).toBe("missing_authorization_endpoint");
    }
  });

  it("Throws invalid_authorization_endpoint_url error", () => {
    try {
      const oidcProvider = new OIDCProvider({
        issuer: "http://localhost:3000",
        authorizationEndpoint: "<invalid-url>", //! test case: invalid authorization_endpoint url
        tokenEndpoint: "http://localhost:3000/api/tokens",
        jwksUri: "http://localhost:3000/api/.well-known/jwks.json",
        userInfoEndpoint: "http://localhost:3000/api/userinfo",
        scopesSupported: ["openid", "address", "email", "offline_access", "phone", "profile"],
        claimsSupported: ["address"],
      });

      oidcProvider.validateConfiguration();
    } catch (error) {
      expect(error).toBeInstanceOf(OIDCConfigurationError);
      expect((error as OIDCConfigurationError).error).toBe("invalid_authorization_endpoint_url");
    }
  });

  it("Throws missing_token_endpoint error", () => {
    try {
      //@ts-expect-error intentionally removed 'tokenEndpoint' to test if the function fails
      const oidcProvider = new OIDCProvider({
        issuer: "http://localhost:3000",
        authorizationEndpoint: "http://localhost:3000/api/authorize",
        //tokenEndpoint: "http://localhost:3000/api/tokens", //! test case: no token_endpoint field
        jwksUri: "http://localhost:3000/api/.well-known/jwks.json",
        userInfoEndpoint: "http://localhost:3000/api/userinfo",
        scopesSupported: ["openid", "address", "email", "offline_access", "phone", "profile"],
        claimsSupported: ["address"],
      });

      oidcProvider.validateConfiguration();
    } catch (error) {
      expect(error).toBeInstanceOf(OIDCConfigurationError);
      expect((error as OIDCConfigurationError).error).toBe("missing_token_endpoint");
    }
  });

  it("Throws invalid_token_endpoint_url error", () => {
    try {
      const oidcProvider = new OIDCProvider({
        issuer: "http://localhost:3000",
        authorizationEndpoint: "http://localhost:3000/api/authorize",
        tokenEndpoint: "<invalid-url>", //! test case: invalid token_endpoint url
        jwksUri: "http://localhost:3000/api/.well-known/jwks.json",
        userInfoEndpoint: "http://localhost:3000/api/userinfo",
        scopesSupported: ["openid", "address", "email", "offline_access", "phone", "profile"],
        claimsSupported: ["address"],
      });

      oidcProvider.validateConfiguration();
    } catch (error) {
      expect(error).toBeInstanceOf(OIDCConfigurationError);
      expect((error as OIDCConfigurationError).error).toBe("invalid_token_endpoint_url");
    }
  });

  it("Throws missing_userinfo_endpoint error", () => {
    try {
      //@ts-expect-error intentionally removed 'userInfoEndpoint' to test if the function fails
      const oidcProvider = new OIDCProvider({
        issuer: "http://localhost:3000",
        authorizationEndpoint: "http://localhost:3000/api/authorize",
        tokenEndpoint: "http://localhost:3000/api/tokens",
        jwksUri: "http://localhost:3000/api/.well-known/jwks.json",
        // userInfoEndpoint: "http://localhost:3000/api/userinfo", //! test case: no userinfo_endpoint field
        scopesSupported: ["openid", "address", "email", "offline_access", "phone", "profile"],
        claimsSupported: ["address"],
      });

      oidcProvider.validateConfiguration();
    } catch (error) {
      expect(error).toBeInstanceOf(OIDCConfigurationError);
      expect((error as OIDCConfigurationError).error).toBe("missing_userinfo_endpoint");
    }
  });

  it("Throws invalid_userinfo_endpoint_url error", () => {
    try {
      const oidcProvider = new OIDCProvider({
        issuer: "http://localhost:3000",
        authorizationEndpoint: "http://localhost:3000/api/authorize",
        tokenEndpoint: "http://localhost:3000/api/tokens",
        jwksUri: "http://localhost:3000/api/.well-known/jwks.json",
        userInfoEndpoint: "<invalid-url>", //! test case: invalid userinfo_endpoint field
        scopesSupported: ["openid", "address", "email", "offline_access", "phone", "profile"],
        claimsSupported: ["address"],
      });

      oidcProvider.validateConfiguration();
    } catch (error) {
      expect(error).toBeInstanceOf(OIDCConfigurationError);
      expect((error as OIDCConfigurationError).error).toBe("invalid_userinfo_endpoint_url");
    }
  });

  it("Throws missing_jwks_uri error", () => {
    try {
      //@ts-expect-error intentionally removed 'userInfoEndpoint' to test if the function fails
      const oidcProvider = new OIDCProvider({
        issuer: "http://localhost:3000",
        authorizationEndpoint: "http://localhost:3000/api/authorize",
        tokenEndpoint: "http://localhost:3000/api/tokens",
        // jwksUri: "http://localhost:3000/api/.well-known/jwks.json", //! test case: missing jwks_uri field
        userInfoEndpoint: "http://localhost:3000/api/userinfo",
        scopesSupported: ["openid", "address", "email", "offline_access", "phone", "profile"],
        claimsSupported: ["address"],
      });

      oidcProvider.validateConfiguration();
    } catch (error) {
      expect(error).toBeInstanceOf(OIDCConfigurationError);
      expect((error as OIDCConfigurationError).error).toBe("missing_jwks_uri");
    }
  });

  it("Throws invalid_jwks_uri error", () => {
    try {
      const oidcProvider = new OIDCProvider({
        issuer: "http://localhost:3000",
        authorizationEndpoint: "http://localhost:3000/api/authorize",
        tokenEndpoint: "http://localhost:3000/api/tokens",
        jwksUri: "<invalid-url>", //! test case: invalid jwks_uri field
        userInfoEndpoint: "http://localhost:3000/api/userinfo",
        scopesSupported: ["openid", "address", "email", "offline_access", "phone", "profile"],
        claimsSupported: ["address"],
      });

      oidcProvider.validateConfiguration();
    } catch (error) {
      expect(error).toBeInstanceOf(OIDCConfigurationError);
      expect((error as OIDCConfigurationError).error).toBe("invalid_jwks_uri");
    }
  });

  it("Throws missing_openid_scope error", () => {
    try {
      const oidcProvider = new OIDCProvider({
        issuer: "http://localhost:3000",
        authorizationEndpoint: "http://localhost:3000/api/authorize",
        tokenEndpoint: "http://localhost:3000/api/tokens",
        jwksUri: "http://localhost:3000/api/.well-known/jwks.json",
        userInfoEndpoint: "http://localhost:3000/api/userinfo",
        scopesSupported: ["address", "email", "offline_access", "phone", "profile"], //! test case: no openid scope
        claimsSupported: ["address"],
      });

      oidcProvider.validateConfiguration();
    } catch (error) {
      expect(error).toBeInstanceOf(OIDCConfigurationError);
      expect((error as OIDCConfigurationError).error).toBe("missing_openid_scope");
    }
  });

  it("Throws empty_scope error", () => {
    try {
      const oidcProvider = new OIDCProvider({
        issuer: "http://localhost:3000",
        authorizationEndpoint: "http://localhost:3000/api/authorize",
        tokenEndpoint: "http://localhost:3000/api/tokens",
        jwksUri: "http://localhost:3000/api/.well-known/jwks.json",
        userInfoEndpoint: "http://localhost:3000/api/userinfo",
        scopesSupported: [],
        claimsSupported: ["address"],
      });

      oidcProvider.validateConfiguration();
    } catch (error) {
      expect(error).toBeInstanceOf(OIDCConfigurationError);
      expect((error as OIDCConfigurationError).error).toBe("empty_scope");
    }
  });

  it("Throws empty_claims error", () => {
    try {
      const oidcProvider = new OIDCProvider({
        issuer: "http://localhost:3000",
        authorizationEndpoint: "http://localhost:3000/api/authorize",
        tokenEndpoint: "http://localhost:3000/api/tokens",
        jwksUri: "http://localhost:3000/api/.well-known/jwks.json",
        userInfoEndpoint: "http://localhost:3000/api/userinfo",
        scopesSupported: ["openid"],
        claimsSupported: [],
      });

      oidcProvider.validateConfiguration();
    } catch (error) {
      expect(error).toBeInstanceOf(OIDCConfigurationError);
      expect((error as OIDCConfigurationError).error).toBe("empty_claims");
    }
  });
});

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
