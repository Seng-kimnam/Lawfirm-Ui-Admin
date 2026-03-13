import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./constants/ProtectedRoute.tsx";

const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));
const Videos = lazy(() => import("./pages/UiElements/Videos"));
const Images = lazy(() => import("./pages/UiElements/Images"));
const Alerts = lazy(() => import("./pages/UiElements/Alerts"));
const Badges = lazy(() => import("./pages/UiElements/Badges"));
const Avatars = lazy(() => import("./pages/UiElements/Avatars"));
const Buttons = lazy(() => import("./pages/UiElements/Buttons"));
const LineChart = lazy(() => import("./pages/Charts/LineChart"));
const BarChart = lazy(() => import("./pages/Charts/BarChart"));
const AppointmentCalendar = lazy(() => import("./pages/AppointmentCalendar.tsx"));
const BasicTables = lazy(() => import("./pages/Tables/BasicTables"));
const FormElements = lazy(() => import("./pages/Forms/FormElements"));
const Blank = lazy(() => import("./pages/Blank"));
const ListService = lazy(
  () => import("./pages/Dashboard/ServicePage/ListService.tsx"),
);
const Home = lazy(() => import("./pages/Dashboard/Home"));
const Service = lazy(
  () => import("./pages/Dashboard/ServicePage/Service.tsx"),
);
const AddCase = lazy(() => import("./pages/Dashboard/CasePage/AddCase.tsx"));
const ListCase = lazy(() => import("./pages/Dashboard/CasePage/ListCase.tsx"));
const AddTask = lazy(() => import("./pages/Dashboard/TaskPage/AddTask.tsx"));
const ListTask = lazy(() => import("./pages/Dashboard/TaskPage/ListTask.tsx"));

const Role = lazy(() => import("./pages/Dashboard/UserPage/Role.tsx"));
const ListCustomer = lazy(
  () => import("./pages/Dashboard/CustomerPage/ListClient.tsx"),
);
const ServiceType = lazy(
  () => import("./pages/Dashboard/ServicePage/ServiceType.tsx"),
);
const AddFileDocument = lazy(
  () => import("./pages/Dashboard/filePage/AddFileDocument.tsx"),
);
const ListFileDocument = lazy(
  () => import("./pages/Dashboard/filePage/ListFileDocument.tsx"),
);
const DocumentCategoryList = lazy(
  () => import("./pages/Dashboard/filePage/category/DocumentCategoryList.tsx"),
);

const ListCourt = lazy(
  () => import("./pages/Dashboard/CourtPages/ListCourt.tsx"),
);
const CourtForm = lazy(
  () => import("./pages/Dashboard/CourtPages/CourtForm.tsx"),
);
const CaseDetail = lazy(
  () => import("./pages/Dashboard/CasePage/CaseDetail.tsx"),
);
const TaskDetail = lazy(
  () => import("./pages/Dashboard/TaskPage/TaskDetail.tsx"),
);
const ClientRequestDetail = lazy(
  () => import("./pages/Dashboard/CustomerPage/ClientRequestDetail.tsx"),
);
const AppointmentList = lazy(
  () => import("./pages/Dashboard/appointment/AppointmentList.tsx"),
);
const AddAppointment = lazy(
  () => import("./pages/Dashboard/appointment/AddAppointment.tsx"),
);
const AppointmentDetail = lazy(
  () => import("./pages/Dashboard/appointment/AppointmentDetail.tsx"),
);
const LawyerList = lazy(
  () => import("./pages/Dashboard/Lawyer/LawyerList.tsx"),
);
const FormComponent = lazy(
  () => import("./pages/Dashboard/Lawyer/components/FormComponent.tsx"),
);
const ForgetPasswordPage = lazy(
  () => import("./pages/AuthPages/ForgetPassword.tsx"),
);
const OtpPage = lazy(() => import("./pages/AuthPages/OtpPage.tsx"));
const ResetPassword = lazy(
  () => import("./pages/AuthPages/ResetPassword.tsx"),
);
const UserProfiles = lazy(() => import("./pages/UserProfiles.tsx"));
const Banner = lazy(
  () => import("./pages/Dashboard/CustomerPage/Banner.tsx"),
);

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen text-sm text-gray-500">
              Loading...
            </div>
          }
        >
          <Routes>
            {/* Shared routes: Admin + Lawyer */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_LAWYER"]} />
              }
            >
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<UserProfiles />} />
                <Route path="/list-appointment" element={<AppointmentList />} />
                <Route path="/add-appointment" element={<AddAppointment />} />
                <Route
                  path="/edit-appointment/:id"
                  element={<AddAppointment />}
                />
                <Route path="/add-task" element={<AddTask />} />
                <Route path="/list-task" element={<ListTask />} />
                <Route path="/task-detail-info/:id" element={<TaskDetail />} />
                <Route
                  path="/appointment-calender"
                  element={<AppointmentCalendar />}
                />
                <Route
                  path="/appointment-detail/:id"
                  element={<AppointmentDetail />}
                />
                <Route path="/blank" element={<Blank />} />
                {/* Add any other shared pages here */}
              </Route>
            </Route>

            {/* Admin-only routes */}
            <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
              <Route element={<AppLayout />}>
                <Route path="/list-lawyer" element={<LawyerList />} />
                <Route path="/add-new-lawyer" element={<FormComponent />} />
                <Route path="/edit-lawyer/:id" element={<FormComponent />} />
                <Route path="/list-client" element={<ListCustomer />} />
                <Route path="/banner" element={<Banner />} />
                <Route path="/list-service" element={<ListService />} />
                <Route path="/service" element={<Service />} />
                <Route path="/service/:id" element={<Service />} />
                <Route path="/list-case" element={<ListCase />} />
                <Route path="/add-case" element={<AddCase />} />
                <Route path="/edit-case/:id" element={<AddCase />} />
                <Route path="/case-detail-info/:id" element={<CaseDetail />} />
                <Route
                  path="/client-request-history"
                  element={<ClientRequestDetail />}
                />
                {/* file doc  */}

                <Route path="/add-file-doc" element={<AddFileDocument />} />
                <Route
                  path="/edit-file-doc/:id"
                  element={<AddFileDocument />}
                />
                <Route path="/doc-category" element={<DocumentCategoryList />} />
                <Route path="/list-file-doc" element={<ListFileDocument />} />

                {/* ---------------------------------- */}
                <Route path="/addtask" element={<AddTask />} />
                <Route path="/listtask" element={<ListTask />} />
                <Route path="/task-detail-info/:id" element={<TaskDetail />} />
                <Route path="/edit-task/:id" element={<AddTask />} />
                <Route path="/list-court" element={<ListCourt />} />
                <Route path="/servicetype" element={<ServiceType />} />
                <Route path="/add-court" element={<CourtForm />} />
                <Route path="/edit-court/:id" element={<CourtForm />} />
                <Route path="/role" element={<Role />} />
                <Route path="/form-elements" element={<FormElements />} />
                <Route path="/basic-tables" element={<BasicTables />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/avatars" element={<Avatars />} />
                <Route path="/badge" element={<Badges />} />
                <Route path="/buttons" element={<Buttons />} />
                <Route path="/images" element={<Images />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/line-chart" element={<LineChart />} />
                <Route path="/bar-chart" element={<BarChart />} />
              </Route>
            </Route>

            {/* Auth Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forget-password" element={<ForgetPasswordPage />} />
            <Route path="/otp-form" element={<OtpPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        {/* <Route path="/unauthorized" element={<div>403 - Unauthorized</div>} /> */}
      </Router>
    </>
  );
}
