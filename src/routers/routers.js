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
import TraineeFeedbackCA from "../pages/Admin/TraineeFeedback/TraineeFeedback";
import EditTemplate from "../pages/Admin/TraineeFeedback/EditTemplate/EditTemplate";



//trainer
import TrainerConfirmationTrainer from "../pages/Trainer/TrainerConfirmation/TrainerConfirmationTrainer";
import TrainerManagementT from "../pages/Trainer/TrainerManagement/TrainerManagementT";
import TraineeManagementTrainer from "../pages/Trainer/TraineeManagement/TraineeManagementTrainer";
import LogWorkTrainer from "../pages/Trainer/LogWork/LogWorkTrainer";
import ContentManagementTrainer from "../pages/Trainer/ContentManagement/ContentManagementTrainer";
import FAQTrainer from "../pages/Trainer/FAQ/FAQTrainer";
import AddTrainerProfile from "../features/trainer/AddTrainer/AddTrainer";
import ClassDetail from "../pages/Trainer/TrainerConfirmation/classDetail/ClassDetail";
import ScheduleTrackerPage from "../pages/Admin/ScheduleTrackerPage/ScheduleTrackerPage";
import ModuleDetailsPageAD from "../pages/Admin/ClassListPages/ModuleDetailsPage";
//delivery manager
import DeliveryManagerLayout from "../pages/DeliveryManager/DeliveryManagerLayout/DeliveryManagerLayout";
import ClassManagementDM from "../pages/DeliveryManager/ClassManagement/ClassManagement";
import TrainerManagementDM from "../pages/DeliveryManager/TrainerManagement/TrainerManagement";
import TraineeListDM from "../pages/DeliveryManager/TraineeManagement/TraineeList/TraineeList";
import FeedbackDM from "../pages/DeliveryManager/TraineeManagement/TraineeFeedback/TraineeFeedback";
import LogWorksDM from "../pages/DeliveryManager/LogWorks/LogWorks";
import ContentManagementDM from "../pages/DeliveryManager/ContentManagement/ContentManagement";
import ReportsDM from "../pages/DeliveryManager/Reports/Reports";
import SettingsDM from "../pages/DeliveryManager/Settings/Settings";
import ConfigHolidayDM from "../pages/DeliveryManager/Settings/ConfigHoliday/ConfigHoliday";
import ConfigSlotTimeDM from "../pages/DeliveryManager/Settings/ConfigSlotTime/ConfigSlotTime";
import ConfigUnitPriceDM from "../pages/DeliveryManager/Settings/ConfigUnitPrice/ConfigUnitPrice";
import ConfigCheckpointDealineDM from "../pages/DeliveryManager/Settings/ConfigCheckpointDeadline/ConfigCheckpointDeadline";
import FAQDM from "../pages/DeliveryManager/FAQ/FAQ";

//trainer manager
import TrainerManagerLayout from "../pages/TrainerManger/TrainerManagerLayout/TrainerManagerLayout";
import ClassManagementTM from "../pages/TrainerManger/ClassManagement/ClassManagement";
import ContentManagementTM from "../pages/TrainerManger/ContentManagement/ContentManagement";
import LogWorksTM from "../pages/TrainerManger/LogWorks/LogWorks";
import FAQTM from "../pages/TrainerManger/FAQ/FAQ";
import Checkpoint1 from "../pages/TrainerManger/ClassManagement/Checkpoint/Checkpoint";

