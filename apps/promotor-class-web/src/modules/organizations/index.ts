/**
 * Organizations domain — M0 boundary file.
 *
 * Canonical types live in @promotor/contracts (Organization, OrganizationId from
 * identity.ts / ids.ts) and MUST be imported from there — never redefined here.
 *
 * M0.6 mock adapter adds the workspace query port (org "Rina Learning Studio", slug "rina").
 */
export * from "./ports";
export * from "./queries";
