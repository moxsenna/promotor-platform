import { describe, expect, it } from "vitest";

import { ApiClient } from "./client";
import { ApiClientError } from "./errors";

describe("ApiClient", () => {
  it("holds the given config", () => {
    const client = new ApiClient({ baseUrl: "https://api.example.com" });
    expect(client.config.baseUrl).toBe("https://api.example.com");
    expect(client.config.getAccessToken).toBeUndefined();
  });

  it("rejects an empty baseUrl", () => {
    expect(() => new ApiClient({ baseUrl: "" })).toThrow(ApiClientError);
  });

  it("keeps the optional access-token provider", () => {
    const getAccessToken = async () => "token";
    const client = new ApiClient({ baseUrl: "https://api.example.com", getAccessToken });
    expect(client.config.getAccessToken).toBe(getAccessToken);
  });
});