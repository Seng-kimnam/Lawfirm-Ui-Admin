import { request } from "@/constants/api";
import { CaseInterface } from "@/model/Case";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import DetailComponent from "./components/DetailComponent";
import { ArrowCircleLeft, ArrowLeft2 } from "iconsax-reactjs";

const CaseDetail = () => {
  const goto = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [caseDetail, setCaseDetail] = useState<CaseInterface | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCaseDetail = async () => {
      try {
        const response = await request(`cases/${id}`, "GET", undefined, {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        });

        if (response?.payload) {
          setCaseDetail(response.payload);
        }
      } catch (error) {
        console.error("Error fetching case detail:", error);
      }
    };

    fetchCaseDetail();
  }, [id]);

  return (
    <>
      <button
        className="border-2 border-white text-lg flex items-center gap-2 rounded-full
             px-4 py-2 w-auto
             text-white
             hover:bg-white hover:text-black 
             transition-colors duration-300 ease-in-out"
        onClick={() => goto("/list-case")}
      >
        <ArrowLeft2 size="24" color="currentColor" />
       
      </button>

      <DetailComponent
        caseId={caseDetail?.caseId ?? null}
        client={caseDetail?.client}
        court={caseDetail?.court}
        title={caseDetail?.title}
        description={caseDetail?.description}
        status={caseDetail?.status}
        startDate={caseDetail?.startDate}
        endDate={caseDetail?.endDate}
        createdAt={caseDetail?.createdAt}
        updatedAt={caseDetail?.updatedAt}
      />
    </>
  );
};

export default CaseDetail;
