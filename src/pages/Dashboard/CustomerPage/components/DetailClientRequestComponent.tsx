import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Calendar, User } from "lucide-react";

interface ClientData {
  clientId: number;
  clientName: string;
  email: string;
  phoneNumber: string;
  complaint: string;
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
  address,
  status,
  clientImage,
  createdAt,
  updatedAt,
}: ClientData) => {
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
    setTimeout(() => setIsLoading(false), 2000);
    // return clearTimeout(2000);
  }, [email]);
  if (!email || isLoading) {
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

  return (
    <div className="flex items-center mt-20 justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 overflow-hidden">
              {clientImage && clientImage !== "string" ? (
                <img
                  src={`http://localhost:8080/api/v1/files/preview-file?fileName=${clientImage}`}
                  alt={clientName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">
                {clientName}
              </h2>
              <p className="text-blue-100  text-sm">Request ID: #{clientId}</p>
              <span
                className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
                  status
                )}`}
              >
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Contact Information */}
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors border border-slate-600">
              <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="text-slate-100 font-medium">{email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors border border-slate-600">
              <Phone className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                  Phone
                </p>
                <p className="text-slate-100 font-medium">{phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors border border-slate-600">
              <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                  Address
                </p>
                <p className="text-slate-100 font-medium">{address}</p>
              </div>
            </div>
          </div>

          {/* Complaint Section */}
          <div className="p-4 rounded-lg border-2 border-slate-600 bg-slate-700/30">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">
              Complaint
            </p>
            <p className="text-slate-100">{complaint}</p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-600">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Created</p>
                <p className="text-sm text-slate-100 font-medium">
                  {formatDate(createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Updated</p>
                <p className="text-sm text-slate-100 font-medium">
                  {formatDate(updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailClientRequestComponent;
