export type OIDCConfigurationErrorCode =
  | "missing_issuer"
  | "invalid_issuer_url"
  | "missing_authorization_endpoint"
  | "invalid_authorization_endpoint_url"
  | "missing_token_endpoint"
  | "invalid_token_endpoint_url"
  | "missing_userinfo_endpoint"
  | "invalid_userinfo_endpoint_url"
  | "missing_jwks_uri"
  | "invalid_jwks_uri"
  | "missing_openid_scope"
  | "invalid_response_type"
  | "empty_scopes"
  | "empty_claims";

export type OIDCErrorResponse = {
  error: string;
  description: string;
  uri?: string;
  statusCode?: number;
};
