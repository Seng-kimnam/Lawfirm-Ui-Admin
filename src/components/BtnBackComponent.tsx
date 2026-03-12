import { useNavigate } from "react-router";
import { ArrowLeft2 } from "iconsax-reactjs";

type Props = {
  url?: string;
};

const BtnBackComponent = ({ url }: Props) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(url || "/")}
      className="inline-flex  items-center my-4 gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors duration-200  hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white dark:hover:text-gray-700"
    >
      <ArrowLeft2 size="18" color="currentColor" />
      <span>Back</span>
    </button>
  );
};

export default BtnBackComponent;
