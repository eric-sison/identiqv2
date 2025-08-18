import z from "zod";
import { AuthorizationRequestSchema } from "../validators/authorization";
import {
  ClientDataSchema,
  InsertClientGrantTypeSchema,
  InsertClientRedirectURISchema,
  InsertClientSchema,
  InsertClientScopeSchema,
  InsertOAuthScopeSchema,
  SelectClientGrantTypeSchema,
  SelectClientRedirectURISchema,
  SelectClientSchema,
  SelectClientScopeSchema,
  SelectOAuthScopeSchema,
  UpdateClientGrantTypeSchema,
  UpdateClientRedirectURISchema,
  UpdateClientSchema,
  UpdateClientScopeSchema,
  UpdateOAuthScopeSchema,
} from "@/db/schemas/client";

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

export type SelectClient = z.infer<typeof SelectClientSchema>;
export type InsertClient = z.infer<typeof InsertClientSchema>;
export type UpdateClient = z.infer<typeof UpdateClientSchema>;

export type SelectOAuthScope = z.infer<typeof SelectOAuthScopeSchema>;
export type InsertOAuthScope = z.infer<typeof InsertOAuthScopeSchema>;
export type UpdateOAuthScope = z.infer<typeof UpdateOAuthScopeSchema>;

export type SelectClientRedirectURI = z.infer<typeof SelectClientRedirectURISchema>;
export type InsertClientRedirectURI = z.infer<typeof InsertClientRedirectURISchema>;
export type UpdateClientRedirectURI = z.infer<typeof UpdateClientRedirectURISchema>;

export type SelectClientScope = z.infer<typeof SelectClientScopeSchema>;
export type InsertClientScope = z.infer<typeof InsertClientScopeSchema>;
export type UpdateClientScope = z.infer<typeof UpdateClientScopeSchema>;

export type SelectClientGrantType = z.infer<typeof SelectClientGrantTypeSchema>;
export type InsertClientGrantType = z.infer<typeof InsertClientGrantTypeSchema>;
export type UpdateClientGrantType = z.infer<typeof UpdateClientGrantTypeSchema>;

export type ClientData = z.infer<typeof ClientDataSchema>;

export type Client = {
  client: SelectClient;
  scopes: SelectClientScope[];
  redirectURIs: SelectClientRedirectURI[];
  grantTypes: SelectClientGrantType[];
};
