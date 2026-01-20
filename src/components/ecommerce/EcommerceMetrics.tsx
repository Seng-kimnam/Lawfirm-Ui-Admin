import { GetClient } from "@/Service/ClientService";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { LucideTrendingUp } from "lucide-react";
import { GetLawyers } from "@/Service/UserService";

export default function EcommerceMetrics() {
  const { clientList } = GetClient();
  const { list } = GetLawyers();

  console.log("Law ", list);
  // const {}
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <LucideTrendingUp className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-lg dark:font-bold text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-lg text-gray-800  dark:text-white/90">
              <span className="animate-caret-blink text-2xl font-bold duration-200 delay-300 px-2 inline-block ">
                {clientList?.length}
              </span>{" "}
              requests
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {/* 11.01% */}
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-lg text-gray-500 dark:text-gray-400">
              Our Lawyers
            </span>
            <h4 className="mt-2 animate-caret-blink  font-bold text-gray-800 text-title-sm dark:text-white/90">
              {list.length}
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            {/* 11.01% */}
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
