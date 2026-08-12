/**
 * Canonical API-client error type (spec §6.3, "API error mapping").
 *
 * Reserves the error-mapping boundary for the future HTTP layer. M0 has no
 * backend, so this stays a single typed error class — no taxonomy until a real
 * API exists to map.
 */

export class ApiClientError extends Error {
  override name = "ApiClientError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}