import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Icons
import { ChevronDownIcon } from "../icons";
import { IoHome, IoDocumentTextSharp } from "react-icons/io5";
import { MdMiscellaneousServices } from "react-icons/md";
import { HiUsers } from "react-icons/hi2";
import { BsCalendarDateFill } from "react-icons/bs";
import { Courthouse, TableDocument, Task, UserOctagon } from "iconsax-reactjs";

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
      { name: "Calendar", path: "/appointment-calender" },
      { name: "Add Appointment", path: "/add-appointment" },
    ],
  },

  {
    icon: <Task size="26" />,
    name: "Tasks",
    roles: ["ROLE_ADMIN", "ROLE_LAWYER"],
    subItems: [
      { name: "List Task", path: "/list-task" },
      { name: "Task Form", path: "/add-task" },
      // { name: "Calendar", path: "/appointment-calender" },
    ],
  },

  /* ---------- ADMIN ONLY ---------- */

  {
    icon: <IoDocumentTextSharp />,
    name: "Case",
    roles: ["ROLE_ADMIN"],
    subItems: [
      { name: "List Case", path: "/list-case" },
      { name: "Case Form", path: "/add-case" },
    ],
  },
  {
    icon: <Courthouse size="26" />,
    name: "Court",
    roles: ["ROLE_ADMIN"],
    subItems: [
      { name: "Court List", path: "/list-court" },
      { name: "Court Form", path: "/add-court" },
    ],
  },
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
    icon: <HiUsers />,
    name: "Client Control",
    roles: ["ROLE_ADMIN"],
    subItems: [
      { name: "Client List", path: "/list-client" },
      { name: "Banner", path: "/banner" },
    ],
  },
  {
    icon: <UserOctagon size="26" />,
    name: "Our Lawyer",
    roles: ["ROLE_ADMIN"],
    subItems: [{ name: "Lawyer List", path: "/list-lawyer" }],
  },

  //  {/* file doc  */}
  //             <Route path="/add-file-doc" element={<AddFileDocument />} />
  //             <Route path="/edit-file-doc/:id" element={<AddFileDocument />} />
  //             <Route path="/doc-category" element={<DocumentCategoryList />} />
  //             <Route path="/list-file-doc" element={<ListFileDocument />} />
  {
    icon: <TableDocument size="26" />,
    name: "File Document",
    roles: ["ROLE_ADMIN"],
    subItems: [
      { name: "Document List", path: "/list-file-doc" },
      { name: "Document Category", path: "/doc-category" },
      { name: "Document Form", path: "/add-file-doc" },
    ],
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
      bg-slate-900 text-white dark:bg-gray-900 dark:text-gray-200 border-r border-slate-700 dark:border-gray-800
      ${isExpanded || isHovered || isMobileOpen ? "w-[290px]" : "w-[90px]"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LOGO */}
      <div
        className={`py-6 flex items-center border-b border-slate-700 dark:border-gray-800
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
                    text-white/90 dark:text-gray-200
                    hover:bg-white/10 dark:hover:bg-gray-800"
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
                                ? "bg-white/20 text-white"
                                : "text-white/80 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800"
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
                      ? "bg-white/20 text-white"
                      : "text-white/90 dark:text-gray-200 hover:bg-white/10 dark:hover:bg-gray-800"
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
