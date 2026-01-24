import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import ListService from "./pages/Dashboard/ServicePage/ListService.tsx";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Service from "./pages/Dashboard/ServicePage/Service.tsx";
import AddCase from "./pages/Dashboard/CasePage/AddCase.tsx";
import ListCase from "./pages/Dashboard/CasePage/ListCase.tsx";
import ProtectedRoute from "./constants/ProtectedRoute.tsx";
import AddTask from "./pages/Dashboard/TaskPage/AddTask.tsx";
import ListTask from "./pages/Dashboard/TaskPage/ListTask.tsx";

import Role from "./pages/Dashboard/UserPage/Role.tsx";
import ListCustomer from "./pages/Dashboard/CustomerPage/ListClient.tsx";
import ServiceType from "./pages/Dashboard/ServicePage/ServiceType.tsx";
import AddFileDocument from "./pages/Dashboard/filePage/AddFileDocument.tsx";
import ListFileDocument from "./pages/Dashboard/filePage/ListFileDocument.tsx";
import DocumentCategoryList from "./pages/Dashboard/filePage/category/DocumentCategoryList.tsx";

import ListCourt from "./pages/Dashboard/CourtPages/ListCourt.tsx";
import CourtForm from "./pages/Dashboard/CourtPages/CourtForm.tsx";
import CaseDetail from "./pages/Dashboard/CasePage/CaseDetail.tsx";
import TaskDetail from "./pages/Dashboard/TaskPage/TaskDetail.tsx";
import ClientRequestDetail from "./pages/Dashboard/CustomerPage/ClientRequestDetail.tsx";
import AppointmentList from "./pages/Dashboard/appointment/AppointmentList.tsx";
import AddAppointment from "./pages/Dashboard/appointment/AddAppointment.tsx";
import AppointmentDetail from "./pages/Dashboard/appointment/AppointmentDetail.tsx";
import Poster from "./pages/Dashboard/CustomerPage/Poster.tsx";
import LawyerList from "./pages/Dashboard/Lawyer/LawyerList.tsx";
import FormComponent from "./pages/Dashboard/Lawyer/components/FormComponent.tsx";
import ForgetPasswordPage from "./pages/AuthPages/ForgetPassword.tsx";
import OtpPage from "./pages/AuthPages/OtpPage.tsx";
import ResetPassword from "./pages/AuthPages/ResetPassword.tsx";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
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
              <Route path="/appointment-calender" element={<Calendar />} />
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
              <Route path="/poster" element={<Poster />} />
              <Route path="/list-service" element={<ListService />} />
              <Route path="/service" element={<Service />} />
              <Route path="/service/:id" element={<Service />} />
              <Route path="/list-case" element={<ListCase />} />
              <Route path="/add-case" element={<AddCase />} />
              <Route path="/edit-case/:id" element={<AddCase />} />
              <Route path="/case-detail-info/:id" element={<CaseDetail />} />
              <Route
                path="/client-request-info"
                element={<ClientRequestDetail />}
              />
              {/* file doc  */}
              <Route path="/add-file-doc" element={<AddFileDocument />} />
              <Route path="/edit-file-doc/:id" element={<AddFileDocument />} />
              <Route path="/doc-category" element={<DocumentCategoryList />} />
              <Route path="/list-file-doc" element={<ListFileDocument />} />
              <Route path="/add-file-doc" element={<AddFileDocument />} />
              <Route path="/edit-file-doc/:id" element={<AddFileDocument />} />
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
          <Route path="/reset-password-form" element={<ResetPassword />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* <Route path="/unauthorized" element={<div>403 - Unauthorized</div>} /> */}
      </Router>
    </>
  );
}
