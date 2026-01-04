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
import AddCustomer from "./pages/Dashboard/CustomerPage/AddClientForm.tsx";
import Role from "./pages/Dashboard/UserPage/Role.tsx";
import ListCustomer from "./pages/Dashboard/CustomerPage/ListClient.tsx";
import ServiceType from "./pages/Dashboard/ServicePage/ServiceType.tsx";
import AddFileDocument from "./pages/Dashboard/filePage/AddFileDocument.tsx";
import ListFileDocument from "./pages/Dashboard/filePage/ListFileDocument.tsx";
import DocumentCategoryList from "./pages/Dashboard/filePage/category/DocumentCategoryList.tsx";
import AddClientForm from "./pages/Dashboard/CustomerPage/AddClientForm.tsx";
import ListCourt from "./pages/Dashboard/CourtPages/ListCourt.tsx";
import CourtForm from "./pages/Dashboard/CourtPages/CourtForm.tsx";
import CaseDetail from "./pages/Dashboard/CasePage/CaseDetail.tsx";
import TaskDetail from "./pages/Dashboard/TaskPage/TaskDetail.tsx";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              <Route path="/service" element={<Service />} />
              <Route path="/service/:id" element={<Service />} />
              <Route path="/list-case" element={<ListCase />} />
              <Route path="/add-case" element={<AddCase />} />
              <Route path="/edit-case/:id" element={<AddCase />} />
              <Route path="/case-detail-info/:id" element={<CaseDetail />} />
              {/* file doc  */}
              <Route path="/add-file-doc" element={<AddFileDocument />} />
              <Route path="/edit-file-doc/:id" element={<AddFileDocument />} />
              <Route path="/doc-category" element={<DocumentCategoryList />} />
              <Route path="/list-file-doc" element={<ListFileDocument />} />
              {/* task  */}
              <Route path="/addtask" element={<AddTask />} />
              <Route path="/listtask" element={<ListTask />} />
              <Route path="/case-detail-info/:id" element={<CaseDetail />} />
              <Route path="/task-detail-info/:id" element={<TaskDetail />} />
              <Route path="/edit-task/:id" element={<AddTask />} />


              <Route path="/list-service" element={<ListService />} />
              {/* client */}
              <Route path="/list-client" element={<ListCustomer />} />
              <Route path="/edit-client/:id" element={<AddClientForm />} />
              {/* court  */}
              <Route path="/list-court" element={<ListCourt />} />
              <Route path="/servicetype" element={<ServiceType />} />
              <Route path="/add-court" element={<CourtForm />} />
              <Route path="/edit-court/:id" element={<CourtForm />} />

              <Route path="/role" element={<Role />} />
              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />
              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />
              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
