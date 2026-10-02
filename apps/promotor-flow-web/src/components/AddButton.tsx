/**
 * AddButton - Floating action button for adding new items
 */

import Link from "next/link";

export interface AddButtonProps {
  size?: number;
  iconSize?: number;
  href?: string;
  onClick?: () => void;
}

export function AddButton({ size = 44, iconSize = 20, href, onClick }: AddButtonProps) {
  const content = (
    <svg
      width={`${iconSize}px`}
      height={`${iconSize}px`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
    >
      <path d="M10 4v12M4 10h12" />
    </svg>
  );

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#191918",
    padding: 0,
    textDecoration: "none",
  };

  if (href) {
    return (
      <Link href={href} style={style}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} style={style}>
      {content}
    </button>
  );
}
