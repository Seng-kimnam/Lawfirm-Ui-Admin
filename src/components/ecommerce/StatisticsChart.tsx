import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import { GetClient } from "@/Service/ClientService";

import { getRoles } from "@/Service/RoleService";
import { GetLawyers } from "@/Service/UserService";
import { useEffect, useState } from "react";
import { request } from "@/constants/api";

export default function StatisticsChart() {
  const { clientList } = GetClient();
  const { list } = GetLawyers();

  type ChartPayload = {
    period: string;
    year?: number;
    categories: string[];
    data: number[];
  };

  const [period, setPeriod] = useState<"monthly" | "quarterly" | "annually">(
    "monthly",
  );
  const [year, setYear] = useState(new Date().getFullYear());
  const [chart, setChart] = useState<ChartPayload | null>(null);
  // function getStatisticByMonth(list: any[]) {
  //   const monthCounts: number[] = Array(12).fill(0); // this mean 12 element & start from 0 to 11
  //   list.forEach((l) => {
  //     if (!l.createdAt) return;
  //     const month = new Date(l.createdAt).getMonth(); // return as index
  //     console.log("month:", month);
  //     monthCounts[month]++;
  //   });
  //   return monthCounts;
  // }
  // const monthlyDataOfClient = getStatisticByMonth(clientList);
  // const lawyerMonthly = getStatisticByMonth(list);
  useEffect(() => {
    const fetchStats = async () => {
      const params = new URLSearchParams({
        period,
        ...(period !== "annually" && { year: year.toString() }),
      });

      const res = await request(
        `admins/statistics/clients?${params.toString()}`,
        "GET",
        undefined,
        undefined,
        undefined,
      );

      setChart(res?.payload);
    };

    fetchStats();
  }, [period, year]);

  const options = {
    xaxis: {
      categories: chart?.categories ?? [],
    },
  };

  const series = [
    {
      name: "Client Request",
      data: chart?.data ?? [],
    },
  ];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Target you’ve set for each month
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab period={period} onChange={setPeriod} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