//CA/DM/TM
import Statistics from "../pages/Statistics/Statistics";
import ClassList from "../pages/TrainingReport/ClassList/ClassList";
import TrainingReport from "../pages/TrainingReport/TrainingReport";
//feedbacklink
import FeedbackForm from "../pages/FeedbackLink/FeedbackFrom/FeedBackForm";
import FeedbackLayout from "../pages/FeedbackLink/FeedbackLayout";
import FeedbackLink from "../pages/FeedbackLink/FeedbackLinkPage/FeedbackLink";
import FeedbackSuccess from "../pages/FeedbackLink/FeedbackSucces/FeedbackSucces";
import InProgressClass from "../pages/Admin/ClassManagement/InProgressClass/InProgressClass";
import Checkpoint from "../pages/Admin/ClassManagement/Checkpoint/Checkpoint";
import TraineeList from "../pages/TrainingReport/TraineeList/TraineeList";
import MyEffort from "../pages/Admin/LogWorks/MyEffort/MyEffort";
import DeclareEfforts from "../pages/Admin/LogWorks/DeclareEfforts/DeclareEfforts";
import AddExtensionEfforts from "../pages/Admin/LogWorks/AddExtensionEfforts/AddExtensionEfforts";
import ConfirmEfforts from "../pages/Admin/LogWorks/ConfirmEfforts/ConfirmEfforts";
import TrainingCourseProgram from "../pages/Admin/ContentManagement/TrainingCourseProgram/TrainingCourseProgram";
import TrainingProgram from "../pages/Admin/ContentManagement/TrainingProgram/TrainingProgram";
import Topic from "../pages/Admin/ContentManagement/Topic/Topic";
import Reports from "../pages/Admin/Reports/Reports";
import Faqs from "../pages/Admin/Faqs/Faqs";
import TraineeManagement from "../pages/TrainerManger/TraineeManagement/TraineeManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/CLASS_ADMIN",
    element: <MainLayout />,
    children: [
      { path: "trainer-management", element: <TrainerManagementPage /> },
      { path: "trainer-list", element: <TrainerList /> },
      { path: "class-management/tracker-admin", element: <ScheduleTrackerPage /> },
      { path: "trainer-management/module/info", element: <ModuleDetailsPageAD /> },
      { path: "add-trainer", element: <AddTrainerPage /> },
      { path: "statistics", element: <Statistics /> },
      { path: "trainee-management/trainee-feedback", element: <TraineeFeedbackCA /> },
      // Các route con của trainee-feedback
      { path: "trainee-management/trainee-feedback/edit-template", element: <EditTemplate /> },


      { path: "class-management/class-list", element: <ClassList /> },
      { path: "class-management/training-report", element: <TrainingReport /> },
      {
        path: "/CLASS_ADMIN/class-management/tracker-admin",
        element: <ScheduleTrackerPage />,
      },
      {
        path: "trainer-management/module/info",
        element: <ModuleDetailsPageAD />,
      },
      { path: "add-trainer", element: <AddTrainerPage /> },
      { path: "statistics", element: <Statistics /> },
      {
        path: "/CLASS_ADMIN/trainee-management/trainee-feedback",
        element: <TraineeFeedbackCA />,
      },
      {
        path: "/CLASS_ADMIN/class-management/class-list",
        element: <ClassList />,
      },
      {
        path: "/CLASS_ADMIN/class-management/training-report",
        element: <TrainingReport />,
      },
      {
        path: "/CLASS_ADMIN/class-management/in-progress",
        element: <InProgressClass />,
      },
      {
        path: "/CLASS_ADMIN/class-management/checkpoint",
        element: <Checkpoint />,
      },
      {
        path: "/CLASS_ADMIN/trainee-management/trainee-list",
        element: <TraineeList />,
      },
      {
        path: "/CLASS_ADMIN/logwork/my-effort",
        element: <MyEffort />,
      },
      {
        path: "/CLASS_ADMIN/logwork/declare-efforts",
        element: <DeclareEfforts />,
      },

      {
        path: "/CLASS_ADMIN/logwork/add-extension-efforts",
        element: <AddExtensionEfforts />,
      },

      {
        path: "/CLASS_ADMIN/logwork/confirm-efforts",
        element: <ConfirmEfforts />,
      },
      {
        path: "/CLASS_ADMIN/content-management/course-program",
        element: <TrainingCourseProgram />,
      },
      {
        path: "/CLASS_ADMIN/content-management/program",
        element: <TrainingProgram />,
      },
      {
        path: "/CLASS_ADMIN/content-management/topic",
        element: <Topic />,
      },
      {
        path: "/CLASS_ADMIN/reports/export-data",
        element: <Reports />,
      },
      {
        path: "/CLASS_ADMIN/faqs",
        element: <Faqs />,
      },
    ],
  },

  {
    path: "/TRAINER",
    element: <TrainerLayout />,
    children: [
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
  {
    path: "/DELIVERY_MANAGER",
    element: <DeliveryManagerLayout />,
    children: [
      { path: "class-management", element: <ClassManagementDM /> },
      { path: "trainer-management", element: <TrainerManagementDM /> },
      { path: "trainee-management/trainee-list", element: <TraineeListDM /> },
      { path: "trainee-management/feedback", element: <FeedbackDM /> },
      { path: "logwork", element: <LogWorksDM /> },
      { path: "statistics", element: <Statistics /> },
      { path: "content-management", element: <ContentManagementDM /> },
      { path: "reports", element: <ReportsDM /> },
      { path: "settings/config-holiday", element: <ConfigHolidayDM /> },
      { path: "settings/config-slot-time", element: <ConfigSlotTimeDM /> },
      { path: "settings/config-unit-price", element: <ConfigUnitPriceDM /> },
      {
        path: "settings/config-checkpoint-deadline",
        element: <ConfigCheckpointDealineDM />,
      },
      { path: "faqs", element: <FAQDM /> },

    ],
  },
  {
    path: "/TRAINER_MANAGER",
    element: <TrainerManagerLayout />,
    children: [
      { path: "class-management", element: <ClassManagementTM /> },
      { path: "trainer-management", element: <TrainerManagementDM /> },
      { path: "logwork", element: <LogWorksTM /> },
      { path: "content-management", element: <ContentManagementTM /> },
      { path: "faqs", element: <FAQTM /> },
      {
        path: "/TRAINER_MANAGER/class-management/schedule-tracker",
        element: <ScheduleTrackerPage />,
      },
      {
        path: "/TRAINER_MANAGER/class-management/class-list",
        element: <ClassList />,
      },
      {
        path: "/TRAINER_MANAGER/class-management/training-report",
        element: <TrainingReport />,
      },
      { path: "/TRAINER_MANAGER/statistics", element: <Statistics /> },
      {
        path: "/TRAINER_MANAGER/class-management/in-progress",
        element: <InProgressClass />,
      },
      {
        path: "/TRAINER_MANAGER/class-management/checkpoint",
        element: <Checkpoint1 />,
      },
      {
        path: "/TRAINER_MANAGER/trainee-management",
        element: <TraineeManagement />,
      },
      {
        path: "/TRAINER_MANAGER/logwork/my-effort",
        element: <MyEffort />,
      },
      {
        path: "/TRAINER_MANAGER/logwork/declare-efforts",
        element: <DeclareEfforts />,
      },
      {
        path: "/TRAINER_MANAGER/logwork/add-extension-efforts",
        element: <AddExtensionEfforts />,
      },
      {
        path: "/TRAINER_MANAGER/logwork/confirm-efforts",
        element: <ConfirmEfforts />,
      },
      {
        path: "/TRAINER_MANAGER/content-management/course-program",
        element: <ConfirmEfforts />,
      },
      {
        path: "/TRAINER_MANAGER/content-management/program",
        element: <TrainingProgram />,
      },
      {
        path: "/TRAINER_MANAGER/content-management/topic",
        element: <Topic />,
      },
    ],
  },
  {
    path: "/FEEDBACK_LINK",
    element: <FeedbackLayout />,
    children: [
      { path: "", element: <FeedbackLink /> },
      { path: "feedback-form", element: <FeedbackForm /> },
      { path: "feedback-success", element: <FeedbackSuccess /> },
    ],
  },
]);
