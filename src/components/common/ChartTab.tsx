type Period = "monthly" | "quarterly" | "annually" | "custom";
type Props = {
  period: Period;
  onChange: (p: Period) => void;
};
const ChartTab: React.FC<Props> = ({ period, onChange }) => {
  const getButtonClass = (value: Period) =>
    period === value
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => {
          onChange("monthly");
        }}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "monthly",
        )}`}
      >
        Monthly
      </button>

      <button
        onClick={() => {
          onChange("quarterly");
        }}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "quarterly",
        )}`}
      >
        Quarterly
      </button>

      <button
        onClick={() => {
          onChange("annually");
        }}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "annually",
        )}`}
      >
        Annually
      </button>

      <button
        onClick={() => {
          onChange("custom");
        }}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "custom",
        )}`}
      >
        Custom
      </button>
    </div>
  );
};

export default ChartTab;
