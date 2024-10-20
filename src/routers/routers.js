import { Navigate, createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { PATH_NAME } from "../constants/pathName";
import MainLayoutTrainer from "../pages/Trainer/MainLayout/MainLayout";
import MainLayoutAdmin from "../pages/Admin/MainLayout/MainLayout"
import TrainerManagement from "../pages/Trainer/TrainerManagementPage/TrainerManagementPage";
import RolePage from "../pages/RolePage/RolePage";
import { useSelector } from "react-redux";
import ScheduleTracker from "../pages/Admin/ScheduleTrackerPage/ScheduleTrackerPage";
import ModuleDetailsPage from "../pages/Trainer/ClassListPage/ModuleDetailsPage";
import ModuleDetailsPageAD from "../pages/Admin/ClassListPages/ModuleDetailsPage";
import TrainerList from "../pages/Admin/TrainerListPage/TrainerList";
import TrainerManagementAdmin from "../pages/Admin/TrainerManagementPage/TrainerManagementPage"
import AddTrainerPage from "../pages/Admin/AddTrainerPage/AddTrainerPage";

const PrivateRouteTrainer = ({ children }) => {
  const selectedRole = useSelector((state) => state.role.selectedRole);
  console.log("Selected Role:", selectedRole);
  if (!selectedRole || selectedRole === 'CLASS_ADMIN') {
    return <Navigate to={PATH_NAME.ROLE} replace />;
  }
  else if (selectedRole === 'TRAINER') {
    return children;
  }
};

const PrivateRouteAdmin = ({ children }) => {
  const selectedRole = useSelector((state) => state.role.selectedRole);
  console.log("Selected Role:", selectedRole);
  if (!selectedRole || selectedRole === 'TRAINER') {
    return <Navigate to={PATH_NAME.ROLE} replace />;
  }
  else if (selectedRole === 'CLASS_ADMIN') {
    return children;
  }
};

export const router = createBrowserRouter([
  {
    path: PATH_NAME.TRAINER,
    element: (
      <PrivateRouteTrainer>
        <MainLayoutTrainer />
      </PrivateRouteTrainer>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: PATH_NAME.Trainer_Management,
        element: <TrainerManagement />,
      },
      {
        path: PATH_NAME.MODULE_DETAILS,
        element: <ModuleDetailsPage />,
      },

    ],
  },
  {
    path: PATH_NAME.ADMIN,
    element: (
      <PrivateRouteAdmin>
        <MainLayoutAdmin />
      </PrivateRouteAdmin>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: PATH_NAME.SCHEDULE_TRACKER,
        element: <ScheduleTracker />,
      }, {
        path: PATH_NAME.TRAINER_LIST,
        element: <TrainerList />,
      },
      {
        path: PATH_NAME.Trainer_Management_Admin,
        element: <TrainerManagementAdmin />,
      },
      {
        path: PATH_NAME.Add_Trainer,
        element: <AddTrainerPage />,
      },
      {
        path: PATH_NAME.MODULE_DETAILS_AD,
        element: <ModuleDetailsPageAD />,
      },

    ],
  },
  {
    path: PATH_NAME.ROLE,
    element: <RolePage />,
  },
  {
    path: PATH_NAME.HOME,
    element: <RolePage />,
  },
  {
    path: PATH_NAME.ERROR_404,
    element: <ErrorPage />,
  },
]);
