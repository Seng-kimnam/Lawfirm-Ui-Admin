import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Calendar, User, Pencil } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { updateClientRequestById } from "@/Service/ClientRequestService";
import { ClientRequest } from "@/model/Client";
import { ClientDocumentInterface } from "@/model/Document";
import { request } from "@/constants/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ClientData {
  clientId: number;
  clientName: string;
  email: string;
  phoneNumber: string;
  complaint: string;
  feedBack: string;
  address: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  clientImage: string;
  createdAt: string;
  updatedAt: string;
}

const DetailClientRequestComponent = ({
  clientId,
  clientName,
  email,
  phoneNumber,
  complaint,
  feedBack,
  address,
  status,
  clientImage,
  createdAt,
  updatedAt,
}: ClientData) => {
  const readOnlyInputClassName =
    "h-11 w-full rounded-lg border border-gray-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-not-allowed";
  const editableInputClassName =
    "h-11 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-brand-300";
  const readOnlyTextareaClassName =
    "w-full rounded-lg border border-gray-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-not-allowed";

  const [clientDetail, setClientDetail] = useState<ClientData>({
    clientId,
    clientName,
    email,
    phoneNumber,
    complaint,
    address,
    status,
    feedBack,
    clientImage,
    createdAt,
    updatedAt,
  });
  const [clientIdList, setClientIdList] = useState<number[]>([]);
  const [clientDocuments, setClientDocuments] = useState<
    ClientDocumentInterface[]
  >([]);
  const [isDocumentLoading, setIsDocumentLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editForm, setEditForm] = useState<ClientRequest>({
    clientName,
    email,
    phoneNumber,
    complaint,
    address,
    status,
    feedBack,
    clientImage,
  });

  useEffect(() => {
    setClientDetail({
      clientId,
      clientName,
      email,
      phoneNumber,
      complaint,
      address,
      status,
      feedBack,
      clientImage,
      createdAt,
      updatedAt,
    });
    setEditForm({
      clientName,
      email,
      phoneNumber,
      complaint,
      address,
      status,
      feedBack,
      clientImage,
    });
    setClientIdList([clientId]);
  }, [
    clientId,
    clientName,
    email,
    phoneNumber,
    complaint,
    address,
    status,
    clientImage,
    createdAt,
    updatedAt,
  ]);

  useEffect(() => {
    if (clientIdList.length === 0) {
      setClientDocuments([]);
      return;
    }

    const fetchClientRequestDocuments = async () => {
      setIsDocumentLoading(true);

      try {
        const responses = await Promise.all(
          clientIdList.map(async (id) => {
            const res = await request(
              `files/client-request-documents/${id}`,
              "GET",
              undefined,
              undefined,
            );
            return res?.payload ?? res?.data ?? res;
          }),
        );
        console.log("dd", responses);

        const normalizedDocuments = responses.flatMap((item) => {
          if (Array.isArray(item)) {
            return item;
          }

          return item ? [item] : [];
        });

        setClientDocuments(normalizedDocuments);
      } catch (error) {
        console.error("Error fetching client request documents:", error);
        setClientDocuments([]);
      } finally {
        setIsDocumentLoading(false);
      }
    };

    fetchClientRequestDocuments();
  }, [clientIdList]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timeoutId = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timeoutId);
  }, [email]);
  if (!clientDetail.email || isLoading) {
    return (
      <div className="flex mt-20 items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Loading client request details...
          </p>
        </div>
      </div>
    );
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
      case "APPROVED":
        return "bg-green-500/20 text-green-300 border-green-500/50";
      case "REJECTED":
        return "bg-red-500/20 text-red-300 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/50";
    }
  };

  const openEditModal = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setEditForm({
      clientName: clientDetail.clientName,
      email: clientDetail.email,
      phoneNumber: clientDetail.phoneNumber,
      complaint: clientDetail.complaint,
      address: clientDetail.address,
      status: clientDetail.status,
      feedBack: clientDetail.feedBack || "",
      clientImage: clientDetail.clientImage,
    });
    setIsEditOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSaving(true);

    console.log("Saving changes with data: ", editForm);
    try {
      const updatedClient = await updateClientRequestById(
        clientDetail.clientId,
        editForm,
      );

      setClientDetail((prev) => ({
        ...prev,
        ...editForm,
        ...(updatedClient || {}),
        updatedAt: updatedClient?.updatedAt || new Date().toISOString(),
      }));

      setSuccessMessage("Client request updated successfully.");
      setIsEditOpen(false);
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to update client request.");
    } finally {
      setIsSaving(false);
    }
  };

  console.log("client detail ", clientDetail);

  return (
    <div className="flex items-center mt-20 justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 overflow-hidden">
              {clientDetail.clientImage &&
              clientDetail.clientImage !== "string" ? (
                <img
                  src={`http://localhost:8080/api/v1/files/preview-file?fileName=${clientDetail.clientImage}`}
                  alt={clientDetail.clientName}
                  title={clientDetail.clientImage}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">
                {clientDetail.clientName}
              </h2>
              <p className="text-blue-100 text-sm">
                Request ID: #{clientDetail.clientId}
              </p>
              <span
                className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
                  clientDetail.status,
                )}`}
              >
                {clientDetail.status}
              </span>
            </div>
            <button
              type="button"
              onClick={openEditModal}
              className="flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {successMessage && (
            <div className="rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-2 text-sm text-green-700 dark:text-green-300">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-700 dark:text-red-300">
              {errorMessage}
            </div>
          )}
          {/* Contact Information */}
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="text-slate-900 dark:text-slate-100 font-medium">
                  {clientDetail.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600">
              <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Phone
                </p>
                <p className="text-slate-900 dark:text-slate-100 font-medium">
                  {clientDetail.phoneNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Address
                </p>
                <p className="text-slate-900 dark:text-slate-100 font-medium">
                  {clientDetail.address}
                </p>
              </div>
            </div>
          </div>

          {/* Complaint Section */}
          <div className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Complaint
            </p>
            <p className="text-slate-900 dark:text-slate-100">
              {clientDetail.complaint}
            </p>
          </div>

          <div className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Client Request Documents
            </p>
            {isDocumentLoading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Loading documents...
              </p>
            ) : clientDocuments.length > 0 ? (
              <div className="space-y-3">
                {clientDocuments.map((documentGroup) => (
                  <div
                    key={documentGroup.clientId}
                    className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {documentGroup.clientName ||
                        `Client #${documentGroup.clientId}`}
                    </p>
                    <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                      {documentGroup.description || "No description available"}
                    </p>
                    {documentGroup.documents?.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {documentGroup.documents.map((document) => (
                          <a
                            key={`${documentGroup.clientId}-${document.name}`}
                            href={document.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700/40 dark:hover:bg-slate-700"
                          >
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {document.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {document.fileType} • {document.fileSize}
                            </p>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        No documents found for this request.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No documents found for this request.
              </p>
            )}
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-600">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400 mt-1" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                  Created
                </p>
                <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">
                  {formatDate(clientDetail.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400 mt-1" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                  Updated
                </p>
                <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">
                  {formatDate(clientDetail.updatedAt)}
                </p>
              </div>
            </div>
          </div>
          {/* <iframe> */}

          {/* </iframe> */}
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        className="max-w-2xl m-4 p-6"
      >
        <form onSubmit={handleSaveChanges} className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Edit Client Request
            </h3>
            <p className="text-sm text-muted-foreground">
              Only status and feedback can be updated for request #
              {clientDetail.clientId}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Client Name
              </label>
              <input
                name="clientName"
                value={editForm.clientName}
                readOnly
                required
                className={readOnlyInputClassName}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                readOnly
                required
                className={readOnlyInputClassName}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                value={editForm.phoneNumber}
                readOnly
                required
                className={readOnlyInputClassName}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Address
              </label>
              <input
                name="address"
                value={editForm.address}
                readOnly
                required
                className={readOnlyInputClassName}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Status</label>
              <select
                name="status"
                value={editForm.status}
                onChange={handleInputChange}
                className={editableInputClassName}
              >
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Feedback
              </label>
              <input
                name="feedBack"
                placeholder="Enter feedback for client"
                value={editForm.feedBack}
                onChange={handleInputChange}
                required
                className={editableInputClassName}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Complaint
            </label>
            <textarea
              name="complaint"
              value={editForm.complaint}
              readOnly
              required
              rows={4}
              className={readOnlyTextareaClassName}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DetailClientRequestComponent;
