import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Icons
import { ChevronDownIcon } from "../icons";
import { IoHome, IoDocumentTextSharp } from "react-icons/io5";
import { MdMiscellaneousServices } from "react-icons/md";
import { HiUsers } from "react-icons/hi2";
import { BsCalendarDateFill } from "react-icons/bs";
import { Courthouse, UserOctagon } from "iconsax-reactjs";

import { useSidebar } from "../context/SidebarContext";

/* ---------------- TYPES ---------------- */

type Role = "ROLE_ADMIN" | "ROLE_LAWYER";

type SubItem = {
  name: string;
  path: string;
  roles?: Role[];
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles?: Role[];
  subItems?: SubItem[];
};

/* ---------------- NAV CONFIG ---------------- */

const navItems: NavItem[] = [
  {
    icon: <IoHome />,
    name: "Dashboard",
    path: "/",
    roles: ["ROLE_ADMIN", "ROLE_LAWYER"],
  },
  {
    icon: <BsCalendarDateFill />,
    name: "Appointments",
    roles: ["ROLE_ADMIN", "ROLE_LAWYER"],
    subItems: [
      { name: "List Appointment", path: "/list-appointment" },
      { name: "Add Appointment", path: "/add-appointment" },
      { name: "Calendar", path: "/appointment-calender" },
    ],
  },
  {
    icon: <BsCalendarDateFill />,
    name: "Tasks",
    roles: ["ROLE_ADMIN", "ROLE_LAWYER"],
    subItems: [
      { name: "List Task", path: "/list-task" },
      { name: "Add Task", path: "/add-task" },
      // { name: "Calendar", path: "/appointment-calender" },
    ],
  },

  /* ---------- ADMIN ONLY ---------- */

  {
    icon: <MdMiscellaneousServices />,
    name: "Services",
    roles: ["ROLE_ADMIN"],
    subItems: [
      { name: "List Service", path: "/list-service" },
      { name: "Service Type", path: "/servicetype" },
    ],
  },
  {
    icon: <IoDocumentTextSharp />,
    name: "Case",
    roles: ["ROLE_ADMIN"],
    subItems: [
      { name: "Add Case", path: "/add-case" },
      { name: "List Case", path: "/list-case" },
    ],
  },
  {
    icon: <HiUsers />,
    name: "Client Control",
    roles: ["ROLE_ADMIN"],
    subItems: [
      { name: "Client List", path: "/list-client" },
      { name: "Poster", path: "/poster" },
    ],
  },
  {
    icon: <UserOctagon size="26" />,
    name: "Our Lawyer",
    roles: ["ROLE_ADMIN"],
    subItems: [{ name: "Lawyer List", path: "/list-lawyer" }],
  },
  {
    icon: <Courthouse size="26" />,
    name: "Court",
    roles: ["ROLE_ADMIN"],
    subItems: [{ name: "Court List", path: "/list-court" }],
  },
];

/* ---------------- COMPONENT ---------------- */

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const role = localStorage.getItem("role") as Role | null;

  const [openSubmenu, setOpenSubmenu] = useState<{ index: number } | null>(
    null,
  );
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>(
    {},
  );

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  );

  /* -------- ROLE FILTER -------- */

  const filteredNavItems = navItems
    .filter((item) => !item.roles || item.roles.includes(role!))
    .map((item) => {
      if (!item.subItems) return item;
      const subs = item.subItems.filter(
        (s) => !s.roles || s.roles.includes(role!),
      );
      return subs.length ? { ...item, subItems: subs } : null;
    })
    .filter(Boolean) as NavItem[];

  /* -------- AUTO OPEN ACTIVE SUBMENU -------- */

  useEffect(() => {
    filteredNavItems.forEach((nav, index) => {
      nav.subItems?.forEach((sub) => {
        if (isActive(sub.path)) setOpenSubmenu({ index });
      });
    });
  }, []);

  useEffect(() => {
    if (openSubmenu) {
      const el = subMenuRefs.current[openSubmenu.index];
      if (el) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [openSubmenu.index]: el.scrollHeight,
        }));
      }
    }
  }, []);

  /* ---------------- RENDER ---------------- */

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 transition-all
      bg-white dark:bg-slate-900
      border-r border-slate-200 dark:border-grey-900
      ${isExpanded || isHovered || isMobileOpen ? "w-[290px]" : "w-[90px]"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LOGO */}
      <div
        className={`py-6 flex items-center border-b border-gray-200 dark:border-gray-800
    ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-center"}`}
      >
        <Link to="/" className="flex items-center gap-3">
          {/* Collapsed logo */}
          {!isExpanded && !isHovered ? (
            <img
              src="https://res.cloudinary.com/diqseuweg/image/upload/v1764937325/GroupGCL_kfldsx.png"
              alt="Logo"
              className="w-12 h-12"
            />
          ) : (
            <>
              {/* Light mode */}
              <img
                src="https://res.cloudinary.com/diqseuweg/image/upload/v1762068621/Group_1_wziare.png"
                alt="Logo"
                className="block dark:hidden w-36"
              />

              {/* Dark mode */}
              <img
                src="https://res.cloudinary.com/diqseuweg/image/upload/v1762068621/Group_1_wziare.png"
                alt="Logo"
                className="hidden dark:block w-36"
              />
            </>
          )}
        </Link>
      </div>

      <nav className="mt-10 px-4">
        <ul className="flex flex-col gap-2">
          {filteredNavItems.map((nav, index) => (
            <li key={nav.name}>
              {nav.subItems ? (
                <>
                  <button
                    onClick={() =>
                      setOpenSubmenu(
                        openSubmenu?.index === index ? null : { index },
                      )
                    }
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg
                    text-slate-700 dark:text-slate-200
                    hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {nav.icon}
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <>
                        <span>{nav.name}</span>
                        <ChevronDownIcon
                          className={`ml-auto transition-transform ${
                            openSubmenu?.index === index ? "rotate-180" : ""
                          }`}
                        />
                      </>
                    )}
                  </button>

                  <div
                    ref={(el) => {
                      subMenuRefs.current[index] = el;
                    }}
                    style={{
                      height:
                        openSubmenu?.index === index ? subMenuHeight[index] : 0,
                    }}
                    className="overflow-hidden transition-all"
                  >
                    <ul className="ml-8 mt-2 space-y-1">
                      {nav.subItems.map((sub) => (
                        <li key={sub.name}>
                          <Link
                            to={sub.path}
                            className={`block px-3 py-1.5 rounded-md text-sm
                            ${
                              isActive(sub.path)
                                ? "bg-blue-500 text-white"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link
                  to={nav.path!}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg
                  ${
                    isActive(nav.path!)
                      ? "bg-blue-500 text-white"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {nav.icon}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span>{nav.name}</span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AppSidebar;
