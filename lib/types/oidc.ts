import z from "zod";
import { AuthorizationRequestSchema } from "../validators/authorization";

export type OIDCSubjectType = "public" | "pairwise";
export type OIDCIdTokenSigningAlgValue = "RS256" | "HS256" | "ES256" | "PS256" | "none";
export type OIDCScope = "openid" | "profile" | "email" | "address" | "phone" | "offline_access";
export type OIDCCodeChallengeMethod = "S256" | "plain";
export type OIDCGrantType = "authorization_code" | "refresh_token" | "client_credentials";
export type OIDCFlow = "authorization_code" | "implicit" | "hybrid";

export type OIDCResponseType =
  | "code"
  | "token"
  | "id_token"
  | "id_token token"
  | "code id_token"
  | "code token"
  | "code id_token token";

export type OIDCClaim =
  | "sub"
  | "name"
  | "given_name"
  | "family_name"
  | "middle_name"
  | "nickname"
  | "preferred_username"
  | "profile"
  | "picture"
  | "website"
  | "email"
  | "email_verified"
  | "gender"
  | "birthdate"
  | "zoneinfo"
  | "locale"
  | "phone_number"
  | "phone_number_verified"
  | "address"
  | "updated_at";

export type OIDCTokenEndpointAuthMethod =
  | "client_secret_basic"
  | "client_secret_post"
  | "client_secret_jwt"
  | "private_key_jwt"
  | "none";

export type OIDCProviderOptions = {
  issuer: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  jwksUri: string;
  userInfoEndpoint: string;
  scopesSupported: OIDCScope[];
  claimsSupported: OIDCClaim[];
  responseTypesSupported: OIDCResponseType[];
  grantTypesSupported?: OIDCGrantType[];
  subjectTypesSupported?: OIDCSubjectType[];
  idTokenSigningAlgValuesSupported?: OIDCIdTokenSigningAlgValue[];
  tokenEndpointAuthMethodsSupported?: OIDCTokenEndpointAuthMethod[];
  codeChallengeMethodsSupported?: OIDCCodeChallengeMethod[];
};

export type DiscoveryDocument = {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  userinfo_endpoint: string;
  scopes_supported: OIDCScope[];
  claims_supported: OIDCClaim[];
  response_types_supported?: OIDCResponseType[];
  grant_types_supported?: OIDCGrantType[];
  subject_types_supported?: OIDCSubjectType[];
  id_token_signing_alg_values_supported?: OIDCIdTokenSigningAlgValue[];
  token_endpoint_auth_methods_supported?: OIDCTokenEndpointAuthMethod[];
  code_challenge_methods_supported?: OIDCCodeChallengeMethod[];
};

export type AuthorizationRequest = z.infer<typeof AuthorizationRequestSchema>;
