import { OIDCConfigurationError } from "./OIDCConfigurationError";
import { isValidUrl } from "@/utils";
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
  private responseTypesSupported: OIDCResponseType[];
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
    this.responseTypesSupported = options.responseTypesSupported;
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
    // Throws OIDCConfigurationError with code missing_issuer
    if (!this.options.issuer) {
      throw new OIDCConfigurationError(
        "missing_issuer",
        "The 'issuer' value is missing in the OIDC provider configuration.",
        1001,
      );
    }

    // Throws OIDCConfigurationError with code invalid_issuer_url
    if (!isValidUrl(this.options.issuer)) {
      throw new OIDCConfigurationError(
        "invalid_issuer_url",
        `The provided 'issuer' value ("${this.options.issuer}") is not a valid URL.`,
        1002,
      );
    }

    // Throws OIDCConfigurationError with code missing_authorization_endpoint
    if (!this.options.authorizationEndpoint) {
      throw new OIDCConfigurationError(
        "missing_authorization_endpoint",
        "The 'authorization_endpoint' is missing in the OIDC provider configuration.",
        1003,
      );
    }

    // Throws OIDCConfigurationError with code invalid_authorization_endpoint_url
    if (!isValidUrl(this.options.authorizationEndpoint)) {
      throw new OIDCConfigurationError(
        "invalid_authorization_endpoint_url",
        `The 'authorization_endpoint' value ("${this.options.authorizationEndpoint}") is not a valid URL.`,
        1004,
      );
    }

    // Throws OIDCConfigurationError with code missing_token_endpoint
    if (!this.options.tokenEndpoint) {
      throw new OIDCConfigurationError(
        "missing_token_endpoint",
        "The 'token_endpoint' is missing in the OIDC provider configuration.",
        1005,
      );
    }

    // Throws OIDCConfigurationError with code invalid_token_endpoint_url
    if (!isValidUrl(this.options.tokenEndpoint)) {
      throw new OIDCConfigurationError(
        "invalid_token_endpoint_url",
        `The 'token_endpoint' value ("${this.options.tokenEndpoint}") is not a valid URL.`,
        1006,
      );
    }

    // Throws OIDCConfigurationError with code missing_userinfo_endpoint
    if (!this.options.userInfoEndpoint) {
      throw new OIDCConfigurationError(
        "missing_userinfo_endpoint",
        "The 'userinfo_endpoint' is missing in the OIDC provider configuration.",
        1007,
      );
    }

    // Throws OIDCConfigurationError with code invalid_userinfo_endpoint_url
    if (!isValidUrl(this.options.userInfoEndpoint)) {
      throw new OIDCConfigurationError(
        "invalid_userinfo_endpoint_url",
        `The 'userinfo_endpoint' value ("${this.options.userInfoEndpoint}") is not a valid URL.`,
        1008,
      );
    }

    // Throws OIDCConfigurationError with code missing_jwks_uri
    if (!this.options.jwksUri) {
      throw new OIDCConfigurationError(
        "missing_jwks_uri",
        "The 'jwks_uri' is missing in the OIDC provider configuration.",
        1009,
      );
    }

    // Throws OIDCConfigurationError with code invalid_jwks_uri
    if (!isValidUrl(this.options.jwksUri)) {
      throw new OIDCConfigurationError(
        "invalid_jwks_uri",
        `The 'jwks_uri' value ("${this.options.jwksUri}") is not a valid URL.`,
        1010,
      );
    }

    // Throws OIDCConfigurationError with code empty_scope
    if (!this.scopesSupported.length) {
      throw new OIDCConfigurationError(
        "empty_scope",
        "The scopes_supported field requires at least one valid scope entry.",
        1011,
      );
    }

    // Throws OIDCConfigurationError with code empty_claims
    if (!this.claimsSupported.length) {
      throw new OIDCConfigurationError(
        "empty_claims",
        "The claims_supported field requires at least one valid claim entry.",
        1012,
      );
    }

    // Throws OIDCConfigurationError with code missing_openid_scope
    if (!this.scopesSupported.includes("openid")) {
      throw new OIDCConfigurationError(
        "missing_openid_scope",
        "scopes_supported must include 'openid'.",
        1013,
      );
    }
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
