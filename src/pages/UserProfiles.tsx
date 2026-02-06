"use client";

import { useState, useEffect } from "react";
import PageMeta from "../components/common/PageMeta";
import { CurrentUserProfile } from "@/model/User";
import { fetchCurrentUser } from "@/Service/UserService";
import { Facebook, Musicnote, Send2 } from "iconsax-reactjs";
import { Link } from "react-router";

import {
  EditProfileModal,

} from "@/components/EditProfileComponent";

const UserProfiles = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUserProfile | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  
  useEffect(() => {
    // Fetch current user data from your auth/API endpoint
    const fetchUserData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetchCurrentUser();
        
        setCurrentUser(response.payload);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // const console = 
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  if (!currentUser) {
    return <div className="text-center py-12">No user data available</div>;
  }

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex items-center justify-between ">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Profile
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3  font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>

        {/* social media  */}
        <div className="space-y-6">
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                  <img
                    src={
                      currentUser.image
                        ? `http://localhost:8080/api/v1/files/preview-file?fileName=${currentUser.image}`
                        : "/images/user/default-avatar.jpg"
                    }
                    alt={currentUser.fullName}
                  />
                </div>
                <div className="order-3 xl:order-2">
                  <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                    {currentUser.fullName}
                  </h4>
                  <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                    <p className=" text-gray-500 dark:text-gray-400">
                      {currentUser.title}
                    </p>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                  </div>
                </div>
                <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
                  {currentUser.facebookLink &&
                    currentUser.facebookLink !== "string" && (
                      <a
                        href={currentUser.facebookLink}
                        target="_blank"
                        rel="noopener"
                        className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white  font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                      >
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z"
                            fill=""
                          />
                        </svg>
                      </a>
                    )}

                  {currentUser.tiktokLink &&
                    currentUser.tiktokLink !== "string" && (
                      <a
                        href={currentUser.tiktokLink}
                        target="_blank"
                        rel="noopener"
                        className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white  font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                      >
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z"
                            fill=""
                          />
                        </svg>
                      </a>
                    )}

                  {currentUser.telegramLink &&
                    currentUser.telegramLink !== "string" && (
                      <a
                        href={currentUser.telegramLink}
                        target="_blank"
                        rel="noopener"
                        className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white  font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                      >
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z"
                            fill=""
                          />
                        </svg>
                      </a>
                    )}
                </div>
              </div>
            </div>
          </div>
          {/* personal information */}
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h4>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                      Full Name
                    </p>
                    <p className=" font-medium text-gray-800 dark:text-white/90">
                      {currentUser.fullName}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                      Email address
                    </p>
                    <p className=" font-medium text-gray-800 dark:text-white/90">
                      {currentUser.email}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <p className=" font-medium text-gray-800 dark:text-white/90">
                      {currentUser.phoneNumber}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                      Description
                    </p>
                    <p className=" font-medium text-gray-800 dark:text-white/90">
                      {currentUser.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* social media  */}
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                  Additional Information
                </h4>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                      Role
                    </p>
                    <p className=" font-medium text-gray-800 dark:text-white/90">
                      You're logged in as{" "}
                      {currentUser.role === "ROLE_ADMIN"
                        ? "an ADMIN"
                        : "a LAWYER"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                      Status
                    </p>
                    <p className=" font-medium text-gray-800 dark:text-white/90">
                      {currentUser.lawyerStatus || "Active"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                      Created At
                    </p>
                    <p className=" font-medium text-gray-800 dark:text-white/90">
                      {new Date(currentUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                      Last Updated
                    </p>
                    <p className=" font-medium text-gray-800 dark:text-white/90">
                      {new Date(currentUser.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {/* Expertises */}

                  <div className="inline-block  min-w-full ">
                    <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                      My Expertises
                    </p>
                    <ul className=" font-medium text-gray-800 dark:text-white/90 list-disc list-inside">
                      {currentUser.expertises.map((expertise, index) => (
                        <li
                          key={index}
                          className=" text-white px-2 py-1 rounded-md"
                        >
                          {expertise}
                        </li>
                      )) || "No expertises found"}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-around">
              <div>
                <h4 className="text-lg text-center font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                  My Social Media
                </h4>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <Link
                      to={currentUser.facebookLink || ""}
                      className="mb-2  flex flex-col items-center justify-center leading-normal text-gray-500 dark:text-gray-400"
                    >
                      <Facebook size="32" color="#d9e3f0" />
                      Facebook
                    </Link>
                  </div>

                  <div>
                    <Link
                      to={currentUser.tiktokLink || ""}
                      className="mb-2  flex flex-col items-center justify-center leading-normal text-gray-500 dark:text-gray-400"
                    >
                      <Musicnote size="32" color="#d9e3f0" />
                      TikTok
                    </Link>
                  </div>

                  <div>
                    <Link
                      to={currentUser.telegramLink || ""}
                      className="mb-2 flex flex-col
                    '
                     items-center justify-center leading-normal text-gray-500 dark:text-gray-400"
                    >
                      <Send2 size="32" color="#d9e3f0" />
                      Telegram
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setIsOpen={setIsModalOpen}
        currentUser={currentUser}
      />
    </>
  );
};

export default UserProfiles;
