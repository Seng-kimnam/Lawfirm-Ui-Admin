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
import { myAllRoles } from "@/api/role";

export default function EcommerceMetrics() {
  const { clientList } = GetClient();
  const { list } = GetLawyers();
  const currentRole = localStorage.getItem("role");

  return (
    <>
      {currentRole === myAllRoles[0].toLocaleUpperCase() && (
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
                <h4 className="mt-2  font-bold text-3xl text-gray-800  dark:text-white/90">
                  {clientList?.length}

                  {clientList?.length > 1 ? " Requests" : " Request"}
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
                <h4 className="mt-2 text-3xl   font-bold text-gray-800 dark:text-white/90">
                  {list.length} {list.length > 1 ? "Lawyers" : "Lawyer"}
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
      )}

      {/* dashboard for lawyer role  */}

      {currentRole === myAllRoles[1].toLocaleUpperCase() && <>
      Hello Lawyer
      </>}
    </>
  );
}
