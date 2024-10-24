import { createBrowserRouter } from "react-router-dom";
//layout
// import AdminLayout from "../pages/Admin/AdminLayout/AdminLayout";
import HomePage from "../pages/HomePage/HomePage";
import TrainerLayout from "../pages/Trainer/TrainerLayout/TrainerLayout";

//admin
// import TrainerConfirmation from "../pages/Admin/TrainerConfirmation/TrainerConfirmation";
 // import TraineeManagement from "../pages/Admin/TraineeManagement/TraineeManagement";
// import LogWork from "../pages/Admin/LogWork/LogWork";
// import ContentManagement from "../pages/Admin/ContentManagement/ContentManagement";
// import FAQ from "../pages/Admin/FAQ/FAQ";
// import TrackerAdmin from "../pages/Admin/ScheduleTrackerAdmin/TrackerAdmin";
import MainLayout from "../pages/Admin/MainLayout/MainLayout";
import TrainerList from "../pages/Admin/TrainerListPage/TrainerList";
import TrainerManagementPage from "../pages/Admin/TrainerManagementPage/TrainerManagementPage";
import AddTrainerPage from "../pages/Admin/AddTrainerPage/AddTrainerPage";


//trainer
import TrainerConfirmationTrainer from "../pages/Trainer/TrainerConfirmation/TrainerConfirmationTrainer";
import TrainerManagementT from "../pages/Trainer/TrainerManagement/TrainerManagementT";
import TraineeManagementTrainer from "../pages/Trainer/TraineeManagement/TraineeManagementTrainer";
import LogWorkTrainer from "../pages/Trainer/LogWork/LogWorkTrainer";
import ContentManagementTrainer from "../pages/Trainer/ContentManagement/ContentManagementTrainer";
import FAQTrainer from "../pages/Trainer/FAQ/FAQTrainer";
import AddTrainerProfile from "../features/trainer/AddTrainer/AddTrainer";
import ClassDetail from "../pages/Trainer/TrainerConfirmation/classDetail/ClassDetail";
import ScheduleTracker from "../pages/Admin/ScheduleTrackerPage/ScheduleTrackerPage";
import ModuleDetailsPageAD from "../pages/Admin/ClassListPages/ModuleDetailsPage";





export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/ADMIN",
    element: <MainLayout />,
    children: [
      // { path: "", element: <TrainerManagement /> },
      // { path: "trainer-confirmation", element: <TrainerConfirmation /> },
      // { path: "trainee-management", element: <TrainerManagement /> },
      { path: "trainer-management", element: <TrainerManagementPage /> },
      { path: "trainer-list", element: <TrainerList /> },
      { path: "tracker-admin", element: <ScheduleTracker /> },
       { path: "trainer-management/module/info", element: <ModuleDetailsPageAD/> },
      // { path: "logwork", element: <LogWork /> },
      // { path: "content-management", element: <ContentManagement /> },
      // { path: "faqs", element: <FAQ /> },
      { path: "add-trainer", element: <AddTrainerPage /> },
      
    ],
  },
  {
    path: "/TRAINER",
    element: <TrainerLayout />,
    children: [
      // { path: "", element: <TrainerManagement /> },
      { path: "trainer-confirmation", element: <TrainerConfirmationTrainer /> },
      { path: "trainee-management", element: <TraineeManagementTrainer /> },
      { path: "trainer-management", element: <TrainerManagementT /> },
      { path: "logwork", element: <LogWorkTrainer /> },
      { path: "content-management", element: <ContentManagementTrainer /> },
      { path: "faqs", element: <FAQTrainer /> },
      {
        path: "trainer-confirmation/:className", 
        element: <ClassDetail />,
      },
    ],
  },
]);

