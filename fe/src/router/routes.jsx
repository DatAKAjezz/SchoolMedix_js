import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Otp from "../pages/Auth/Otp";
import HomePage from "../pages/HomePage";
import MainLayout from "../layouts/MainLayout";
import { ParentDashboard } from "../pages/ParentDashBoard";
import { StudentHealthProfile } from "../pages/StudentHealthProfile";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/otp",
        element: <Otp />,
      },
      {
        path: "/ParentDashboard",
        element: <ParentDashboard />,
      },
      {
        path: "ParentDashboard/StudentHealthProfile",
        element: <StudentHealthProfile />,
      },
    ],
  },
]);

export default routes;
