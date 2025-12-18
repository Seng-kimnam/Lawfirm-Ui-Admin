// interface ComponentCardProps {
//   title: string;
//   children: React.ReactNode;
//   className?: string; // Additional custom classes for styling
//   desc?: string; // Description text
//   headerActions?: React.ReactNode;
//   footer?: React.ReactNode;        // Footer content
// }

// const ComponentCard: React.FC<ComponentCardProps> = ({
//   title,
//   children,
//   className = "",
//   desc = "",
//   headerActions,
//   footer
// }) => {
//   return (
//     <div
//       className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
//     >
//       {/* Card Header */}
//       {/* <div className="px-6 py-5">
//         <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
//           {title}
//         </h3>
//         {desc && (
//           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//             {desc}
//           </p>
//         )}
//       </div> */}
//       {/* Card Header */}
//       <div className="px-6 py-5 flex items-center justify-between">
//         <div>
//           <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
//             {title}
//           </h3>
//           {desc && (
//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//               {desc}
//             </p>
//           )}
//         </div>

//         {/* Right Side Buttons */}
//         {headerActions && (
//           <div className="flex items-center gap-3">
//             {headerActions}
//           </div>
//         )}
//       </div>

//       {/* Card Body */}
//       <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
//         <div className="space-y-6">
//           {children}
//         </div>
//       </div>
//       {/* Footer */}
//       {footer && (
//         <div className="px-6 py-4 border-t border-gray-800   text-base font-medium text-gray-800 dark:text-white/90">
//           {footer}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ComponentCard;

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  searchInput?: React.ReactNode; // ⭐ NEW: Search form under header
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  headerActions,
  footer,
  searchInput, // NEW
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>

        {headerActions && (
          <div className="flex items-center gap-3">{headerActions}</div>
        )}
      </div>
      {searchInput && (
        <div className="px-3 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
          {searchInput}
        </div>
      )}
      {/* Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t dark:border-gray-800 border-gray-100 text-base font-medium text-gray-800 dark:text-white/90">
          {footer}
        </div>
      )}
    </div>
  );
};

export default ComponentCard;
