import { request } from "@/constants/api";
import { CaseInterface } from "@/model/Case";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import DetailComponent from "./components/DetailComponent";
import { ArrowLeft2 } from "iconsax-reactjs";
import { BsPrinter } from "react-icons/bs";
import toast from "react-hot-toast";

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrintPdf = () => {
    if (!caseDetail) {
      toast.error("Case details not loaded yet.");
      return;
    }

    const clientImageUrl = caseDetail.client?.clientImage
      ? `http://localhost:8080/api/v1/files/preview-file?fileName=${encodeURIComponent(
          caseDetail.client.clientImage,
        )}`
      : "";

    const printWindow = window.open("", "", "height=900,width=1200");
    if (!printWindow) {
      toast.error("Pop-up blocked. Please allow pop-ups to print.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Case Detail Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { size: A4; margin: 16mm; }
            body { font-family: Arial, sans-serif; color: #111; }
            .page { width: 100%; }
            h1 { font-size: 22px; margin-bottom: 6px; }
            h2 { font-size: 16px; margin: 18px 0 8px; }
            .meta { font-size: 12px; color: #555; margin-bottom: 12px; }
            .section { border: 1px solid #ddd; border-radius: 8px; padding: 12px; margin-bottom: 10px; }
            .row { display: flex; gap: 16px; margin-bottom: 8px; }
            .col { flex: 1; }
            .label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 4px; }
            .value { font-size: 13px; color: #111; }
            .badge { display: inline-block; padding: 4px 8px; border: 1px solid #ddd; border-radius: 999px; font-size: 11px; }
            .footer { font-size: 11px; color: #666; margin-top: 8px; }
            .avoid-break { break-inside: avoid; page-break-inside: avoid; }
            .client-row { display: flex; gap: 16px; align-items: center; margin-bottom: 8px; }
            .client-image { width: 72px; height: 72px; border-radius: 10px; object-fit: cover; border: 1px solid #e5e7eb; }
            .client-image-placeholder { width: 72px; height: 72px; border-radius: 10px; border: 1px dashed #cbd5f5; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="section avoid-break">
              <h1>Case Detail Report</h1>
              <div class="meta">
                Case ID: #${caseDetail.caseId ?? "N/A"} | Generated on ${new Date().toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" },
                )} at ${new Date().toLocaleTimeString("en-US")}
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">Title</div>
                  <div class="value">${caseDetail.title ?? "N/A"}</div>
                </div>
                <div class="col">
                  <div class="label">Status</div>
                  <div class="value"><span class="badge">${caseDetail.status ?? "N/A"}</span></div>
                </div>
              </div>
              <div class="label">Description</div>
              <div class="value">${caseDetail.description ?? "N/A"}</div>
            </div>

            <div class="section avoid-break">
              <h2>Client Information</h2>
              <div class="client-row">
                ${
                  clientImageUrl
                    ? `<img class="client-image" src="${clientImageUrl}" alt="Client" />`
                    : `<div class="client-image-placeholder">No Photo</div>`
                }
                <div>
                  <div class="label">Client Name</div>
                  <div class="value">${caseDetail.client?.clientName ?? "N/A"}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">Client Name</div>
                  <div class="value">${caseDetail.client?.clientName ?? "N/A"}</div>
                </div>
                <div class="col">
                  <div class="label">Client ID</div>
                  <div class="value">#${caseDetail.client?.clientId ?? "N/A"}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">Email</div>
                  <div class="value">${caseDetail.client?.email ?? "N/A"}</div>
                </div>
                <div class="col">
                  <div class="label">Phone</div>
                  <div class="value">${caseDetail.client?.phoneNumber ?? "N/A"}</div>
                </div>
              </div>
              <div class="label">Address</div>
              <div class="value">${caseDetail.client?.address ?? "N/A"}</div>
            </div>

            <div class="section avoid-break">
              <h2>Court & Timeline</h2>
              <div class="row">
                <div class="col">
                  <div class="label">Court Name</div>
                  <div class="value">${caseDetail.court?.courtName ?? "N/A"}</div>
                </div>
                <div class="col">
                  <div class="label">Start Date</div>
                  <div class="value">${formatDate(caseDetail.startDate)}</div>
                </div>
                <div class="col">
                  <div class="label">End Date</div>
                  <div class="value">${formatDate(caseDetail.endDate)}</div>
                </div>
              </div>
            </div>

            <div class="section avoid-break">
              <h2>Metadata</h2>
              <div class="row">
                <div class="col">
                  <div class="label">Created At</div>
                  <div class="value">${formatDate(caseDetail.createdAt)}</div>
                </div>
                <div class="col">
                  <div class="label">Updated At</div>
                  <div class="value">${formatDate(caseDetail.updatedAt)}</div>
                </div>
                <div class="col">
                  <div class="label">Client Registered</div>
                  <div class="value">${formatDate(caseDetail.client?.createdAt)}</div>
                </div>
              </div>
            </div>

            <div class="footer">
              This report is generated automatically. For assistance, please contact support.
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          className="border border-slate-300 dark:border-slate-700 text-lg flex items-center gap-2 rounded-full
               px-4 py-2 w-auto bg-white/80 dark:bg-slate-800
               text-slate-900 dark:text-slate-100
               hover:bg-slate-100 dark:hover:bg-slate-700 
               transition-colors duration-300 ease-in-out"
          onClick={() => goto("/list-case")}
        >
          <ArrowLeft2 size="24" color="currentColor" />
        </button>
        <button
          className="border border-slate-300 dark:border-slate-700 text-lg flex items-center gap-2 rounded-full
               px-4 py-2 w-auto bg-white/80 dark:bg-slate-800
               text-slate-900 dark:text-slate-100
               hover:bg-slate-100 dark:hover:bg-slate-700 
               transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePrintPdf}
          disabled={!caseDetail}
        >
          <BsPrinter className="w-4 h-4" />
          Print PDF
        </button>
      </div>

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
