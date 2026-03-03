import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { filterTaskByStatus } from "@/Service/TaskService";
import { request } from "@/constants/api";
import { getTaskList } from "@/constants/constants_url";
import { TaskInterface, TaskStatusFilter } from "@/model/Task";
import { useEffect, useState } from "react";

export default function RecentOrders() {
  const page = 1;
  const [status, setStatus] = useState<TaskStatusFilter>("ALL");
  const [rows, setRows] = useState<TaskInterface[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res =
          status === "ALL"
            ? await request(getTaskList(page), "GET")
            : await filterTaskByStatus(status);

        setRows(res?.payload?.content || res?.payload || []);
      } catch (error) {
        console.error("Failed to load tasks:", error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [status, page]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Tasks
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatusFilter)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="ALL">All</option>
            <option value="UNDER_PROGRESS">Under Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell className="py-3 text-start text-xl dark:text-gray-400">
                Client Name
              </TableCell>
              <TableCell className="py-3 text-start text-xl dark:text-gray-400">
                Title request
              </TableCell>
              <TableCell className="py-3 text-start text-xl dark:text-gray-400">
                Date Request
              </TableCell>
              <TableCell className="py-3 text-start text-xl dark:text-gray-400">
                Confirm By
              </TableCell>
              <TableCell className="py-3 text-start text-xl dark:text-gray-400">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <TableRow>
                <TableCell className="py-4">Loading...</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell className="py-4">No tasks found.</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            ) : (
              rows.map((task) => (
                <TableRow key={task.taskId}>
                  <TableCell className="py-3">
                    <div>
                      <p className="text-[18px] text-gray-800 dark:text-white/90">
                        {task.legalCase.client.clientName}
                      </p>
                      <span className="text-[14px] text-gray-600 dark:text-gray-400">
                        {task.legalCase.client.email}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 text-theme-sm dark:text-gray-400">
                    {task.title}
                  </TableCell>

                  <TableCell className="py-3 text-theme-sm dark:text-gray-400">
                    {new Date(
                      task.legalCase.client.createdAt,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>

                  <TableCell className="py-3 text-theme-sm dark:text-gray-400">
                    Attorney{" "}
                    <span className="font-extrabold">
                      {task.lawyer.fullName}
                    </span>
                  </TableCell>

                  <TableCell className="py-3 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        task.status === "DONE"
                          ? "success"
                          : task.status === "UNDER_PROGRESS"
                            ? "warning"
                            : "error"
                      }
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
