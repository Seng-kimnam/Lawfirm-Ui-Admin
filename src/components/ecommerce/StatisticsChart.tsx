import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import { GetClient } from "@/Service/ClientService";
import { useCallback, useEffect, useMemo, useState } from "react";
import { request } from "@/constants/api";

export default function StatisticsChart() {
  type ChartPayload = {
    period: string;
    year?: number;
    categories: string[];
    data: number[];
  };

  const { clientList } = GetClient();
  const currentYear = new Date().getFullYear();

  const [period, setPeriod] = useState<
    "monthly" | "quarterly" | "annually" | "custom"
  >("monthly");
  const [year, setYear] = useState(currentYear);
  const [rangeStart, setRangeStart] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 2);
    return d.toISOString().slice(0, 10);
  });
  const [rangeEnd, setRangeEnd] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [chart, setChart] = useState<ChartPayload | null>(null);

  const years = useMemo(() => {
    const yearsFromData = clientList
      .map((c) => new Date(c.createdAt).getFullYear())
      .filter((y) => Number.isFinite(y));

    const hasData = yearsFromData.length > 0;
    const minYear = hasData ? Math.min(...yearsFromData) : 2000;
    const maxYear = hasData ? Math.max(...yearsFromData) : currentYear;

    const start = Math.min(minYear, currentYear);
    const end = Math.max(maxYear, currentYear);

    const allYears: number[] = [];
    for (let y = end; y >= start; y -= 1) allYears.push(y);
    return allYears;
  }, [clientList, currentYear]);

  useEffect(() => {
    if (period === "custom") return;
    if (years.length === 0) return;
    if (!years.includes(year)) setYear(years[0]);
  }, [period, year, years]);

  const computeClientStats = useCallback((): ChartPayload => {
    const parseDate = (value?: string) => {
      if (!value) return null;
      const date = new Date(value);
      return Number.isFinite(date.getTime()) ? date : null;
    };

    const parseDateInput = (value?: string) => {
      if (!value) return null;
      const parts = value.split("-").map(Number);
      if (parts.length !== 3) return null;
      const [y, m, d] = parts;
      if (!y || !m || !d) return null;
      const date = new Date(y, m - 1, d);
      return Number.isFinite(date.getTime()) ? date : null;
    };

    const toISO = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const items = clientList
      .map((c) => parseDate(c.createdAt))
      .filter((d): d is Date => Boolean(d));

    if (period === "monthly") {
      const counts = Array.from({ length: 12 }, () => 0);
      items.forEach((d) => {
        if (d.getFullYear() !== year) return;
        counts[d.getMonth()] += 1;
      });
      return {
        period,
        year,
        categories: monthNames,
        data: counts,
      };
    }

    if (period === "quarterly") {
      const categories = ["Q1", "Q2", "Q3", "Q4"];
      const counts = Array.from({ length: 4 }, () => 0);
      items.forEach((d) => {
        if (d.getFullYear() !== year) return;
        const q = Math.floor(d.getMonth() / 3);
        counts[q] += 1;
      });
      return {
        period,
        year,
        categories,
        data: counts,
      };
    }

    if (period === "annually") {
      const yearCounts = new Map<number, number>();
      items.forEach((d) => {
        const y = d.getFullYear();
        yearCounts.set(y, (yearCounts.get(y) ?? 0) + 1);
      });
      const cats = Array.from(yearCounts.keys()).sort((a, b) => a - b);
      return {
        period,
        categories: cats.map(String),
        data: cats.map((y) => yearCounts.get(y) ?? 0),
      };
    }

    // custom range
    const start = parseDateInput(rangeStart)?.setHours(0, 0, 0, 0);
    const end = parseDateInput(rangeEnd)?.setHours(23, 59, 59, 999);
    const startMs = typeof start === "number" ? start : NaN;
    const endMs = typeof end === "number" ? end : NaN;

    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) {
      return { period, categories: [], data: [] };
    }

    const spanDays = Math.ceil((endMs - startMs) / 86400000) + 1;
    const filtered = items.filter((d) => {
      const t = d.getTime();
      return t >= startMs && t <= endMs;
    });

    if (spanDays <= 31) {
      const days: string[] = [];
      const counts = new Map<string, number>();
      for (let t = startMs; t <= endMs; t += 86400000) {
        const key = toISO(new Date(t));
        days.push(key);
        counts.set(key, 0);
      }
      filtered.forEach((d) => {
        const key = toISO(d);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      });
      return { period, categories: days, data: days.map((k) => counts.get(k) ?? 0) };
    }

    if (spanDays <= 180) {
      const weekKey = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay(); // 0..6 (Sun..Sat)
        const diff = (day + 6) % 7; // make Monday start
        date.setDate(date.getDate() - diff);
        date.setHours(0, 0, 0, 0);
        return `Week of ${toISO(date)}`;
      };

      const order: string[] = [];
      const counts = new Map<string, number>();
      filtered.forEach((d) => {
        const k = weekKey(d);
        if (!counts.has(k)) order.push(k);
        counts.set(k, (counts.get(k) ?? 0) + 1);
      });
      return { period, categories: order, data: order.map((k) => counts.get(k) ?? 0) };
    }

    // monthly buckets within range
    const monthKey = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const labels = (key: string) => {
      const [y, m] = key.split("-").map(Number);
      return `${monthNames[(m ?? 1) - 1] ?? ""} ${y}`;
    };

    const order: string[] = [];
    const counts = new Map<string, number>();
    filtered.forEach((d) => {
      const k = monthKey(d);
      if (!counts.has(k)) order.push(k);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    });
    order.sort();
    return {
      period,
      categories: order.map(labels),
      data: order.map((k) => counts.get(k) ?? 0),
    };
  }, [clientList, period, rangeEnd, rangeStart, year]);

  useEffect(() => {
    const fetchStats = async () => {
      if (period === "custom") {
        setChart(computeClientStats());
        return;
      }

      // Prefer server aggregation when available; fall back to local computation.
      try {
        const res = await request(
          `admins/statistics/clients?period=${period}&year=${year}`,
          "GET",
          undefined,
          undefined,
          undefined,
        );

        const payload = res?.payload;
        const isValidPayload =
          payload &&
          Array.isArray(payload.categories) &&
          Array.isArray(payload.data);

        if (!isValidPayload) throw new Error("Invalid stats payload");

        setChart({
          period,
          ...(period !== "annually" && period !== "custom" ? { year } : {}),
          categories: payload.categories,
          data: payload.data,
        });
      } catch {
        setChart(computeClientStats());
      }
    };

    fetchStats();
  }, [computeClientStats, period, rangeEnd, rangeStart, year]);

  const categories = useMemo(() => chart?.categories ?? [], [chart?.categories]);
  const data = useMemo(() => chart?.data ?? [], [chart?.data]);

  const options = useMemo<ApexOptions>(
    () => ({
      colors: ["#465fff"],
      chart: {
        type: "area",
        toolbar: { show: false },
        fontFamily: "Outfit, sans-serif",
        animations: {
          enabled: true,
          speed: 250,
        },
        zoom: { enabled: false },
      },
      stroke: { curve: "smooth", width: 3 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      dataLabels: { enabled: false },
      markers: { size: 0, hover: { size: 5 } },
      grid: { borderColor: "rgba(148,163,184,0.25)" },
      xaxis: {
        categories,
        tickAmount: Math.min(12, categories.length || 12),
        labels: {
          rotate: categories.length > 12 ? -45 : 0,
          trim: true,
          hideOverlappingLabels: true,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (val: number) => `${Math.round(val)}`,
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (val: number) => `${val}`,
        },
      },
    }),
    [categories],
  );

  const series = useMemo(
    () => [
      {
        name: "Client Requests",
        data,
      },
    ],
    [data],
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Filter by year, period, or a custom date range
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab period={period} onChange={setPeriod} />
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-end sm:justify-between">
        {period !== "custom" && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-white/80">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 shadow-theme-xs outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}

        {period === "custom" && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-white/80">
                From
              </label>
              <input
                type="date"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 shadow-theme-xs outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-white/80">
                To
              </label>
              <input
                type="date"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 shadow-theme-xs outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
          </div>
        )}
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
