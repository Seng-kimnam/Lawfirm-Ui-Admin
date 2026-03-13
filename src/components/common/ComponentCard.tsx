interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  searchInput?: React.ReactNode;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  headerActions,
  footer,
  searchInput,
}) => {
  return (
    <div
      className={`w-full rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Header */}
      <div className="w-full px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-3xl font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>

        {headerActions && (
          <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
            {headerActions}
          </div>
        )}
      </div>

      {/* Search Section */}
      {searchInput && (
        <div className="w-full px-6 py-3 border-t border-gray-100 dark:border-gray-800">
          <div className="w-full">{searchInput}</div>
        </div>
      )}

      {/* Body */}
      <div className="w-full p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6 w-full">{children}</div>
      </div>

      {/* Footer */}
      {footer && (
        <div className="w-full px-6 py-4 border-t border-gray-100 dark:border-gray-800 text-base font-medium text-gray-800 dark:text-white/90">
          {footer}
        </div>
      )}
    </div>
  );
};

export default ComponentCard;
