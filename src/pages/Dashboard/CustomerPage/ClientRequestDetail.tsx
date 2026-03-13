import { request } from "@/constants/api";
import { getClientDetailByEmail } from "@/constants/constants_url";
import { ClientInterface } from "@/model/Client";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import DetailClientRequestComponent from "./components/DetailClientRequestComponent";
import { ArrowLeft2 } from "iconsax-reactjs";
import Button from "@/components/ui/button/Button";

const ClientRequestDetail = () => {
  const [searchParams] = useSearchParams();
  const goto = useNavigate();
  const [clientListDetail, setClientListDetail] = useState<
    ClientInterface[] | null
  >(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;
  const email = searchParams.get("email");

  useEffect(() => {
    async function fetchClientDetailByEmail() {
      try {
        const res = await request(
          getClientDetailByEmail(email, page, pageSize),
          "GET",
          undefined,
          undefined,
          undefined,
        );

        console.log("client detail response ", res);
        setClientListDetail(res?.payload?.content ?? []);
        setTotalPages(res?.payload?.totalPages ?? 1);
      } catch (error) {
        console.error("Error fetching client detail by email:", error);
      }
    }
    fetchClientDetailByEmail();
  }, [email, page]);

  return (
    <div className="relative">
      <button
        className="border  fixed top-24  border-gray-800 dark:border-white text-lg flex items-center gap-2 rounded-full
             px-4 py-2 w-auto
             dark:text-white
             dark:hover:bg-white dark:hover:text-black 
              
             transition-colors duration-300 ease-in-out"
        onClick={() => goto("/list-client")}
      >
        <ArrowLeft2 size="24" color="currentColor" />
      </button>
      {clientListDetail &&
        clientListDetail.map((client) => (
          <DetailClientRequestComponent
            key={client.clientId}
            clientId={client.clientId}
            clientName={client.clientName}
            email={client.email}
            feedBack={client.feedBack}
            phoneNumber={client.phoneNumber}
            complaint={client.complaint}
            address={client.address}
            status={client.status as "PENDING" | "APPROVED" | "REJECTED"}
            clientImage={client.clientImage}
            createdAt={client.createdAt}
            updatedAt={client.updatedAt}
          />
        ))}
      <div className="flex justify-center items-center gap-3 mt-6">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-slate-700 dark:text-slate-300">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() =>
            setPage((prev) => Math.min(totalPages, prev + 1))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ClientRequestDetail;
