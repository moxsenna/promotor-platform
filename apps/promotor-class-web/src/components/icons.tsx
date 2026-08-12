import type { SVGProps } from "react";

/** Line-based 16px icons, design.md §12 (Lucide-style, 14–16px).
    Decorative by construction: all icons render aria-hidden. */

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...rest }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 10.2 12 3.5l9 6.7V20a1 1 0 0 1-1 1h-4.5v-6h-7v6H4a1 1 0 0 1-1-1z" />
    </IconBase>
  );
}

export function DocumentIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H19v13H5.5A1.5 1.5 0 0 0 4 18.5z" />
      <path d="M4 18.5A1.5 1.5 0 0 0 5.5 20H19" />
      <path d="M8.5 8.5h6" />
    </IconBase>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="9.5" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c0-3 2.7-4.8 6-4.8s6 1.8 6 4.8" />
      <path d="M16.5 6.6a3.2 3.2 0 0 1 0 6.1" />
      <path d="M18 15.2c1.7.6 2.9 1.9 2.9 4.3" />
    </IconBase>
  );
}

export function ActivityIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 12h4l2.5-6.5 5 13L17 12h4" />
    </IconBase>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </IconBase>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 7.5C10.6 6.2 8.7 5.5 6 5.5H3.5v12H6c2.7 0 4.6.7 6 2" />
      <path d="M12 7.5c1.4-1.3 3.3-2 6-2h2.5v12H18c-2.7 0-4.6.7-6 2" />
      <path d="M12 7.5v14" />
    </IconBase>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 6.5h16" />
      <path d="M4 12h16" />
      <path d="M4 17.5h10" />
    </IconBase>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8.5" r="3.4" />
      <path d="M5 19.5c0-3.2 3.1-5.2 7-5.2s7 2 7 5.2" />
    </IconBase>
  );
}
