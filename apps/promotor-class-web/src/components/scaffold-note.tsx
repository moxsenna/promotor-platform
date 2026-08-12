import type { CSSProperties } from "react";

type ScaffoldNoteProps = {
  route: string;
  title: string;
  note: string;
};

const mainStyle: CSSProperties = {
  maxWidth: "42rem",
  margin: "0 auto",
  padding: "4rem 1.5rem 2rem",
};

const routeStyle: CSSProperties = {
  margin: 0,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "0.875rem",
};

const titleStyle: CSSProperties = {
  margin: "0.5rem 0 0",
  fontSize: "1.5rem",
  lineHeight: 1.3,
};

const noteStyle: CSSProperties = {
  margin: "0.75rem 0 0",
  maxWidth: "38rem",
};

/**
 * Temporary scaffold placeholder, shared by the M0.4 route shells.
 * Replaced by real screens in M0.6+; server component, no client state.
 */
export function ScaffoldNote({ route, title, note }: ScaffoldNoteProps) {
  return (
    <main style={mainStyle}>
      <p style={routeStyle}>{route}</p>
      <h1 style={titleStyle}>{title}</h1>
      <p style={noteStyle}>{note}</p>
    </main>
  );
}
