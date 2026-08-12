/**
 * Promotor navigation data — shared by PromotorSidebar and PromotorMobileNav.
 * hrefs follow the M0 route set (T10): /app, /app/programs, /app/learners,
 * /app/activity, /app/templates. Product-specific; not a universal nav API.
 */

export type PromotorNavItem = {
  label: string;
  href: string;
};

export const PROMOTOR_PRIMARY_NAV: PromotorNavItem[] = [
  { label: "Beranda", href: "/app" },
  { label: "Program", href: "/app/programs" },
  { label: "Peserta", href: "/app/learners" },
  { label: "Aktivitas", href: "/app/activity" },
];

export const PROMOTOR_SECONDARY_NAV: PromotorNavItem[] = [
  { label: "Template", href: "/app/templates" },
];

/** A nav item is active when the pathname equals its href or starts with it
    plus a segment boundary ("/app/learners" matches "/app/learners/ct_…").
    "/app" itself is excluded from the prefix match so it never claims nested
    routes like "/app/programs" — otherwise two items get aria-current. */
export function isPromotorNavActive(href: string, pathname: string): boolean {
  return pathname === href || (href !== "/app" && pathname.startsWith(`${href}/`));
}
