import { ClientInterface } from "@/model/Client";
import { CourtInterface } from "@/model/Court";
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Scale,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface CaseDetailProps {
  caseId: number | null;
  client?: ClientInterface;
  court?: CourtInterface;
  title?: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

const DetailComponent = ({
  caseId,
  client,
  court,
  title,
  description,
  status,
  startDate,
  endDate,
  createdAt,
  updatedAt,
}: CaseDetailProps) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, [client, court]);
  if (!client || !court || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Loading case details...
          </p>
        </div>
      </div>
    );
  }

  const {
    address,
    clientId,
    clientImage,
    clientName,
    complaint,
    createdAt: clientCreatedAt,
    email,
    phoneNumber,
    status: clientStatus,
    updatedAt: clientUpdatedAt,
  } = client;

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "open":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "closed":
      case "resolved":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "open":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "closed":
      case "resolved":
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Scale className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  Case Details
                </h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Case ID: #{caseId}
              </p>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(
                status
              )}`}
            >
              {getStatusIcon(status)}
              <span className="font-semibold text-sm uppercase tracking-wide">
                {status || "Unknown"}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {title || "Untitled Case"}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {description || "No description provided"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Information */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Client Information
              </h3>
            </div>

            <div className="flex items-start gap-6 mb-8">
              {clientImage ? (
                <img
                  src={clientImage}
                  alt={clientName}
                  className="w-24 h-24 rounded-xl object-cover border-2 border-blue-100 dark:border-blue-900 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center shadow-md">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}

              <div className="flex-1">
                <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {clientName}
                </h4>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    clientStatus
                  )}`}
                >
                  {getStatusIcon(clientStatus)}
                  {clientStatus || "Unknown"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <p className="text-slate-800 dark:text-slate-200 break-all">
                    {email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Phone
                  </p>
                  <p className="text-slate-800 dark:text-slate-200">
                    {phoneNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl md:col-span-2">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Address
                  </p>
                  <p className="text-slate-800 dark:text-slate-200">
                    {address || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl md:col-span-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Complaint
                  </p>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    {complaint || "No complaint filed"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Case Timeline & Court */}
          <div className="space-y-6">
            {/* Court Information */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Court
                </h3>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg">
                {court.courtName}
              </p>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Timeline
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2"></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Start Date
                    </p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      {formatDate(startDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2"></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      End Date
                    </p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      {formatDate(endDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Metadata
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">
                    Case Created
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {formatDate(createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">
                    Last Updated
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {formatDate(updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">
                    Client Registered
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {formatDate(clientCreatedAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">
                    Client ID
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono font-medium">
                    #{clientId}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailComponent;
