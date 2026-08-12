/**
 * Skeleton loading components (design.md §35 loading states).
 * 
 * Reusable shimmer effects for lists, cards, and text elements.
 * All animations use CSS keyframes from tokens.css.
 */

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="pc-list-skeleton-item">
          <div className="pc-skeleton-text pc-skeleton-text--wide" />
          <div className="pc-skeleton-text pc-skeleton-text--narrow" />
        </div>
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="pc-card-skeleton">
      <div className="pc-skeleton-text pc-skeleton-text--lg" />
      <div className="pc-skeleton-text pc-skeleton-text--md" />
      <div className="pc-skeleton-text pc-skeleton-text--sm" />
    </div>
  );
}

export function TextSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div className={`pc-skeleton-text pc-skeleton-text--${size}`} />
  );
}
