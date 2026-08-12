import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  /** Primary actions rendered on the right (max one dominant button per region). */
  actions?: ReactNode;
  className?: string;
};

/** Page-level heading block. Renders h1; keep one per page. */
export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={["pc-page-header", className].filter(Boolean).join(" ")}>
      <div>
        <h1 className="pc-page-title">{title}</h1>
        {description ? <p className="pc-page-desc">{description}</p> : null}
      </div>
      {actions ? <div className="pc-page-actions">{actions}</div> : null}
    </header>
  );
}
