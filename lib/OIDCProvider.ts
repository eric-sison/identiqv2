import { OIDCConfigurationError } from "./OIDCConfigurationError";
import { isValidUrl } from "@/utils/helpers";
import {
  DiscoveryDocument,
  OIDCClaim,
  OIDCCodeChallengeMethod,
  OIDCGrantType,
  OIDCIdTokenSigningAlgValue,
  OIDCProviderOptions,
  OIDCResponseType,
  OIDCScope,
  OIDCSubjectType,
  OIDCTokenEndpointAuthMethod,
} from "./types/oidc";

export class OIDCProvider {
  private issuer: string;
  private authorizationEndpoint: string;
  private tokenEndpoint: string;
  private jwksUri: string;
  private userinfoEndpoint: string;
  private scopesSupported: OIDCScope[];
  private claimsSupported: OIDCClaim[];
  private responseTypesSupported?: OIDCResponseType[];
  private grantTypesSupported?: OIDCGrantType[];
  private subjectTypesSupported?: OIDCSubjectType[];
  private idTokenSigningAlgValuesSupported?: OIDCIdTokenSigningAlgValue[];
  private tokenEndpointAuthMethodsSupported?: OIDCTokenEndpointAuthMethod[];
  private codeChallengeMethodsSupported?: OIDCCodeChallengeMethod[];

  constructor(private readonly options: OIDCProviderOptions) {
    this.issuer = options.issuer;
    this.authorizationEndpoint = options.authorizationEndpoint;
    this.tokenEndpoint = options.tokenEndpoint;
    this.jwksUri = options.jwksUri;
    this.scopesSupported = options.scopesSupported;
    this.claimsSupported = options.claimsSupported;
    this.userinfoEndpoint = options.userInfoEndpoint;
    this.responseTypesSupported = options.responseTypesSupported ?? [
      "code",
      "code id_token",
      "code id_token token",
      "code token",
      "id_token",
      "id_token token",
      "token",
    ];
    this.grantTypesSupported = options.grantTypesSupported ?? [
      "authorization_code",
      "client_credentials",
      "refresh_token",
    ];
    this.subjectTypesSupported = options.subjectTypesSupported ?? ["pairwise", "public"];
    this.idTokenSigningAlgValuesSupported = options.idTokenSigningAlgValuesSupported ?? ["RS256", "ES256"];
    this.tokenEndpointAuthMethodsSupported = options.tokenEndpointAuthMethodsSupported ?? [
      "client_secret_basic",
    ];
    this.codeChallengeMethodsSupported = options.codeChallengeMethodsSupported ?? ["S256", "plain"];
  }

  public validateConfiguration() {
    // Issuer is a required field
    if (!this.options.issuer) {
      throw new OIDCConfigurationError(
        "missing_issuer",
        "The 'issuer' value is missing in the OIDC provider configuration.",
      );
    }

    // Issuer must be a valid url
    if (!isValidUrl(this.options.issuer)) {
      throw new OIDCConfigurationError(
        "invalid_issuer_url",
        `The provided 'issuer' value ("${this.options.issuer}") is not a valid URL.`,
      );
    }

    if (!this.options.authorizationEndpoint) {
      throw new OIDCConfigurationError(
        "missing_authorization_endpoint",
        "The 'authorization_endpoint' is missing in the OIDC provider configuration.",
      );
    }

    if (!isValidUrl(this.options.authorizationEndpoint)) {
      throw new OIDCConfigurationError(
        "invalid_authorization_endpoint_url",
        `The 'authorization_endpoint' value ("${this.options.authorizationEndpoint}") is not a valid URL.`,
      );
    }

    if (!this.options.tokenEndpoint) {
      throw new OIDCConfigurationError(
        "missing_token_endpoint",
        "The 'token_endpoint' is missing in the OIDC provider configuration.",
      );
    }

    if (!isValidUrl(this.options.tokenEndpoint)) {
      throw new OIDCConfigurationError(
        "invalid_token_endpoint_url",
        `The 'token_endpoint' value ("${this.options.tokenEndpoint}") is not a valid URL.`,
      );
    }

    if (!this.options.userInfoEndpoint) {
      throw new OIDCConfigurationError(
        "missing_userinfo_endpoint",
        "The 'userinfo_endpoint' is missing in the OIDC provider configuration.",
      );
    }

    if (!isValidUrl(this.options.userInfoEndpoint)) {
      throw new OIDCConfigurationError(
        "invalid_userinfo_endpoint_url",
        `The 'userinfo_endpoint' value ("${this.options.userInfoEndpoint}") is not a valid URL.`,
      );
    }

    if (!this.options.jwksUri) {
      throw new OIDCConfigurationError(
        "missing_jwks_uri",
        "The 'jwks_uri' is missing in the OIDC provider configuration.",
      );
    }

    if (!isValidUrl(this.options.jwksUri)) {
      throw new OIDCConfigurationError(
        "invalid_jwks_uri",
        `The 'jwks_uri' value ("${this.options.jwksUri}") is not a valid URL.`,
      );
    }

    if (!this.scopesSupported.includes("openid")) {
      throw new OIDCConfigurationError("missing_openid_scope", "scopes_supported must include 'openid'.");
    }

    if (!this.scopesSupported.length) {
      throw new OIDCConfigurationError("empty_scopes", "scopes_supported cannot be empty.");
    }

    if (!this.claimsSupported.length) {
      throw new OIDCConfigurationError("empty_claims", "claims_supported cannot be empty.");
    }
  }

  public getIssuer() {
    return this.issuer;
  }

  public getAuthorizationEndpoint() {
    return this.authorizationEndpoint;
  }

  public getTokenEndpoint() {
    return this.tokenEndpoint;
  }

  public getJwksUri() {
    return this.jwksUri;
  }

  public getUserinfoEndpoint() {
    return this.userinfoEndpoint;
  }

  public getScopesSupported() {
    return this.scopesSupported;
  }

  public getClaimsSupported() {
    return this.claimsSupported;
  }

  public getResponseTypesSupported() {
    return this.responseTypesSupported;
  }

  public getGrantTypesSupported() {
    return this.grantTypesSupported;
  }

  public getSubjectTypesSupported() {
    return this.subjectTypesSupported;
  }

  public getIdTokenSigningAlgValuesSupported() {
    return this.idTokenSigningAlgValuesSupported;
  }

  public getTokenEndpointAuthMethodsSupported() {
    return this.tokenEndpointAuthMethodsSupported;
  }

  public getCodeChallengeMethodsSupported() {
    return this.codeChallengeMethodsSupported;
  }

  public getDiscoveryDocument(): DiscoveryDocument {
    return {
      issuer: this.issuer,
      authorization_endpoint: this.authorizationEndpoint,
      token_endpoint: this.tokenEndpoint,
      jwks_uri: this.jwksUri,
      userinfo_endpoint: this.userinfoEndpoint,
      scopes_supported: this.scopesSupported,
      claims_supported: this.claimsSupported,
      response_types_supported: this.responseTypesSupported,
      grant_types_supported: this.grantTypesSupported,
      subject_types_supported: this.subjectTypesSupported,
      id_token_signing_alg_values_supported: this.idTokenSigningAlgValuesSupported,
      token_endpoint_auth_methods_supported: this.tokenEndpointAuthMethodsSupported,
      code_challenge_methods_supported: this.codeChallengeMethodsSupported,
    };
  }
}
