import { request } from "@/constants/api";
import { getClientDetailByEmail } from "@/constants/constants_url";
import { ClientInterface } from "@/model/Client";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import DetailClientRequestComponent from "./components/DetailClientRequestComponent";
import { ArrowLeft2 } from "iconsax-reactjs";

const ClientRequestDetail = () => {
  const [searchParams] = useSearchParams();
  const goto = useNavigate();
  const [clientListDetail, setClientListDetail] = useState<
    ClientInterface[] | null
  >(null);
  const email = searchParams.get("email");

  useEffect(() => {
    async function fetchClientDetailByEmail() {
      try {
        const res = await request(
          getClientDetailByEmail(email),
          "GET",
          undefined,
          undefined,
          undefined
        );

        setClientListDetail(res?.payload.content);
      } catch (error) {
        console.error("Error fetching client detail by email:", error);
      }
    }
    fetchClientDetailByEmail();
  }, [email]);

  return (
    <div className="relative">
      <button
        className="border  fixed top-24   border-white text-lg flex items-center gap-2 rounded-full
             px-4 py-2 w-auto
             text-white
             hover:bg-white hover:text-black 
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
            phoneNumber={client.phoneNumber}
            complaint={client.complaint}
            address={client.address}
            status={client.status as "PENDING" | "APPROVED" | "REJECTED"}
            clientImage={client.clientImage}
            createdAt={client.createdAt}
            updatedAt={client.updatedAt}
          />
        ))}
    </div>
  );
};

export default ClientRequestDetail;
