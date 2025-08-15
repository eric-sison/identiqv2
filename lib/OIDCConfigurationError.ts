import { OIDCConfigurationErrorCode, OIDCErrorResponse } from "./types/errors";

export class OIDCConfigurationError extends Error {
  constructor(
    public readonly error: OIDCConfigurationErrorCode,
    public readonly description: string,
    public readonly statusCode?: number,
    public readonly uri?: string,
  ) {
    super(description || error);
    this.name = "OIDCConfigurationError";
    this.error = error;
    this.description = description;
    this.uri = uri;
    this.statusCode = statusCode ?? 400;
  }

  toJSON() {
    const response: OIDCErrorResponse = {
      error: this.error,
      description: this.description,
    };

    if (this.statusCode) {
      response.statusCode = this.statusCode;
    }

    if (this.uri) {
      response.uri = this.uri;
    }

    return response;
  }
}
