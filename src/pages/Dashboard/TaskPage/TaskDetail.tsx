import { TaskInterface } from "@/model/Task";
import { ArrowLeft2 } from "iconsax-reactjs";
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router";
import DetailTaskComponent from "./components/DetailTaskComponent";
import { request } from "@/constants/api";

const TaskDetail = () => {
  const goto = useNavigate();

  const { id } = useParams<{ id: string }>();
  const [taskDetail, setTaskDetail] = useState<TaskInterface | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTaskDetail = async () => {
      try {
        const response = await request(`tasks/${id}`, "GET", undefined, {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        });

        if (response?.payload) {
          setTaskDetail(response.payload);
        }
      } catch (error) {
        console.error("Error fetching task detail:", error);
      }
    };

    fetchTaskDetail();
  }, [id]);
  return (
    <>
      <button
        className="border-2 border-white text-lg flex items-center gap-2 rounded-2xl
                 px-4 py-2 w-auto
                 text-white
                 hover:bg-white hover:text-black 
                 transition-colors duration-300 ease-in-out"
        onClick={() => goto("/listtask")}
      >
        <ArrowLeft2 size="24" color="currentColor" />
        Back to list task
      </button>
      <DetailTaskComponent
        taskId={taskDetail?.taskId ?? null}
        legalCase={taskDetail?.legalCase}
        lawyer={taskDetail?.lawyer}
        title={taskDetail?.title}
        description={taskDetail?.description}
        status={taskDetail?.status} 
        priority={taskDetail?.priority}
        dueDate={taskDetail?.dueDate}
        createdAt={taskDetail?.createdAt}
        updatedAt={taskDetail?.updatedAt}
      />
    </>
  );
};

export default TaskDetail;
