"use client";

import { Lawyer } from "@/model/Lawyer";
import { GetLawyers } from "@/Service/UserService";
import { AddSquare, Edit } from "iconsax-reactjs";
import {
  Mail,
  Phone,
  Award,
  MessageSquare,
  Send,
  Facebook,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function LawyerList() {
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showContactOptions, setShowContactOptions] = useState(false);
  const { list } = GetLawyers();
  const goto = useNavigate();
  const filteredLawyers = list.filter(
    (lawyer) =>
      lawyer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.expertises.some((exp) =>
        exp.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Legal Professionals
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Connect with experienced lawyers for your legal needs
              </p>
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {filteredLawyers.length} Professional
              {filteredLawyers.length !== 1 ? "s" : ""}
            </div>
            <button
              onClick={() => goto(`/add-new-lawyer/`)}
              className="p-2   rounded-3xl   text-white transition-colors duration-200 hover:bg-green-600"
            >
              <AddSquare size="30" color="#ffffff" />
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search lawyers by name or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Lawyers Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredLawyers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No lawyers found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <div
                key={lawyer.appUserId}
                onClick={() => setSelectedLawyer(lawyer)}
                className="group cursor-pointer h-full"
              >
                <div className="h-full flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-blue-500 dark:hover:border-blue-400">
                  {/* Profile Header */}
                  <div
                    className="relative h-32 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://png.pngtree.com/thumb_back/fh260/background/20230704/pngtree-stack-of-law-books-with-courtroom-scales-image_3721829.jpg')",
                    }}
                  >
                    {/* Optional dark overlay for readability */}
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* Your existing radial highlight (optional) */}
                    <div
                      className="absolute inset-0 opacity-30 mix-blend-overlay"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.25), transparent 50%)",
                      }}
                    ></div>

                    <button
                      onClick={() => goto(`/edit-lawyer/${lawyer.appUserId}`)}
                      className="p-2 absolute  right-2 top-2 text-sm rounded-md  text-white hover:bg-blue-800"
                    >
                      <Edit size="24" color="#ffffff" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 px-6 py-4">
                    {/* Avatar */}
                    <div className="flex justify-center -mt-16 mb-4">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full overflow-hidden flex items-center justify-center ring-4 ring-white dark:ring-slate-800">
                          <img
                            src={`http://localhost:8080/api/v1/files/preview-file?fileName${lawyer.image}`}
                            alt={lawyer.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* {lawyer.lawyerStatus === "ACTIVE" && ( */}
                        <div
                          className={`absolute bottom-0 right-0 w-6 h-6  ${lawyer.lawyerStatus === "ACTIVE" ? "bg-green-500" : "bg-red-500"} rounded-full ring-2 ring-white dark:ring-slate-800 flex items-center justify-center`}
                        >
                          <span
                            className={`w-3 h-3 ${lawyer.lawyerStatus === "ACTIVE" ? "bg-green-400" : "bg-red-400"} rounded-full animate-pulse`}
                          ></span>
                        </div>
                      </div>
                    </div>

                    {/* Name & Title */}
                    <h3 className="text-center text-xl font-bold text-slate-900 dark:text-white">
                      {lawyer.fullName}
                    </h3>
                    <p className="text-center text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                      {lawyer.title.split(",")[0]}
                    </p>

                    {/* Contact Info */}
                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <a
                        href={`mailto:${lawyer.email}`}
                        className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{lawyer.email}</span>
                      </a>
                      <a
                        href={`tel:${lawyer.phoneNumber}`}
                        className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{lawyer.phoneNumber}</span>
                      </a>
                    </div>

                    {/* Expertise Tags */}
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                        Expertise
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {lawyer.expertises.map((expertise, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
                          >
                            {expertise}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLawyer(lawyer);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Profile Modal */}
      {selectedLawyer && (
        <div className="fixed inset-0 z-99999 overflow-y-auto animate-fadeIn">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => setSelectedLawyer(null)}
          ></div>

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl animate-slideUp">
              {/* Close Button */}
              <button
                onClick={() => setSelectedLawyer(null)}
                className="absolute top-4 right-4 z-10 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="px-6 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full overflow-hidden flex items-center justify-center ring-4 ring-white dark:ring-slate-800">
                    <img
                      src={`http://localhost:8080/api/v1/files/preview-file?fileName=${selectedLawyer.image}`}
                      alt={selectedLawyer.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <span
                      className={`inline-block w-3 h-3 ${selectedLawyer.lawyerStatus === "ACTIVE" ? "bg-green-400" : "bg-red-400"} rounded-full`}
                    >
                      {" "}
                    </span>
                    <span
                      className={`text-sm font-medium pl-2 ${selectedLawyer.lawyerStatus === "ACTIVE" ? "text-green-400 dark:text-green-400" : "text-red-400 dark:text-red-400"} `}
                    >
                      {selectedLawyer.lawyerStatus ? "ACTIVE" : "INACTIVE"}
                    </span>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                          {selectedLawyer.fullName}
                        </h2>
                        <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mt-1">
                          {selectedLawyer.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2"></div>
                    </div>

                    {/* Contact Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <a
                        href={`mailto:${selectedLawyer.email}`}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{selectedLawyer.email}</span>
                      </a>
                      <a
                        href={`tel:${selectedLawyer.phoneNumber}`}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600"
                      >
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">
                          {selectedLawyer.phoneNumber}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    About
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                    {selectedLawyer.description}
                  </p>
                </div>

                {/* Expertise Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Areas of Expertise
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedLawyer.expertises.map((expertise, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full flex-shrink-0"></div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {expertise}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setShowContactOptions(!showContactOptions)}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Contact Now
                  </button>
                  <button
                    onClick={() => setSelectedLawyer(null)}
                    className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                </div>

                {/* Contact Options */}
                {showContactOptions && (
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 animate-slideUp">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                      Choose your preferred contact method
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Email */}
                      <a
                        href={`mailto:${selectedLawyer.email}`}
                        className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/40 border border-red-200 dark:border-red-800 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Gmail
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 text-center">
                          Send an email
                        </span>
                      </a>

                      {/* Telegram */}
                      <a
                        href={`https://t.me/${selectedLawyer.phoneNumber.replace(/\s/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/40 border border-blue-200 dark:border-blue-800 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <Send className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Telegram
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 text-center">
                          Message on Telegram
                        </span>
                      </a>

                      {/* Facebook */}
                      <a
                        href={`https://www.facebook.com/search/top/?q=${selectedLawyer.fullName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-900/60 border border-blue-300 dark:border-blue-700 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <Facebook className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Facebook
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 text-center">
                          Find on Facebook
                        </span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
