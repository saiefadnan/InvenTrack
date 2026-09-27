import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

const PageHeader = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  children,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
      {children}
    </div>
  );
};

export default PageHeader;
