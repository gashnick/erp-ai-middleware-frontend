import { cn } from "@/utils/cn";

interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Responsive grid container for dashboard widgets.
 * Slots children into a 12-column responsive grid.
 * Individual widget wrappers control their own column span.
 */
export function DashboardGrid({ children, className }: DashboardGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface DashboardGridItemProps {
  children: React.ReactNode;
  span?: 1 | 2 | 3;
  className?: string;
}

/**
 * Individual grid slot. Use `span` to control how many columns it occupies.
 */
export function DashboardGridItem({
  children,
  span = 1,
  className,
}: DashboardGridItemProps) {
  const spanClass = {
    1: "",
    2: "md:col-span-2",
    3: "md:col-span-2 xl:col-span-3",
  }[span];

  return <div className={cn(spanClass, className)}>{children}</div>;
}
