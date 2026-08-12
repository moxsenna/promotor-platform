/**
 * Deterministic sequential mock ids ("evt_055", "sig_006", "contact_006", ...).
 *
 * Computed from the ids already present in state, so resetDemo() + replay
 * produces byte-identical ids. No global counter — the store owns the source
 * of truth.
 */
export function nextSequentialId(ids: readonly string[], prefix: string, width = 3): string {
  const pattern = new RegExp(`^${prefix}(\\d+)$`);
  let max = 0;
  for (const id of ids) {
    const match = pattern.exec(id);
    const suffix = match?.[1];
    if (suffix !== undefined) {
      const value = Number(suffix);
      if (value > max) max = value;
    }
  }
  return `${prefix}${String(max + 1).padStart(width, "0")}`;
}

/**
 * Narrow a plain mock id string to a contracts branded id
 * (ContactId, EnrollmentId, ...). Mock state stores plain strings; the
 * branded types exist at the contracts/API surface.
 */
export function brandId<T extends string>(value: string): T {
  return value as T;
}
