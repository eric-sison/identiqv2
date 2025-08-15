# OIDCProvider Class Documentation

The `OIDCProvider` class represents a configurable OpenID Connect (OIDC) Provider that validates and serves OIDC-compliant metadata.  
It is intended for implementing your own Authorization Server following the [OpenID Connect Core specification](https://openid.net/specs/openid-connect-core-1_0.html).

---

## Table of Contents

- [Overview](#overview)
- [Constructor](#constructor)
- [Configuration Options](#configuration-options)
- [Error Handling](#error-handling)
- [Example Usage](#example-usage)
- [Validation Rules](#validation-rules)
- [Related Specifications](#related-specifications)

---

## Overview

`OIDCProvider` accepts a configuration object that defines your provider's endpoints, capabilities, and supported features.  
The class automatically validates the configuration against OIDC requirements and throws detailed `OIDCConfigurationError` exceptions for misconfigurations.

---

## Constructor

```ts
new OIDCProvider(config: OIDCProviderOptions)
```

## Configuration Options

| Field                           | Type       | Required | Description                                                                     | Example                                            |
| ------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------- | -------------------------------------------------- |
| `issuer`                        | `string`   | ✅ Yes   | The issuer identifier for the provider, must be a valid HTTPS URL.              | `"https://auth.example.com"`                       |
| `authorizationEndpoint`         | `string`   | ✅ Yes   | The authorization endpoint URL.                                                 | `"https://auth.example.com/oauth2/authorize"`      |
| `tokenEndpoint`                 | `string`   | ✅ Yes   | The token endpoint URL.                                                         | `"https://auth.example.com/oauth2/token"`          |
| `userinfoEndpoint`              | `string`   | ✅ Yes   | The user info endpoint URL.                                                     | `"https://auth.example.com/oauth2/userinfo"`       |
| `jwksUri`                       | `string`   | ✅ Yes   | The JSON Web Key Set (JWKS) URI for public keys.                                | `"https://auth.example.com/.well-known/jwks.json"` |
| `scopesSupported`               | `string[]` | ✅ Yes   | The list of supported OAuth 2.0 / OIDC scopes. Must contain at least one value. | `["openid", "profile", "email"]`                   |
| `responseTypesSupported`        | `string[]` | ✅ Yes   | The supported OAuth 2.0 response types.                                         | `["code", "id_token", "token id_token"]`           |
| `grantTypesSupported`           | `string[]` | ❌ No    | The supported OAuth 2.0 grant types. Defaults to standard OIDC grants.          | `["authorization_code", "implicit"]`               |
| `codeChallengeMethodsSupported` | `string[]` | ❌ No    | The supported PKCE code challenge methods.                                      | `["S256", "plain"]`                                |
| `errorUri`                      | `string`   | ❌ No    | A documentation link providing more information about error codes.              | `"https://auth.example.com/docs/errors"`           |
