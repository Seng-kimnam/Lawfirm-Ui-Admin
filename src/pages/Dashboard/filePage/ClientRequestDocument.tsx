import ComponentCard from "../../../components/common/ComponentCard";
// import Badge from "../../../components/ui/badge/Badge";

import { useEffect, useState } from "react";
import Input from "../../../utils/input/InputField.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import Button from "../../../utils/button/Button";

import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog.tsx";
import { GetClientRequestDocument } from "@/Service/ClientService.tsx";
import { ClientDocumentInterface } from "@/model/Document.tsx";
import PageMeta from "@/components/common/PageMeta.tsx";

const DOCUMENT_CELL_HEIGHT = "h-44";

type PreviewDocument = ClientDocumentInterface["documents"][number];

const ClientRequestDocument = () => {
  const {
    clientDocumentList,
    page,
    setPage,
    totalPage,
    setKeyword,
    isLoading,
  } = GetClientRequestDocument();
  const [selectedRow, setSelectedRow] =
    useState<ClientDocumentInterface | null>(null);
  const [selectedDocument, setSelectedDocument] =
    useState<PreviewDocument | null>(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setKeyword(searchText);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [searchText, setKeyword]);

  const openPreview = (
    row: ClientDocumentInterface,
    document = row.documents?.[0] ?? null,
  ) => {
    if (!document) return;

    setSelectedRow(row);
    setSelectedDocument(document);
  };

  const closePreview = () => {
    setSelectedRow(null);
    setSelectedDocument(null);
  };

  function dateFormatter(iso: string) {
    if (!iso) return "N/A";

    const parsedDate = new Date(iso);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  console.log("DDD", clientDocumentList);

  return (
    <div>
      <PageMeta
        description="List of Client Documents"
        title="Client Documents"
      />
      <div className="space-y-6">
        <ComponentCard
          title="List Of Client Documents"
          desc="A list of all file documents available in the system."
          // headerActions={
          //   <>
          //     <Button
          //       size="md"
          //       variant="primary"
          //       startIcon={<AiOutlinePlus className="size-5" />}
          //       onClick={() => navigate("/add-file-doc")}
          //     >
          //       Create new document
          //     </Button>
          //   </>
          // }

          searchInput={
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Search client document by client or document name"
                icon={<BiSearch className="w-5 h-5" />}
                id="client-document-search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Search is powered by `/files/client-documents/search`.
              </p>
            </div>
          }
          footer={
            <div className="flex justify-between items-center">
              <span>
                Showing page {page} of {totalPage}
              </span>
              <div className="flex gap-2">
                <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                  <BsArrowLeft className=" font-bold" />
                </Button>
                <div className="flex items-center gap-1 flex-wrap">
                  {Array.from({ length: totalPage }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={i + 1 === page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  disabled={page === totalPage}
                  onClick={() => setPage(page + 1)}
                >
                  <BsArrowRight className=" font-bold" />
                </Button>
              </div>
            </div>
          }
        >
          <div className="overflow-hidden max-w-[1120px] rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b dark:text-center  border-gray-100  dark:border-white/50">
                  {clientDocumentList && (
                    <TableRow className="dark:text-center">
                      <TableCell
                        // isHeader
                        className="px-5 py-3 w-28 font-medium text-gray-500 text-center text-xl  dark:text-white"
                      >
                        Document ID
                      </TableCell>
                      {/* <TableCell
                        // isHeader
                        className="px-5 py-3 w-28 font-medium text-gray-500 text-center text-xl  dark:text-white"
                      >
                        Client ID
                      </TableCell> */}
                      <TableCell
                        // isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-center text-xl  dark:text-white"
                      >
                        Client Name
                      </TableCell>
                      <TableCell
                        // isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-center text-xl  dark:text-white"
                      >
                        Documents
                      </TableCell>
                      <TableCell
                        // isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-center text-xl  dark:text-white"
                      >
                        Description
                      </TableCell>
                      <TableCell
                        // isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-center text-xl  dark:text-white"
                      >
                        Created At
                      </TableCell>
                      <TableCell
                        // isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-center text-xl  dark:text-white"
                      >
                        Updated At
                      </TableCell>
                    </TableRow>
                  )}
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="px-5 py-10 text-center text-base text-gray-500 dark:text-gray-400"
                      >
                        Searching documents...
                      </TableCell>
                    </TableRow>
                  ) : clientDocumentList.length > 0 ? (
                    clientDocumentList?.map((item) => (
                      <TableRow key={item.id} className="align-top">
                        <TableCell className="px-5 py-4 sm:px-6 text-center align-top">
                          <div
                            className={`flex items-start gap-3 ${DOCUMENT_CELL_HEIGHT}`}
                          >
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                                {item.id ?? "N/A"}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-4 sm:px-6 text-center align-top">
                          <div
                            className={`flex items-start gap-3 ${DOCUMENT_CELL_HEIGHT}`}
                          >
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                                {item?.clientName ?? "N/A"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-center align-top">
                          {item.documents?.length ? (
                            <div
                              className={`flex min-w-[320px] flex-col gap-3 text-left ${DOCUMENT_CELL_HEIGHT}`}
                            >
                              <div className="grid flex-1 grid-cols-3 gap-2 overflow-y-auto pr-1">
                                {item.documents.map((document) => (
                                  <button
                                    key={`${item.id}-${document.name}`}
                                    type="button"
                                    onClick={() => openPreview(item, document)}
                                    className="group overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition hover:border-brand-500 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
                                  >
                                    <img
                                      className="h-20 w-full object-cover"
                                      src={document.fileUrl}
                                      alt={document.name}
                                      loading="lazy"
                                      decoding="async"
                                    />
                                    <div className="px-2 py-1 text-left">
                                      <p className="line-clamp-1 text-xs font-medium text-gray-700 group-hover:text-brand-600 dark:text-gray-200">
                                        {document.name}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>

                              <div className="flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <span>
                                  {item.documents.length} document
                                  {item.documents.length > 1 ? "s" : ""}
                                </span>
                                {item.documents.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => openPreview(item)}
                                    className="font-semibold text-brand-600 hover:underline"
                                  >
                                    Open gallery
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              No documents
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-center align-top">
                          <div
                            className={`flex items-start gap-3 ${DOCUMENT_CELL_HEIGHT}`}
                          >
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                                {item?.description ?? "N/A"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-center align-top">
                          <div
                            className={`flex items-start gap-3 ${DOCUMENT_CELL_HEIGHT}`}
                          >
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                                {dateFormatter(item?.createdAt) ?? "N/A"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-center align-top">
                          <div
                            className={`flex items-start gap-3 ${DOCUMENT_CELL_HEIGHT}`}
                          >
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                                {dateFormatter(item.updatedAt) ?? "N/A"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-center"></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="px-5 py-10 text-center text-base text-red-600"
                      >
                        Document not found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>

        <Dialog
          open={Boolean(selectedRow && selectedDocument)}
          onOpenChange={(open) => {
            if (!open) closePreview();
          }}
        >
          <DialogContent className="z-999999 w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw]">
            <DialogHeader>
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-2xl font-battambang tracking-wide underline">
                  {selectedDocument?.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedRow?.clientName ||
                    `Client #${selectedRow?.clientId}`}
                </p>
              </div>
            </DialogHeader>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/[0.03]">
                {selectedDocument && (
                  <img
                    className="h-[70vh] w-full object-contain"
                    src={selectedDocument.fileUrl}
                    alt={selectedDocument.name}
                  />
                )}
              </div>

              <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                {selectedRow?.documents?.map((document, index) => {
                  const isActive =
                    document.fileUrl === selectedDocument?.fileUrl;

                  return (
                    <button
                      key={`${selectedRow.clientId}-${document.name}-${index}`}
                      type="button"
                      onClick={() => setSelectedDocument(document)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition ${
                        isActive
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                          : "border-gray-200 hover:border-brand-400 dark:border-white/10"
                      }`}
                    >
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        src={document.fileUrl}
                        alt={document.name}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-medium text-gray-800 dark:text-white">
                          {document.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {document.fileType}{" "}
                          {document.fileSize ? `• ${document.fileSize}` : ""}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ClientRequestDocument;

//  <div className="flex items-center gap-3">
//                             {/* Update Button */}
//                             <button
//                               onClick={() => handleUpdateDoc(item.docId)}
//                               className="p-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
//                             >
//                               <Edit size="24" color="#ffffff" />
//                             </button>

//                             {/* Delete Button */}
//                             <button
//                               onClick={() => handleDeleteDocument(item?.docId)}
//                               className="p-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
//                             >
//                               <Trash size="24" color="#ffffff" />
//                             </button>
//                           </div>
