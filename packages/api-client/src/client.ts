import { ApiClientError } from "./errors";

/**
 * Configuration for the canonical Promotor HTTP/API boundary (spec §6.3).
 */
export type ApiClientConfig = {
  baseUrl: string;
  getAccessToken?: () => Promise<string | null>;
};

/**
 * Minimal shell for the canonical HTTP/API boundary.
 *
 * M0 has no backend: the client only stores validated config. No endpoint
 * strings and no generic request() method — those are invented only once a
 * real API exists.
 */
export class ApiClient {
  readonly config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    if (config.baseUrl.trim().length === 0) {
      throw new ApiClientError("ApiClient requires a non-empty baseUrl");
    }
    this.config = config;
  }
}
